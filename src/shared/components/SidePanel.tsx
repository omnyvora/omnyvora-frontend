"use client";

import { X } from "lucide-react";

interface SidePanelProps {
  open:      boolean;
  title:     string;
  subtitle?: string;
  onClose:   () => void;
  children:  React.ReactNode;
  footer:    React.ReactNode;
  width?:    number;
}

export function SidePanel({ open, title, subtitle, onClose, children, footer, width = 520 }: SidePanelProps) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 88, background: "rgba(17,17,17,0.45)",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          transition: "opacity var(--duration-base) var(--ease)",
        }}
      />
      <aside
        style={{
          position: "fixed", top: 0, right: 0, height: "100%", width, maxWidth: "92vw", zIndex: 89,
          background: "var(--bg-overlay)", borderLeft: "0.5px solid var(--border-default)", boxShadow: "var(--shadow-3)",
          display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform var(--duration-slow) var(--ease)",
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "0.5px solid var(--border-default)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ds-display-sm">{title}</div>
            {subtitle && <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0, flex: "none" }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {children}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "0.5px solid var(--border-default)" }}>
          {footer}
        </div>
      </aside>
    </>
  );
}
