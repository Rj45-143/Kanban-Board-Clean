"use client";

import { useEffect, useState, useRef} from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import EstimatedCompletionModal from "./EstimatedCompletionModal";
import { getCurrentUser, logout } from "../lib/clientAuth";
import PopupMessage from "./PopupMessage";
import EditTaskModal from "./EditTaskModal";
import { Task } from "../interface/types";
import { styles } from "./KanbanStyles";

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskMenuOpen, setTaskMenuOpen] = useState<string | null>(null);
  const taskMenuRef = useRef<HTMLDivElement | null>(null);
  const taskBtnRef = useRef<HTMLButtonElement | null>(null);

  
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

    // 🔹 Show ALL tasks by default
    setUserFilter("");          // <- empty = all users
    filterTasks(tasks, "");     // <- no filter
  };

  init();
}, []);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (
      taskMenuOpen &&
      taskMenuRef.current &&
      !taskMenuRef.current.contains(e.target as Node) &&
      taskBtnRef.current &&
      !taskBtnRef.current.contains(e.target as Node)
    ) {
      setTaskMenuOpen(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [taskMenuOpen]); // fixed length array, always 1 dependency


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

  const selected = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  // 🔹 Prevent past dates
  if (selected < today) {
    setPopup({ message: "Estimated completion date cannot be in the past.", type: "error" });
    return;
  }

  // 🔹 Prevent year longer than 4 digits
  if (selected.getFullYear() > 9999) {
    setPopup({ message: "Year cannot be more than 4 digits.", type: "error" });
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
  if (!currentTask || currentSourceIndex === null || !currentDestColumnId) return;

  const updatedAllTasks = allTasks.map(t =>
    t.id === currentTask.id
      ? { ...t, inProgressAt: undefined, column: currentTask.column } // ibalik sa original
      : t
  );

  setAllTasks(updatedAllTasks);
  filterTasks(updatedAllTasks, userFilter || undefined);

  setModalOpen(false);
  setCurrentTask(null);
  setCurrentSourceIndex(null);
  setCurrentDestColumnId(null);
};


  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  const handleSaveEditedTask = (updatedTask: Task) => {
    const updatedAllTasks = allTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setAllTasks(updatedAllTasks);
    filterTasks(updatedAllTasks, userFilter || undefined);
    updateTaskInDB(updatedTask);
    setEditModalOpen(false);
  };

  const toggleTaskMenu = (taskId: string) => {
  setTaskMenuOpen(taskMenuOpen === taskId ? null : taskId);
};

const handleMoveTask = (task: Task, destColumnId: Column["id"]) => {
  if (task.column === destColumnId) return;

  // 🔹 Move to In Progress → kailangan modal kung wala pang inProgressAt
  if (destColumnId === "inprogress" && !task.inProgressAt) {
    setCurrentTask(task);
    setCurrentDestColumnId(destColumnId);

    const sourceIndex = columns[task.column].tasks.findIndex(t => t.id === task.id);
    setCurrentSourceIndex(sourceIndex);

    // Temporarily remove from source column
    setColumns(prev => ({
      ...prev,
      [task.column]: {
        ...prev[task.column],
        tasks: prev[task.column].tasks.filter(t => t.id !== task.id),
      },
    }));

    setModalOpen(true);
    setTaskMenuOpen(null); // close menu
    return;
  }

  // 🔹 Move back to To Do → clear inProgressAt and estimatedCompletion
  const updatedTask: Task = {
    ...task,
    column: destColumnId,
    inProgressAt: destColumnId === "todo" ? undefined : task.inProgressAt,
    estimatedCompletion: destColumnId === "todo" ? undefined : task.estimatedCompletion,
    doneAt: destColumnId === "done" && !task.doneAt ? new Date().toISOString() : task.doneAt,
  };

  const updatedAllTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
  setAllTasks(updatedAllTasks);
  filterTasks(updatedAllTasks, userFilter || undefined);
  updateTaskInDB(updatedTask);
  setTaskMenuOpen(null);
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

    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <h1 style={styles.title}>ARK I.T Solution's Kanban Board</h1>

        {/* Filter under title */}
        <div style={styles.filterUnderTitle}>
          <label style={{ fontSize: 14 }}>Filter by user:</label>
          <select
            value={userFilter}
            onChange={handleUserFilterChange}
            style={styles.userSelect}
          >
            <option value="">All Users</option>
            {Array.from(new Set(allTasks.map(t => t.username))).map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.headerRight}>
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

    {/* Action row */}
    <div style={styles.actionRow}>
      <div style={styles.addTask}>
        <input
          value={newTaskContent}
          onChange={e => setNewTaskContent(e.target.value)}
          placeholder="Enter new task..."
          style={styles.input}
        />
        <button onClick={handleAddTask} style={styles.primaryBtn}>
          Add Task
        </button>
      </div>

      <button onClick={handleExportCSV} style={styles.csvBtn}>
        Export Board CSV
      </button>
    </div>

    <DragDropContext onDragEnd={onDragEnd}>
      <div style={styles.board}>
        {Object.values(columns).map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={styles.column}
              >
                <h3 style={styles.columnTitle}>{col.title}</h3>

                {col.tasks.map((task, index) => (
                  <Draggable draggableId={task.id} index={index} key={task.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ ...styles.card, ...provided.draggableProps.style }}
                      >
                        <div style={styles.cardHeader}>
                          <b
                            onClick={() => handleEditTask(task)}
                            style={styles.taskTitle}
                          >
                            {task.content}
                          </b>

                          <div style={styles.cardMeta}>
                            <span style={styles.username}>{task.username}</span>

                            {/* Three-dots menu */}
                            <div style={{ position: "relative" }}>
                              <button
                                ref={taskBtnRef} //
                                onClick={() => toggleTaskMenu(task.id)}
                                style={styles.menuBtn}
                              >
                                ⋮
                              </button>
                              {taskMenuOpen === task.id && (
                                <div
                                  ref={taskMenuRef} // reference sa menu
                                  style={{
                                    ...styles.taskMenuContainer,
                                    width: 140,
                                    padding: "4px 0",
                                    fontSize: 10,
                                  }}
                                >
                                  <button
                                    style={styles.taskMenuOption}
                                    onClick={() => handleEditTask(task)}
                                  >
                                    Edit Details
                                  </button>

                                  <button
                                    style={styles.taskMenuDelete}
                                    onClick={() => handleDeleteTask(col.id, task.id)}
                                  >
                                    Delete
                                  </button>

                                  {/* Dynamic Move/Move back options */}
                                  {(() => {
                                    let moveOptions: { label: string; columnId: Column["id"] }[] = [];

                                    if (col.id === "todo") {
                                      moveOptions = [
                                        { label: "In Progress", columnId: "inprogress" },
                                        { label: "Done", columnId: "done" },
                                      ];
                                    } else if (col.id === "inprogress") {
                                      moveOptions = [
                                        { label: "To Do", columnId: "todo" },
                                        { label: "Done", columnId: "done" },
                                      ];
                                    } else if (col.id === "done") {
                                      moveOptions = [
                                        { label: "To Do", columnId: "todo" },
                                        { label: "In Progress", columnId: "inprogress" },
                                      ];
                                    }

                                    return moveOptions.map((opt) => (
                                      <button
                                        key={opt.columnId}
                                        style={styles.taskMenuOption}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#e0e7ff")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        onClick={() => handleMoveTask(task, opt.columnId)}
                                      >
                                        {col.id === "inprogress"
                                          ? opt.columnId === "todo"
                                            ? "Move back: To Do"
                                            : "Move to: Done"
                                          : col.id === "done"
                                          ? opt.columnId === "todo"
                                            ? "Move back: To Do"
                                            : "Move to: In Progress"
                                          : "Move to: " + opt.label}
                                      </button>
                                    ));
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                          <div style={styles.timestamps}>
                            <small>Created: {new Date(task.createdAt).toLocaleString()}</small>

                            {/* 🔹 Show In Progress & Target if column is In Progress or Done */}
                            {(task.column === "inprogress" || task.column === "done") && task.inProgressAt && (
                              <>
                                <small>In Progress: {new Date(task.inProgressAt).toLocaleString()}</small>
                                {task.estimatedCompletion && (
                                  <small>Target: {new Date(task.estimatedCompletion).toLocaleDateString()}</small>
                                )}
                              </>
                            )}

                            {/* 🔹 Only show Done info if column is done */}
                            {task.column === "done" && task.doneAt && (
                              <small>Done: {new Date(task.doneAt).toLocaleString()}</small>
                            )}
                          </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
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

    <EditTaskModal
      isOpen={editModalOpen}
      task={taskToEdit}
      allUsers={Array.from(new Set(allTasks.map(t => t.username)))}
      onClose={() => setEditModalOpen(false)}
      onSave={handleSaveEditedTask}
    />
  </div>
);

}

