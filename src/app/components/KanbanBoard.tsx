"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import EstimatedCompletionModal from "./EstimatedCompletionModal";
import { getCurrentUser, logout } from "../lib/clientAuth";
import PopupMessage from "./PopupMessage";

interface Task {
  id: string;
  content: string;
  createdAt: string;
  inProgressAt?: string;
  doneAt?: string;
  username: string;
  estimatedCompletion?: string;
  column: "todo" | "inprogress" | "done";
}

interface Column {
  id: "todo" | "inprogress" | "done";
  title: string;
  tasks: Task[];
}

const initialData: Record<Column["id"], Column> = {
  todo: { id: "todo", title: "To Do", tasks: [] },
  inprogress: { id: "inprogress", title: "In Progress", tasks: [] },
  done: { id: "done", title: "Done", tasks: [] },
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Record<Column["id"], Column>>(initialData);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentDestColumnId, setCurrentDestColumnId] = useState<Column["id"] | null>(null);
  const [currentSourceIndex, setCurrentSourceIndex] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState<string>(""); // "" = All Users
  const [popup, setPopup] = useState<{message: string, type?: "error" | "success" | "info"} | null>(null);

useEffect(() => {
  const init = async () => {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = "/";
      return;
    }
    setUsername(user);

    const res = await fetch("/api/tasks");
    const tasks: Task[] = await res.json();
    setAllTasks(tasks);

    // 🔹 DEFAULT: show only current user's tasks
    setUserFilter(user);
    filterTasks(tasks, user);
  };

  init();
}, []);

// useEffect(() => {
//   const init = async () => {
//     const user = await getCurrentUser();
//     if (!user) {
//       window.location.href = "/";
//       return;
//     }
//     setUsername(user);

//     const res = await fetch("/api/tasks");
//     const tasks: Task[] = await res.json();
//     setAllTasks(tasks);

//     // 🔹 Default: show only current user's tasks
//     setUserFilter(user);
//     filterTasks(tasks, user);
//   };

//   init();
// }, []);

  const filterTasks = (tasks: Task[], filterUser?: string) => {
    // kung empty string o undefined → all tasks
    const filtered = filterUser && filterUser !== "" 
      ? tasks.filter(t => t.username === filterUser)
      : [...tasks];

    const newColumns: Record<Column["id"], Column> = {
      todo: { ...initialData.todo, tasks: [] },
      inprogress: { ...initialData.inprogress, tasks: [] },
      done: { ...initialData.done, tasks: [] },
    };

    filtered.forEach(t => {
      newColumns[t.column].tasks.push(t);
    });

    setColumns(newColumns);
  };

  // const filterTasks = (tasks: Task[], filterUser?: string) => {
  //   const filtered = filterUser ? tasks.filter(t => t.username === filterUser) : [...tasks];

  //   const newColumns: Record<Column["id"], Column> = {
  //     todo: { ...initialData.todo, tasks: [] },
  //     inprogress: { ...initialData.inprogress, tasks: [] },
  //     done: { ...initialData.done, tasks: [] },
  //   };

  //   filtered.forEach(t => {
  //     newColumns[t.column].tasks.push(t);
  //   });

  //   setColumns(newColumns);
  // };

  const handleUserFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setUserFilter(value);
    filterTasks(allTasks, value || undefined);
  };

  const handleAddTask = async () => {
    if (!newTaskContent.trim() || !username) return;

    const task: Task = {
      id: uuidv4(),
      content: newTaskContent,
      createdAt: new Date().toISOString(),
      username,
      column: "todo",
    };

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    const updatedTasks = [...allTasks, task];
    setAllTasks(updatedTasks);
    filterTasks(updatedTasks, userFilter || undefined);
    setNewTaskContent("");
  };

  const updateTaskInDB = async (task: Task) => {
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, updates: task }),
    });
  };

  const handleDeleteTask = async (columnId: Column["id"], taskId: string) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId }),
    });

    const updatedTasks = allTasks.filter(t => t.id !== taskId);
    setAllTasks(updatedTasks);
    filterTasks(updatedTasks, userFilter || undefined);
  };
  
  const onDragEnd = (result: DropResult) => {
  if (!result.destination) return;

  const { source, destination } = result;

  if (source.droppableId === destination.droppableId && source.index === destination.index) return;

  const sourceCol = columns[source.droppableId as Column["id"]];
  const destCol = columns[destination.droppableId as Column["id"]];

  const movedTask = sourceCol.tasks[source.index];

  if (destination.droppableId === "inprogress" && !movedTask.inProgressAt) {
  setCurrentTask(movedTask);
  setCurrentDestColumnId(destination.droppableId as Column["id"]);
  setCurrentSourceIndex(source.index);

  // Remove temporarily from source column
  setColumns(prev => ({
    ...prev,
    [sourceCol.id]: { ...prev[sourceCol.id], tasks: sourceCol.tasks.filter(t => t.id !== movedTask.id) }
  }));

  setModalOpen(true);
  return;
}


  const updatedAllTasks = allTasks.map(t => 
    t.id === movedTask.id
      ? {
          ...t,
          column: destination.droppableId as Task["column"],
          doneAt: destination.droppableId === "done" && !t.doneAt ? new Date().toISOString() : t.doneAt
        }
      : t
  );

  setAllTasks(updatedAllTasks);

  // rebuild columns from allTasks
  filterTasks(updatedAllTasks, userFilter || undefined);

  // update DB
  updateTaskInDB({ ...movedTask, column: destination.droppableId as Task["column"], doneAt: movedTask.doneAt });
};

