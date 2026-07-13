"use client";

import type { AdminServiceUI } from "../transformers";

interface ServiceAdminCardProps {
  service:   AdminServiceUI;
  onToggle:  (isActive: boolean) => void;
  disabled?: boolean;
}

export function ServiceAdminCard({ service, onToggle, disabled = false }: ServiceAdminCardProps) {
  return (
    <div
      className="card card--raised"
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ font: "600 15px var(--font-sans)", color: "var(--text-primary)" }}>
            {service.name}
          </div>
          <div style={{ font: "500 12px var(--font-mono)", color: "var(--text-tertiary)", marginTop: 4 }}>
            {service.userCount.toLocaleString()} users
          </div>
        </div>
        <span className={`badge ${service.isActive ? "badge--success" : "badge--neutral"}`}>
          {service.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ font: "400 13px var(--font-sans)", color: "var(--text-secondary)" }}>
          Available to users
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={service.isActive}
            disabled={disabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span className="track" />
          <span className="thumb" />
        </label>
      </div>
    </div>
  );
}
