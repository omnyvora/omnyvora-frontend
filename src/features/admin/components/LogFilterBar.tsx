"use client";

import { LOG_LEVELS, type LogLevelFilter } from "../types";

interface LogFilterBarProps {
  value:    LogLevelFilter;
  onChange: (level: LogLevelFilter) => void;
}

export function LogFilterBar({ value, onChange }: LogFilterBarProps) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {LOG_LEVELS.map((level) => {
        const active = level === value;
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            style={{
              height: 32,
              padding: "0 14px",
              borderRadius: 999,
              cursor: "pointer",
              font: "500 13px var(--font-sans)",
              border: `0.5px solid ${active ? "transparent" : "var(--border-default)"}`,
              background: active ? "var(--accent-primary)" : "var(--bg-surface-raised)",
              color: active ? "#fff" : "var(--text-secondary)",
              transition: "all var(--duration-fast) var(--ease)",
            }}
          >
            {level === "ALL" ? "All" : level.charAt(0) + level.slice(1).toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}