const handleSaveEstimatedCompletion = (date: string) => {
  if (!currentTask || !currentDestColumnId || currentSourceIndex === null) return;

  const today = new Date();
  const selected = new Date(date);
  today.setHours(0,0,0,0);
  selected.setHours(0,0,0,0);

  if (selected < today) {
    setPopup({ message: "Estimated completion date cannot be in the past.", type: "error" });
    return;
  }

  const updatedTask: Task = {
    ...currentTask,
    inProgressAt: new Date().toISOString(),
    estimatedCompletion: date,
    column: currentDestColumnId,
  };

  const updatedAllTasks = allTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
  setAllTasks(updatedAllTasks);
  filterTasks(updatedAllTasks, userFilter || undefined);
  updateTaskInDB(updatedTask);
  setModalOpen(false);
};

const handleExportCSV = () => {
  // CSV header
  const rows: string[] = [
    "Column,Task Content,Username,Created At,In Progress,Done,Estimated Completion"
  ];

  // Loop over columns and tasks
  Object.values(columns).forEach(col => {
    col.tasks.forEach(task => {
      rows.push([
        col.title,
        `"${task.content.replace(/"/g, '""')}"`, // escape quotes
        task.username,
        task.createdAt,
        task.inProgressAt || "",
        task.doneAt || "",
        task.estimatedCompletion || ""
      ].join(","));
    });
  });

  // Convert to CSV string
  const csv = rows.join("\n");

  // Create download link
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `kanban-board-${new Date().toISOString()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


const handleCancelEstimatedCompletion = () => {
  if (!currentTask || currentSourceIndex === null) return;

  // Update allTasks first
  const updatedAllTasks = allTasks.map(t =>
    t.id === currentTask.id
      ? { ...t, inProgressAt: undefined, column: "todo" as "todo" }
      : t
  );

  setAllTasks(updatedAllTasks);

  // Rebuild columns from updatedAllTasks
  filterTasks(updatedAllTasks, userFilter || undefined);

  // Reset modal state
  setModalOpen(false);
  setCurrentTask(null);
  setCurrentSourceIndex(null);
  setCurrentDestColumnId(null);
};



  return (
    <div style={styles.page}>
        {popup && (
          <PopupMessage
            message={popup.message}
            type={popup.type}
            onClose={() => setPopup(null)}
          />
        )}
      <header style={{ ...styles.header, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={styles.title}>Professional Kanban Board</h1>

        <div style={styles.headerRight}>
          {/* 🔹 Show user avatar */}
          {username && (
            <img
              src={`/${username.toLowerCase()}.jpeg`}
              alt={username}
              style={styles.avatar}
            />
          )}
          <span>{username}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      {/* <div style={styles.filterContainer}>
        <label>Filter by user:</label>
        <select value={userFilter} onChange={handleUserFilterChange} style={styles.userSelect}>
          <option value="">All Users</option>
          {Array.from(new Set(allTasks.map(t => t.username))).map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div> */}

      <div style={styles.filterContainer}>
        <label>Filter by user:</label>
        <select value={userFilter} onChange={handleUserFilterChange} style={styles.userSelect}>
          <option value="">All Users</option>
          {Array.from(new Set(allTasks.map(t => t.username))).map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>


      {/* 🔹 Export CSV Button */}
      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleExportCSV}
          style={{ ...styles.csvBtn, fontSize: 12, padding: "6px 12px" }}
        >
          Export Board CSV
        </button>
      </div>

      <div style={styles.addTask}>
        <input
          value={newTaskContent}
          onChange={e => setNewTaskContent(e.target.value)}
          placeholder="Enter new task..."
          style={styles.input}
        />
        <button onClick={handleAddTask} style={styles.primaryBtn}>Add Task</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.board}>
          {Object.values(columns).map(col => (
            <Droppable droppableId={col.id} key={col.id}>
              {p => (
                <div ref={p.innerRef} {...p.droppableProps} style={styles.column}>
                  <h3 style={styles.columnTitle}>{col.title}</h3>
                  {col.tasks.map((task, i) => (
                    <Draggable draggableId={task.id} index={i} key={task.id}>
                      {p => (
                        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} style={{ ...styles.card, ...p.draggableProps.style }}>
                          <div style={styles.cardHeader}>
                            <b>{task.content}</b>
                            <span>{task.username}</span>
                            <button onClick={() => handleDeleteTask(col.id, task.id)} style={styles.deleteBtn}>❌</button>
                          </div>
                          <div style={styles.timestamps}>
                            <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
                            {task.inProgressAt && <small>In Progress: {new Date(task.inProgressAt).toLocaleString()}</small>}
                            {task.doneAt && <small>Done: {new Date(task.doneAt).toLocaleString()}</small>}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {p.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <EstimatedCompletionModal
        isOpen={modalOpen}
        onClose={handleCancelEstimatedCompletion}
        onSave={handleSaveEstimatedCompletion}
      />
    </div>
  );
}

/* ================= UPDATED STYLES ================= */
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", padding: 20, background: "#f0f4f8" },
  header: { 
    maxWidth: 1200, 
    margin: "0 auto 20px", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  title: { fontSize: 32, fontWeight: 700, color: "#1e3a8a" },
  headerRight: { display: "flex", gap: 12, alignItems: "center" },
  logoutBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer" },

  /* FILTER / DROPDOWN */
  filterContainer: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  userSelect: { 
    padding: "6px 30px", 
    borderRadius: 6, 
    border: "1px solid #cbd5e1", 
    appearance: "none",       // removes default arrow spacing
    background: "url('data:image/svg+xml;utf8,<svg fill=\"%23007bff\" height=\"12\" viewBox=\"0 0 24 24\" width=\"12\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>') no-repeat right 8px center", // custom arrow
    backgroundColor: "#fff",
    cursor: "pointer"
  },

  /* ADD TASK INPUT */
  addTask: { display: "flex", gap: 12, maxWidth: 800, margin: "0 auto 20px" },
  input: { flex: 1, padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" },
  primaryBtn: { background: "#3b82f6", color: "#fff", padding: "10px 16px", borderRadius: 6, border: "none", cursor: "pointer" },
  csvBtn: { background: "green", color: "#fff", padding: "10px 16px", borderRadius: 6, border: "none", cursor: "pointer" },

  /* BOARD */
  board: { display: "flex", gap: 24, justifyContent: "center", width: "100%", overflowX: "auto" },
  column: { background: "#fff", padding: 16, borderRadius: 12, minWidth: 300, flex: "0 0 auto" }, // spacing columns evenly
  columnTitle: { textAlign: "center", fontWeight: 600, color: "#1e40af", marginBottom: 12 },

  /* TASK CARD */
  card: { background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8 },
  deleteBtn: { background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 },
  timestamps: { fontSize: 12, color: "#64748b", display: "flex", flexDirection: "column", gap: 2 },

  /* Avatar Style */
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: 8,
    border: "1px solid #cbd5e1",
  }


};

