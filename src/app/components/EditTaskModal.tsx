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

export default function EditTaskModal({
  isOpen,
  task,
  allUsers,
  onClose,
  onSave,
}: Props) {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");

  const [createdAt, setCreatedAt] = useState("");
  const [inProgressAt, setInProgressAt] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [doneAt, setDoneAt] = useState("");

  useEffect(() => {
    if (!task) return;

    setContent(task.content);
    setUsername(task.username);

    setCreatedAt(task.createdAt ? task.createdAt.slice(0, 16) : "");
    setInProgressAt(task.inProgressAt ? task.inProgressAt.slice(0, 16) : "");
    setEstimatedCompletion(task.estimatedCompletion || "");
    setDoneAt(task.doneAt ? task.doneAt.slice(0, 16) : "");
  }, [task]);

  if (!isOpen || !task) return null;

  const isDone = task.column === "done";
  const isInProgress = task.column === "inprogress";

  const handleSave = () => {
    if (!content.trim() || !username || !createdAt) {
      alert("Task content, owner, and created date are required.");
      return;
    }

    onSave({
      ...task,
      content,
      username,
      createdAt: new Date(createdAt).toISOString(),
      inProgressAt: inProgressAt
        ? new Date(inProgressAt).toISOString()
        : undefined,
      estimatedCompletion: estimatedCompletion || undefined,
      doneAt: doneAt ? new Date(doneAt).toISOString() : undefined,
    });
  };

  const disabledStyle = {
    backgroundColor: "#f1f5f9",
    cursor: "not-allowed",
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Edit Task</h2>

        {/* Content */}
        <div style={styles.field}>
          <label style={styles.label}>Content</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Owner */}
        <div style={styles.field}>
          <label style={styles.label}>Owner</label>
          <select
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.select}
          >
            {allUsers.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Created */}
        <div style={styles.field}>
          <label style={styles.label}>Created Date</label>
          <input
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* In Progress */}
        <div style={styles.field}>
          <label style={styles.label}>In Progress Date</label>
          <input
            type="datetime-local"
            value={inProgressAt}
            onChange={(e) => setInProgressAt(e.target.value)}
            disabled={!isDone}
            style={{
              ...styles.input,
              ...(isDone ? {} : disabledStyle),
            }}
          />
        </div>

        {/* Estimated Completion */}
        <div style={styles.field}>
          <label style={styles.label}>Target Date</label>
          <input
            type="date"
            value={estimatedCompletion}
            onChange={(e) => setEstimatedCompletion(e.target.value)}
            disabled={!(isInProgress || isDone)}
            style={{
              ...styles.input,
              ...(isInProgress || isDone ? {} : disabledStyle),
            }}
          />
        </div>

        {/* Done */}
        <div style={styles.field}>
          <label style={styles.label}>Done Date</label>
          <input
            type="datetime-local"
            value={doneAt}
            onChange={(e) => setDoneAt(e.target.value)}
            disabled={!isDone}
            style={{
              ...styles.input,
              ...(isDone ? {} : disabledStyle),
            }}
          />
        </div>

        <div style={styles.actions}>
          <button onClick={onClose} style={{ ...styles.button, ...styles.cancel }}>
            Cancel
          </button>
          <button onClick={handleSave} style={{ ...styles.button, ...styles.save }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: 32,
    borderRadius: 12,
    width: 420,
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 24,
    color: "#1e3a8a",
  },
  field: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    color: "#334155",
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
  },
  select: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    padding: "10px 18px",
    borderRadius: 8,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
  },
  cancel: {
    background: "#f1f5f9",
  },
  save: {
    background: "#3b82f6",
    color: "#fff",
  },
};
