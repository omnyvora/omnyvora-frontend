"use client";

import type { LucideIcon } from "lucide-react";

interface AlertCardProps {
  icon:  LucideIcon;
  label: string;
  sub:   string;
  value: number | string;
  bg:    string;
  fg:    string;
}

export function AlertCard({ icon: Icon, label, sub, value, bg, fg }: AlertCardProps) {
  return (
    <div className="card card--raised" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 44, height: 44, borderRadius: "var(--radius-icon)", display: "flex",
          alignItems: "center", justifyContent: "center", flex: "none", background: bg, color: fg,
        }}
      >
        <Icon size={20} strokeWidth={1.85} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: "500 14px var(--font-sans)", color: "var(--text-primary)" }}>{label}</div>
        <div style={{ font: "400 12px var(--font-sans)", color: "var(--text-tertiary)", marginTop: 2 }}>{sub}</div>
      </div>
      <span
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 30, height: 28,
          padding: "0 9px", borderRadius: 999, font: "600 15px var(--font-sans)", background: bg, color: fg,
        }}
      >
        {value}
      </span>
    </div>
  );
}
