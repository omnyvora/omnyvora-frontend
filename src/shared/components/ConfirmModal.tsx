"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export interface ConfirmConfig {
  title:         string;
  body:          string;
  confirmLabel:  string;
  tone:          "danger" | "warning";
  requireType?:  boolean;
}

interface ConfirmModalProps {
  config:    ConfirmConfig | null;
  onClose:   () => void;
  onConfirm: () => void;
}

export function ConfirmModal({ config, onClose, onConfirm }: ConfirmModalProps) {
  const [typed, setTyped] = useState("");

  if (!config) return null;

  const danger  = config.tone === "danger";
  const blocked = config.requireType && typed.trim().toUpperCase() !== "DELETE";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        background: "rgba(17,17,17,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "omFade .18s ease",
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 440,
          background: "var(--bg-overlay)",
          borderRadius: "var(--radius-modal)",
          boxShadow: "var(--shadow-3)",
          animation: "omPop .18s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div style={{ padding: "24px 24px 20px", display: "flex", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              flex: "none",
              borderRadius: "var(--radius-icon)",
              background: danger ? "var(--status-error-bg)" : "var(--status-warning-bg)",
              color: danger ? "var(--status-error)" : "var(--status-warning)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="ds-display-sm" style={{ color: "var(--text-primary)" }}>
              {config.title}
            </div>
            <div className="ds-body-md" style={{ color: "var(--text-secondary)", marginTop: 6 }}>
              {config.body}
            </div>
            {config.requireType && (
              <div style={{ marginTop: 16 }}>
                <div className="field">
                  <label className="label">Type &ldquo;DELETE&rdquo; to confirm</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      placeholder="DELETE"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: "16px 24px",
            borderTop: "0.5px solid var(--border-default)",
          }}
        >
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          {danger ? (
            <button
              className="btn btn--danger"
              disabled={!!blocked}
              onClick={onConfirm}
            >
              {config.confirmLabel}
            </button>
          ) : (
            <button
              onClick={onConfirm}
              style={{
                height: 38,
                padding: "0 16px",
                borderRadius: "var(--radius-button)",
                cursor: "pointer",
                border: "none",
                background: "var(--status-warning)",
                color: "#fff",
                font: "500 13px var(--font-sans)",
              }}
            >
              {config.confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
