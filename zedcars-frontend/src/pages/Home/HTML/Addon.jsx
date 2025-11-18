import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Addon() {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: "Chart", label: "View Analytics", shortcut: "⌥ A" },
    { icon: "Document", label: "New Report", shortcut: "⌘ N" },
    { icon: "Folder", label: "Create Project", shortcut: "⌘ P" },
    { icon: "Upload", label: "Import Data", shortcut: "⌘ I" },
    { icon: "Settings", label: "Preferences", shortcut: "⌘ ," },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9fafb",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>

      {/* Tiny Trigger Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          height: 48,
          padding: "0 20px",
          background: open ? "#1e293b" : "#ffffff",
          color: open ? "#ffffff" : "#1e293b",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          fontSize: 15,
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: open ? "0 10px 30px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 50,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span style={{ fontSize: 20 }}>{open ? "Close" : "Actions"}</span>
        <kbd style={{
          fontSize: 11,
          padding: "2px 6px",
          background: open ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.06)",
          borderRadius: 4,
          fontWeight: 600,
        }}>
          ⌘ K
        </kbd>
      </motion.button>

      {/* Inline Menu Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            style={{
              position: "fixed",
              bottom: 90,
              right: 24,
              width: 340,
              background: "white",
              borderRadius: 16,
              boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              zIndex: 40,
            }}
          >
            <div style={{ padding: "12px 0" }}>
              {actions.map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ backgroundColor: "#f1f5f9" }}
                  onClick={() => {
                    alert(`${item.label} clicked`);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 15,
                    color: "#334155",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "#64748b",
                    }}>
                      {item.icon[0]}
                    </div>
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <kbd style={{
                    fontSize: 11,
                    color: "#64748b",
                    fontWeight: 500,
                  }}>
                    {item.shortcut}
                  </kbd>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}