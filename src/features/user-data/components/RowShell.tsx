"use client";

import { GripVertical, type LucideIcon } from "lucide-react";

interface RowShellProps {
  dragProps: { onDragStart: () => void };
  icon?:     LucideIcon;
  thumb?:    React.ReactNode;
  title:     React.ReactNode;
  meta?:     React.ReactNode;
  extra?:    React.ReactNode;
  actions:   React.ReactNode;
}

export function RowShell({ dragProps, icon: Icon, thumb, title, meta, extra, actions }: RowShellProps) {
  return (
    <div
      className="row-hover"
      draggable
      onDragStart={dragProps.onDragStart}
      style={{
        display: "flex", alignItems: "flex-start", gap: 14, padding: 16,
        border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-card)",
        background: "var(--bg-surface-raised)",
      }}
    >
      <span title="Drag to reorder" style={{ flex: "none", color: "var(--text-tertiary)", cursor: "grab", display: "flex", alignItems: "center", height: 40 }}>
        <GripVertical size={15} />
      </span>
      {thumb || (
        <div style={{ width: 40, height: 40, flex: "none", borderRadius: "var(--radius-icon)", background: "var(--accent-subtle)", color: "var(--accent-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {Icon && <Icon size={19} strokeWidth={1.85} />}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ font: "600 14px var(--font-sans)", color: "var(--text-primary)" }}>{title}</div>
          {meta}
        </div>
        {extra}
      </div>
      <div style={{ display: "flex", gap: 4, flex: "none" }}>{actions}</div>
    </div>
  );
}
