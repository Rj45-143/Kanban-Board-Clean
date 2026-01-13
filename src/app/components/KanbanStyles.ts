import { CSSProperties } from "react";

export const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", padding: 20, background: "#f0f4f8" },

  header: {
    maxWidth: 1200,
    margin: "0 auto 20px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },

  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },

  title: { fontSize: 32, fontWeight: 700, color: "#1e3a8a" },

  filterUnderTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap"
  },

  headerRight: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap"
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer"
  },

  /* ACTION ROW */
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    maxWidth: 1200,
    margin: "0 auto 20px"
  },

  addTask: {
    display: "flex",
    gap: 12,
    flex: 1,
    minWidth: 260,
    flexWrap: "wrap"
  },

  input: {
    flex: 1,
    minWidth: 180,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1"
  },

  primaryBtn: {
    background: "#3b82f6",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
  },

  csvBtn: {
    background: "green",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },

  /* FILTER */
  userSelect: {
    padding: "6px 30px 6px 10px",
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    appearance: "none",
    background:
      "url('data:image/svg+xml;utf8,<svg fill=\"%23007bff\" height=\"12\" viewBox=\"0 0 24 24\" width=\"12\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>') no-repeat right 8px center",
    backgroundColor: "#fff",
    cursor: "pointer"
  },

  /* BOARD */
  board: {
    display: "flex",
    gap: 24,
    justifyContent: "center",
    width: "100%",
    overflowX: "auto"
  },

  column: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    minWidth: 280,
    flex: "0 0 auto"
  },

  columnTitle: {
    textAlign: "center",
    fontWeight: 600,
    color: "#1e40af",
    marginBottom: 12
  },

  /* CARD */
  card: {
    background: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  },

  cardHeader: {
    display: "grid",
    gridTemplateColumns: "1fr",
    rowGap: 6,
    marginBottom: 6
  },


  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: 16
  },

  timestamps: {
    fontSize: 12,
    color: "#64748b",
    display: "flex",
    flexDirection: "column",
    gap: 2
  },

  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  username: {
    fontSize: 12,
    color: "#475569",
    fontWeight: 500
  },


  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid #cbd5e1"
  },

  taskTitle: {
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "1.4em",

    maxInlineSize: "38ch",    // THIS controls words per line

    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    overflow: "hidden",

    wordBreak: "break-word",
    overflowWrap: "anywhere",
    whiteSpace: "normal"
  },
  
  menuBtnStyle: {
    width: "100%",
    padding: "8px 12px",
    textAlign: "left",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
  },

  menuBtn: {
    width: 20,                  // medyo mas malapad
    height: 24,                 // vertical rectangle
    borderRadius: 6,            // soft corners
    background: "#85aceb",      // blue
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",    // vertical dots
    gap: 3,                     // space between dots
    padding: 4,
  },

  // individual dot inside menu button (pseudo-element replacement)
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "#fff",
  },

taskMenuContainer: {
  position: "absolute",
  right: 0,
  top: "100%",
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  zIndex: 10,
  width: 140,          // compact width
  padding: "4px 0",
  fontSize: 13,        // smaller font
},
taskMenuOption: {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "4px 10px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
},
taskMenuDelete: {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "4px 10px",
  border: "none",
  background: "#fee2e2", // light red for delete
  cursor: "pointer",
  color: "#b91c1c",
},

};
  
