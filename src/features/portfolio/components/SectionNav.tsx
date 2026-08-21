"use client";

import { Lock } from "lucide-react";
import type { SectionStateUI } from "../transformers";

interface SectionNavProps {
  sections:  SectionStateUI[];
  activeKey: string | null;
  onSelect:  (key: string) => void;
  onToggle:  (section: SectionStateUI, enabled: boolean) => void;
  disabled:  boolean;
}

export function SectionNav({ sections, activeKey, onSelect, onToggle, disabled }: SectionNavProps) {
  const enabledCount = sections.filter((s) => s.isEnabled).length;

  return (
    <div style={{ width: 250, flex: "none", display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 8px 8px" }}>
        <span className="label" style={{ color: "var(--text-tertiary)" }}>Sections</span>
        <span className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
          {enabledCount} of {sections.length} on
        </span>
      </div>

      {sections.map((s) => {
        const active = s.sectionKey === activeKey;
        return (
          <div
            key={s.sectionId}
            onClick={() => onSelect(s.sectionKey)}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "0 10px", height: 42,
              borderRadius: "var(--radius-button)", cursor: "pointer",
              background: active ? "var(--accent-subtle)" : "transparent",
              transition: "background var(--duration-fast) var(--ease)",
            }}
          >
            <span
              style={{
                flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                font: `${active ? 500 : 400} 14px var(--font-sans)`,
                color: active ? "var(--accent-text)" : s.isEnabled ? "var(--text-primary)" : "var(--text-tertiary)",
              }}
            >
              {s.label}
            </span>

            {s.isRequired ? (
              <span title="Required by this template" style={{ color: "var(--text-tertiary)", display: "flex" }}>
                <Lock size={13} />
              </span>
            ) : (
              <label className="switch" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={s.isEnabled}
                  disabled={disabled}
                  onChange={(e) => onToggle(s, e.target.checked)}
                />
                <span className="track" />
                <span className="thumb" />
              </label>
            )}
          </div>
        );
      })}

      <div style={{ height: "0.5px", background: "var(--border-default)", margin: "10px 8px" }} />
      <div className="ds-caption" style={{ padding: "0 10px", color: "var(--text-tertiary)" }}>
        Locked sections are required by this template and cannot be turned off.
      </div>
    </div>
  );
}
