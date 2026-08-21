"use client";

interface FilterBarProps {
  options:   string[];
  value:     string;
  onChange:  (value: string) => void;
  search:    string;
  onSearch:  (q: string) => void;
  placeholder: string;
  trailing?: React.ReactNode;
}

export function FilterBar({ options, value, onChange, search, onSearch, placeholder, trailing }: FilterBarProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <input
        className="input"
        style={{ width: 260, height: 34 }}
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              height: 30, padding: "0 12px", borderRadius: "var(--radius-pill)", cursor: "pointer",
              border: `0.5px solid ${active ? "var(--accent-primary)" : "var(--border-default)"}`,
              background: active ? "var(--accent-subtle)" : "var(--bg-surface-raised)",
              color: active ? "var(--accent-text)" : "var(--text-secondary)",
              font: `${active ? 500 : 400} 12px var(--font-sans)`,
            }}
          >
            {opt}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      {trailing}
    </div>
  );
}
