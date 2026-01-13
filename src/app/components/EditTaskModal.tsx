"use client";

import React, { useState, useEffect } from "react";
import { Task } from "../interface/types";

interface Props {
  isOpen: boolean;
  task: Task | null;
  allUsers: string[];
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export default function EditTaskModal({ isOpen, task, allUsers, onClose, onSave }: Props) {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [createdAt, setCreatedAt] = useState(""); // 🔹 new state

  useEffect(() => {
    if (task) {
      setContent(task.content);
      setUsername(task.username);
      setEstimatedCompletion(task.estimatedCompletion || "");

      // convert ISO string to input[type=datetime-local] format
      setCreatedAt(task.createdAt ? task.createdAt.slice(0, 16) : "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (!content.trim() || !username || !createdAt) {
      alert("Task content, owner, and Created date cannot be empty!");
      return;
    }

    onSave({
      ...task,
      content,
      username,
      estimatedCompletion,
      createdAt: new Date(createdAt).toISOString(), // 🔹 save back to ISO
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Edit Task</h2>

        <div style={styles.field}>
          <label style={styles.label}>Content:</label>
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
            style={styles.input}
            placeholder="Enter task content"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Owner:</label>
          <select
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={styles.select}
          >
            {allUsers.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Created Date:</label>
          <input
            type="datetime-local"
            value={createdAt}
            onChange={e => setCreatedAt(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Estimated Completion:</label>
          <input
            type="date"
            value={estimatedCompletion}
            onChange={e => setEstimatedCompletion(e.target.value)}
            style={{
              ...styles.input,
              backgroundColor: task?.column === "inprogress" ? "#fff" : "#f1f5f9",
              cursor: task?.column === "inprogress" ? "pointer" : "not-allowed"
            }}
            disabled={task?.column !== "inprogress"} // 🔹 disabled if not In Progress
            placeholder={task?.column === "inprogress" ? "Select target date" : "Move to In Progress to set"}
          />
        </div>

        <div style={styles.actions}>
          <button onClick={onClose} style={{ ...styles.button, ...styles.cancel }}>Cancel</button>
          <button onClick={handleSave} style={{ ...styles.button, ...styles.save }}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  modal: {
    background: "#fff",
    padding: 32,
    borderRadius: 12,
    width: 420,
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column"
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 24,
    color: "#1e3a8a"
  },
  field: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    color: "#334155"
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    transition: "border 0.2s",
  },
  select: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
    backgroundColor: "#fff",
    appearance: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12
  },
  button: {
    padding: "10px 18px",
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    transition: "background 0.2s"
  },
  cancel: {
    background: "#f1f5f9",
    color: "#475569",
  },
  save: {
    background: "#3b82f6",
    color: "#fff"
  }
};
