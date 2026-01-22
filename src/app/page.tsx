"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/kanban");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={titleStyle}>Welcome, ARK warrior - Howahh</h2>

          {error && <p style={errorStyle}>{error}</p>}

          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: 0,
  padding: 0,
  backgroundColor: "#dbeafe", // light blue (Tailwind's sky-200)
  backgroundImage: "url('/login-bg.png')",    
};


const overlayStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "400px",
  background: "rgba(255, 255, 255, 0.85)",
  borderRadius: "12px",
  padding: "40px 32px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
};

const formStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "24px",
  fontWeight: 600,
  color: "#1e3a8a",
};

const inputStyle: React.CSSProperties = {
  width: "90%",
  padding: "12px",
  borderRadius: "8px",
  border: "2px solid #cbd5e1",
  fontSize: "14px",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "90%",
  padding: "12px 0",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: 500,
  borderRadius: "50px",
  border: "2px solid #3b82f6",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.2s ease",
  textAlign: "center",
  marginTop: "8px",
};

const errorStyle: React.CSSProperties = {
  color: "#ef4444",
  textAlign: "center",
  marginBottom: "8px",
};
