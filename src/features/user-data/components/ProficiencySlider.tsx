"use client";

import { useEffect, useState } from "react";

interface ProficiencySliderProps {
  value:      number;
  onCommit:   (value: number) => void;
  disabled?:  boolean;
}

// Native range input, styled to match the design system's input tokens rather
// than pulling in a Radix dependency for something CSS can do on its own.
export function ProficiencySlider({ value, onCommit, disabled }: ProficiencySliderProps) {
  const [live, setLive] = useState(value);

  // Re-sync when the committed value changes from outside (refetch, rollback) —
  // but never while the user's own onChange is what caused it, so we don't need
  // a drag-in-progress guard: onChange always fires before this effect settles.
  useEffect(() => setLive(value), [value]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={live}
        disabled={disabled}
        onChange={(e) => setLive(Number(e.target.value))}
        onMouseUp={(e) => onCommit(Number((e.target as HTMLInputElement).value))}
        onTouchEnd={(e) => onCommit(Number((e.target as HTMLInputElement).value))}
        onKeyUp={(e) => onCommit(Number((e.target as HTMLInputElement).value))}
        className="om-range"
        style={{ flex: 1, accentColor: "var(--accent-primary)" }}
      />
      <span
        style={{
          width: 34, flex: "none", textAlign: "right",
          font: "500 13px var(--font-mono)", color: "var(--text-secondary)",
        }}
      >
        {live}
      </span>
    </div>
  );
}
