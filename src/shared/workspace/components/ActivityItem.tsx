"use client";

import {
  LogIn, LogOut, Plus, Pencil, Trash2, Search, Download,
  KeyRound, ShieldCheck, Upload, Circle, type LucideIcon,
} from "lucide-react";

// Structural shape only — kept local so shared/ never imports a features/*
// transformer type. features/activity's ActivityItemUI satisfies this shape.
export interface ActivityCardItem {
  id:         number;
  action:     string;
  title:      string;
  subtitle:   string;
  occurredAt: string;
}

const ACTION_STYLE: Record<string, { icon: LucideIcon; bg: string; fg: string }> = {
  login:            { icon: LogIn,       bg: "var(--status-success-bg)", fg: "var(--status-success)" },
  logout:           { icon: LogOut,      bg: "var(--status-info-bg)",    fg: "var(--status-info)" },
  resource_created: { icon: Plus,        bg: "var(--accent-subtle)",     fg: "var(--accent-text)" },
  resource_updated: { icon: Pencil,      bg: "var(--accent-subtle)",     fg: "var(--accent-text)" },
  resource_deleted: { icon: Trash2,      bg: "var(--status-error-bg)",   fg: "var(--status-error)" },
  search:           { icon: Search,      bg: "var(--accent-subtle)",     fg: "var(--accent-text)" },
  export:           { icon: Download,    bg: "var(--accent-subtle)",     fg: "var(--accent-text)" },
  password_change:  { icon: KeyRound,    bg: "var(--status-warning-bg)", fg: "var(--status-warning)" },
  password_reset:   { icon: KeyRound,    bg: "var(--status-warning-bg)", fg: "var(--status-warning)" },
  otp_requested:    { icon: ShieldCheck, bg: "var(--status-info-bg)",    fg: "var(--status-info)" },
  file_upload:      { icon: Upload,      bg: "var(--accent-subtle)",     fg: "var(--accent-text)" },
};

const DEFAULT_STYLE = { icon: Circle, bg: "var(--bg-surface-raised)", fg: "var(--text-tertiary)" };

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface ActivityItemProps {
  activity: ActivityCardItem;
  compact?: boolean;
}

export function ActivityItem({ activity, compact = false }: ActivityItemProps) {
  const style = ACTION_STYLE[activity.action] ?? DEFAULT_STYLE;
  const Icon  = style.icon;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: compact ? "14px 20px" : "16px 20px",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          flex: "none",
          borderRadius: "var(--radius-icon)",
          background: style.bg,
          color: style.fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={17} strokeWidth={1.85} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            font: "500 14px var(--font-sans)",
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {activity.title}
        </div>
        <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
          {activity.subtitle}
        </div>
      </div>
      <div className="ds-caption" style={{ color: "var(--text-tertiary)", flex: "none" }}>
        {formatRelativeTime(activity.occurredAt)}
      </div>
    </div>
  );
}
