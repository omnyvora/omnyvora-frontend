"use client";

import type { Notification } from "./types";

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

interface NotifItemProps {
  notification: Notification;
  compact?:     boolean;
  onClick?:     () => void;
}

export function NotifItem({ notification: n, compact = false, onClick }: NotifItemProps) {
  return (
    <div
      className="notif-item"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: compact ? "14px 20px" : "16px 20px",
        cursor: "pointer",
        background: !n.is_read ? "var(--accent-subtle)" : "transparent",
        transition: "background var(--duration-fast) var(--ease)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          flex: "none",
          marginTop: 6,
          background: !n.is_read ? "var(--accent-primary)" : "var(--border-strong)",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div
            style={{
              font: `${n.is_read ? 400 : 500} 14px var(--font-sans)`,
              color: "var(--text-primary)",
              flex: 1,
              minWidth: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {n.title}
          </div>
          <div className="ds-caption" style={{ color: "var(--text-tertiary)", flex: "none" }}>
            {formatTime(n.created_at)}
          </div>
        </div>
        <div
          className="ds-body-sm clamp-2"
          style={{ color: "var(--text-secondary)", marginTop: 2 }}
        >
          {n.body}
        </div>
      </div>
    </div>
  );
}
