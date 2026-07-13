"use client";

import { ActivityItem } from "@/shared/workspace/components/ActivityItem";
import type { AdminUserDetailUI } from "../transformers";

function fmtDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function FieldCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label" style={{ color: "var(--text-tertiary)" }}>{label}</div>
      <div style={{ font: "500 13px var(--font-sans)", color: "var(--text-primary)", marginTop: 5 }}>
        {value || "—"}
      </div>
    </div>
  );
}

export function UserDetailPanel({ detail }: { detail: AdminUserDetailUI }) {
  const { user, phone, activity } = detail;
  const lastActive = activity[0]?.occurredAt;

  return (
    <div className="card card--raised">
      <div
        style={{
          padding: 24, display: "flex", alignItems: "center", gap: 16,
          borderBottom: "0.5px solid var(--border-default)",
        }}
      >
        <span className="avatar avatar--xl" style={{ fontWeight: 600 }}>{user.initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "500 20px var(--font-sans)", letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
            {user.fullName}
          </div>
          <div style={{ font: "400 13px var(--font-sans)", color: "var(--text-secondary)", marginTop: 2 }}>
            {user.email}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <span className={`badge ${user.isActive ? "badge--success" : "badge--warning"}`}>
              {user.isActive ? "Active" : "Inactive"}
            </span>
            <span className="badge badge--neutral">
              {user.role === "superadmin" ? "Super Admin" : "Member"}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px",
          borderBottom: "0.5px solid var(--border-default)",
        }}
      >
        <FieldCell label="User ID" value={String(user.id)} />
        <FieldCell label="Phone" value={phone} />
        <FieldCell label="Joined" value={fmtDate(user.dateJoined)} />
        <FieldCell label="Last active" value={lastActive ? fmtDate(lastActive) : "—"} />
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div className="label" style={{ color: "var(--text-tertiary)", marginBottom: 12 }}>
          Recent activity
        </div>
        {activity.length > 0 ? (
          <div>
            {activity.map((a, i) => (
              <div
                key={a.id}
                style={{ borderBottom: i < activity.length - 1 ? "0.5px solid var(--border-default)" : "none" }}
              >
                <ActivityItem activity={a} compact />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ font: "400 13px var(--font-sans)", color: "var(--text-tertiary)" }}>
            No activity recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
