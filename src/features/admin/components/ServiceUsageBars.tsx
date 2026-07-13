"use client";

import type { AdminServiceUI } from "../transformers";

export function ServiceUsageBars({ services }: { services: AdminServiceUI[] }) {
  const max = Math.max(1, ...services.map((s) => s.userCount));

  if (services.length === 0) {
    return (
      <div style={{ font: "400 13px var(--font-sans)", color: "var(--text-tertiary)" }}>
        No services yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      {services.map((s) => (
        <div key={s.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ font: "500 13px var(--font-sans)", color: "var(--text-primary)" }}>{s.name}</span>
            <span style={{ font: "500 12px var(--font-mono)", color: "var(--text-secondary)" }}>
              {s.userCount.toLocaleString()}
            </span>
          </div>
          <div style={{ height: 9, background: "var(--bg-surface)", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                height: "100%", width: `${(s.userCount / max) * 100}%`,
                background: "var(--accent-primary)", borderRadius: 999,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
