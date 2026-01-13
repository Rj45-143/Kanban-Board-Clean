"use client";

import { useEffect } from "react";

interface PopupMessageProps {
  message: string;
  type?: "error" | "success" | "info"; // optional styling types
  duration?: number; // how long it stays visible in ms
  onClose?: () => void;
}

export default function PopupMessage({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: PopupMessageProps) {

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor =
    type === "error" ? "#fee2e2" :
      type === "success" ? "#d1fae5" : "#e0f2fe";

  const textColor =
    type === "error" ? "#b91c1c" :
      type === "success" ? "#065f46" : "#0369a1";

  return (
    <div style={{
      position: "fixed",
      top: 40,                  // 40px from the top
      left: "50%",              // horizontally centered
      transform: "translateX(-50%)",
      background: bgColor,
      color: textColor,
      padding: "16px 24px",
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      zIndex: 9999,
      minWidth: 220,
      fontWeight: 500,
      textAlign: "center",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12
    }}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: textColor,
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
