import { CSSProperties } from "react";

export const styles: Record<string, CSSProperties> = {
    page: {
        backgroundColor: "#dbeafe", // light gray background
        minHeight: "100vh",
        padding: 16,
    },

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
        gap: 8,
    },

    title: {
        fontSize: 32,
        fontWeight: 700,
        color: "#1e3a8a",
    },

    logoRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "flex-start", // siguradong left
    },

    logo: {
        width: 56,
        height: 56,
        objectFit: "contain",
        backgroundColor: "#ffffff",
        borderRadius: 12, // round corners
        padding: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // floating effect
    },
    // headerLeft: {
    //     display: "flex",
    //     flexDirection: "column",
    //     gap: 8
    // },

    // title: { fontSize: 32, fontWeight: 700, color: "#1e3a8a" },

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
    boardWrapper: {
        width: "100%",
        overflowX: "auto",
        backgroundColor: "#f3f4f6", // page background
        padding: "16px 0"
    },

    board: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
        width: "100%",
        alignItems: "start",
    },



    column: {
        background: "#f8fafc",
        borderRadius: 12,
        padding: 12,
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
    },



    columnTitle: {
        textAlign: "center",
        fontWeight: 600,
        color: "#1e40af",
        marginBottom: 12
    },

    /* CARD */
    card: {
        background: "#dbe6f0",
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

        maxInlineSize: "64ch",    // THIS controls words per line

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

    historyContainer: {
        marginTop: 20,
        padding: 8,           //  add padding
        border: "3px solid #96a6c4",
        borderRadius: 8,
        backgroundColor: "#dfe3e9",
        maxHeight: 300,       //  slightly taller
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 6,               //  space between header & list
    },

    historyHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",           // magic
        rowGap: 8,
        columnGap: 12,
        marginBottom: 12,
        position: "sticky",
        top: 0,
        backgroundColor: "#dfe3e9",
        zIndex: 5,
        padding: "12px 16px",
        borderBottom: "1px solid #96a6c4",
    },


    historyFilterRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "flex-end",
        flex: "1 1 auto",        // 🔹 right side on desktop
    },

    historyFilterWrapper: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexWrap: "nowrap",
        maxWidth: "100%",
    },


    historyTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#1e293b",
        flex: "1 1 auto",        // 🔹 allow shrink/grow
        minWidth: 120,
    },

    historyFilterContainer: {
        display: "flex",
        alignItems: "center",
        gap: 6,
    },

    historyInput: {
        fontSize: 12,
        padding: "6px 10px",
        border: "1px solid #cbd5e1",
        borderRadius: 8,
        backgroundColor: "#ffffff",
        color: "#0f172a",
        outline: "none",
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        width: 120,
        maxWidth: "100%",
    },

    historyInputFocus: {
        borderColor: "#6366f1",
        boxShadow: "0 0 0 2px rgba(99,102,241,0.2)",
    },
    historyClearBtn: {
        fontSize: 12,
        padding: "4px 8px",
        border: "none",
        borderRadius: 4,
        backgroundColor: "#e2e8f0",
        cursor: "pointer",
    },
    historyList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },

    historyItem: {
        fontSize: 12,
        color: "#334155",
        lineHeight: 1.4,
        padding: "6px 12px",
        background: "#fff",
        borderRadius: 6,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
    },
    historyItemMeta: {
        color: "#64748b",
        fontStyle: "italic",
        marginLeft: 4,
        fontSize: 11,
    },
    historyNotice: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 8,
        paddingLeft: 12,
    },
    flatpickrContainer: {
        width: 100,
        maxWidth: 220,
    },

    deleteHistoryBtn: {
        background: "#ef4444",
        color: "#fff",
        fontSize: 12,
        padding: "5px 12px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        alignSelf: "center",
    },


    deleteHistoryModalOverlay: {
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },

    deleteHistoryModalContent: {
        background: "#fff",
        padding: 20,
        borderRadius: 8,
        minWidth: 300,
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    },

    deleteHistoryInput: {
        padding: 8,
        width: "100%",
        marginTop: 8,
        borderRadius: 8,
        border: "1px solid #cbd5e1",
    },

    deleteHistoryBtnRow: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 12,
    },

    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },

    modalContent: {
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        width: 360,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
    },

    modalInput: {
        padding: "8px 6px",
        borderRadius: 6,
        border: "1px solid #cbd5e1",
        marginBottom: 12,
        fontSize: 14,
        outline: "none",
        width: "95%",
    },

    secondaryBtn: {
        background: "#e2e8f0",
        color: "#1e293b",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 500,
        minWidth: 90,
        padding: "6px 16px",
    },


};

