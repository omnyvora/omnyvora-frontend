"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon:     LucideIcon;
  label:    string;
  count:    number;
  complete: boolean;
  onManage: () => void;
}

export function CategoryCard({ icon: Icon, label, count, complete, onManage }: CategoryCardProps) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ width: 44, height: 44, borderRadius: "var(--radius-icon)", background: "var(--accent-subtle)", color: "var(--accent-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={21} strokeWidth={1.85} />
        </div>
        <span className={`badge ${complete ? "badge--success" : "badge--neutral"}`}>{complete ? "Added" : "Not started"}</span>
      </div>
      <div>
        <div style={{ font: "600 15px var(--font-sans)", color: "var(--text-primary)" }}>{label}</div>
        <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>{count} {count === 1 ? "entry" : "entries"}</div>
      </div>
      <button className="btn btn--secondary btn--sm" style={{ justifyContent: "space-between" }} onClick={onManage}>
        Manage <ArrowRight size={14} />
      </button>
    </div>
  );
}
