"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useDebounce } from "@/core/hooks/useDebounce";
import { useTechnologySearch } from "../hooks";

interface TagInputProps {
  label?:       string;
  value:        string[];
  onChange:     (value: string[]) => void;
  placeholder?: string;
  hint?:        string;
}

export function TagInput({ label, value, onChange, placeholder = "Add and press Enter", hint }: TagInputProps) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const debouncedText = useDebounce(text, 250);
  const { data: results } = useTechnologySearch(debouncedText);
  const suggestions = (results ?? []).map((t) => t.name).slice(0, 6);

  // The dropdown stays open across picks (only the text clears) so several tags
  // can be added back-to-back without re-opening it — already-added suggestions
  // stay visible with a checkmark instead of disappearing from the list.
  function add(raw: string) {
    const name = raw.trim();
    if (!name || value.includes(name)) return;
    onChange([...value, name]);
    setText("");
  }

  return (
    <div className="field" style={{ position: "relative" }}>
      {label && <label className="label">{label}</label>}
      <div
        style={{
          display: "flex", flexWrap: "wrap", gap: 8, padding: 8, minHeight: 42,
          border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-input)",
          background: "var(--bg-surface)",
        }}
      >
        {value.map((v) => (
          <span
            key={v}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 4px 0 10px",
              borderRadius: "var(--radius-pill)", background: "var(--accent-subtle)", color: "var(--accent-text)",
              font: "500 12px var(--font-sans)",
            }}
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== v))}
              style={{
                width: 18, height: 18, border: "none", background: "transparent", borderRadius: "50%",
                cursor: "pointer", color: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(text); } }}
          placeholder={value.length ? "" : placeholder}
          style={{
            flex: 1, minWidth: 120, border: "none", outline: "none", background: "transparent",
            font: "400 13px var(--font-sans)", color: "var(--text-primary)",
          }}
        />
      </div>
      {open && debouncedText && suggestions.length > 0 && (
        <div
          className="card card--raised"
          style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, zIndex: 20, overflow: "hidden" }}
        >
          {suggestions.map((s) => {
            const added = value.includes(s);
            return (
              <div
                key={s}
                onMouseDown={() => (added ? onChange(value.filter((v) => v !== s)) : add(s))}
                className="row-hover"
                style={{
                  padding: "9px 12px", cursor: "pointer", font: "400 13px var(--font-sans)",
                  color: added ? "var(--accent-text)" : "var(--text-primary)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                }}
              >
                {s}
                {added && <Check size={14} />}
              </div>
            );
          })}
        </div>
      )}
      {hint && <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>{hint}</div>}
    </div>
  );
}
