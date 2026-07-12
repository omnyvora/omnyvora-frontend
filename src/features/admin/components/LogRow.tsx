"use client";

import { ChevronRight, ChevronDown } from "lucide-react";
import type { LogRowUI } from "../transformers";

const LEVEL_BADGE: Record<string, string> = {
  ERROR:    "badge--error",
  CRITICAL: "badge--error",
  WARNING:  "badge--warning",
  INFO:     "badge--info",
  SUCCESS:  "badge--success",
  DEBUG:    "badge--neutral",
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

interface LogRowProps {
  log:        LogRowUI;
  expanded:   boolean;
  onToggle:   () => void;
}

export function LogRow({ log, expanded, onToggle }: LogRowProps) {
  const hasTraceback = !!log.traceback;
  const badgeClass = `badge ${LEVEL_BADGE[log.level] ?? "badge--neutral"}`;

  return (
    <div>
      <div
        onClick={hasTraceback ? onToggle : undefined}
        style={{
          display: "grid",
          gridTemplateColumns: "90px 1.1fr 1.7fr 1fr 24px",
          padding: "13px 20px",
          alignItems: "center",
          cursor: hasTraceback ? "pointer" : "default",
        }}
      >
        <span><span className={badgeClass}>{log.level}</span></span>
        <span style={{ font: "400 13px var(--font-sans)", color: "var(--text-secondary)" }}>{log.actor}</span>
        <span
          style={{
            font: "500 12px var(--font-mono)", color: "var(--text-primary)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {log.message}
        </span>
        <span style={{ font: "400 12px var(--font-mono)", color: "var(--text-tertiary)" }}>
          {formatTimestamp(log.timestamp)}
        </span>
        <span style={{ color: "var(--text-tertiary)", display: "flex", justifyContent: "flex-end" }}>
          {hasTraceback && (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </span>
      </div>
      {expanded && hasTraceback && (
        <div style={{ padding: "0 20px 16px" }}>
          <pre
            style={{
              margin: 0,
              background: "var(--gray-950)",
              color: "#e6e6e6",
              borderRadius: "var(--radius-card)",
              padding: "16px 18px",
              font: "400 12px/1.6 var(--font-mono)",
              overflowX: "auto",
              whiteSpace: "pre",
            }}
          >
            {log.traceback}
          </pre>
        </div>
      )}
    </div>
  );
}
