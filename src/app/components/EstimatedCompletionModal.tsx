"use client";

import React, { useState } from "react";
import PopupMessage from "./PopupMessage"; // ✅ import the popup

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string) => void;
}

export default function EstimatedCompletionModal({ isOpen, onClose, onSave }: Props) {
  const [date, setDate] = useState("");
  const [popup, setPopup] = useState<{ message: string; type?: "error" | "success" | "info" } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!date) {
      // Show popup instead of alert
      setPopup({ message: "Please select a date.", type: "error" });
      return;
    }

    onSave(date);
    setDate("");
  };

  const handleCancel = () => {
    setDate("");
    onClose();
  };

  return (
    <>
      {popup && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}

      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={titleStyle}>Set Estimated Completion</h2>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={inputStyle}
          />
          <div style={buttonContainer}>
            <button onClick={handleCancel} style={cancelBtn}>
              Cancel
            </button>
            <button onClick={handleSave} style={saveBtn}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: 32,
  borderRadius: 12,
  width: "90%",
  maxWidth: 400,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: "#1e3a8a",
};

const inputStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  fontSize: 16,
  textAlign: "center",
};

const buttonContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const cancelBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  background: "#e5e7eb",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 500,
};

const saveBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 500,
};
