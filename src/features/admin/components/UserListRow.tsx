"use client";

import type { AdminUserListItemUI } from "../transformers";

interface UserListRowProps {
  user:     AdminUserListItemUI;
  active:   boolean;
  onClick:  () => void;
}

export function UserListRow({ user, active, onClick }: UserListRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        cursor: "pointer",
        borderBottom: "0.5px solid var(--border-default)",
        background: active ? "var(--accent-subtle)" : "transparent",
        transition: "background var(--duration-fast) var(--ease)",
      }}
    >
      <span className="avatar avatar--md" style={{ fontWeight: 600, flex: "none" }}>
        {user.initials}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            font: "500 13px var(--font-sans)", color: "var(--text-primary)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {user.fullName}
        </div>
        <div
          style={{
            font: "400 12px var(--font-sans)", color: "var(--text-tertiary)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {user.email}
        </div>
      </div>
      <span
        style={{
          width: 8, height: 8, borderRadius: 4, flex: "none",
          background: user.isActive ? "var(--status-success)" : "var(--status-warning)",
        }}
      />
    </div>
  );
}
