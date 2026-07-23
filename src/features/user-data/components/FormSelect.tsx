"use client";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label?:       string;
  value:        string;
  onChange:     (value: string) => void;
  options:      (string | Option)[];
  placeholder?: string;
  hint?:        string;
}

export function FormSelect({ label, value, onChange, options, placeholder, hint }: FormSelectProps) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)} style={{ cursor: "pointer" }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) =>
          typeof o === "string"
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>,
        )}
      </select>
      {hint && <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>{hint}</div>}
    </div>
  );
}
