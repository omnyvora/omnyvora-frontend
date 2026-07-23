"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { AdminServiceUI } from "../transformers";

interface ServiceAdminCardProps {
  service:   AdminServiceUI;
  onToggle:  (isActive: boolean) => void;
  onOpen?:   () => void;
  onEdit?:   () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export function ServiceAdminCard({ service, onToggle, onOpen, onEdit, onDelete, disabled = false }: ServiceAdminCardProps) {
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`badge ${service.isActive ? "badge--success" : "badge--neutral"}`}>
            {service.isActive ? "Active" : "Inactive"}
          </span>
          {onEdit && (
            <button
              type="button"
              aria-label="Edit service"
              onClick={onEdit}
              style={{
                width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "var(--radius-icon)", border: "none", background: "transparent",
                cursor: "pointer", color: "var(--text-tertiary)",
              }}
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              aria-label="Delete service"
              onClick={onDelete}
              style={{
                width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "var(--radius-icon)", border: "none", background: "transparent",
                cursor: "pointer", color: "var(--status-error)",
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
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

      {onOpen && (
        <button type="button" className="btn btn--secondary btn--sm" onClick={onOpen}>
          Open app
        </button>
      )}
    </div>
  );
}
