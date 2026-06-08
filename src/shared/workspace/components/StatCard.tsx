"use client";

import type { LucideIcon } from "lucide-react";

// ── MiniStat ─────────────────────────────────────────────────────────────────

interface MiniStatProps {
  icon:   LucideIcon;
  value:  string | number;
  label:  string;
  bg?:    string;
  fg?:    string;
}

export function MiniStat({ icon: Icon, value, label, bg, fg }: MiniStatProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "var(--bg-surface-raised)",
        border: "0.5px solid var(--border-default)",
        borderRadius: "var(--radius-card)",
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          flex: "none",
          borderRadius: "var(--radius-icon)",
          background: bg ?? "var(--accent-subtle)",
          color: fg ?? "var(--accent-text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={21} strokeWidth={1.85} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            font: "600 28px/1 var(--font-sans)",
            letterSpacing: "-0.5px",
            color: "var(--text-primary)",
          }}
        >
          {value}
        </div>
        <div className="label" style={{ color: "var(--text-tertiary)", marginTop: 6 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ── RingStat ─────────────────────────────────────────────────────────────────

interface RingStatProps {
  percent: number;
  label:   string;
  sub:     string;
}

export function RingStat({ percent, label, sub }: RingStatProps) {
  const deg = Math.round(Math.min(percent, 100) * 3.6);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "var(--bg-surface-raised)",
        border: "0.5px solid var(--border-default)",
        borderRadius: "var(--radius-card)",
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          flex: "none",
          borderRadius: "50%",
          background: `conic-gradient(var(--accent-primary) ${deg}deg, var(--accent-subtle) 0)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "var(--bg-surface-raised)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            font: "600 14px var(--font-sans)",
            color: "var(--text-primary)",
          }}
        >
          {percent}%
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: "500 15px var(--font-sans)", color: "var(--text-primary)" }}>
          {label}
        </div>
        <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
          {sub}
        </div>
      </div>
    </div>
  );
}
