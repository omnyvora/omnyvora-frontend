"use client";

interface FormCheckboxProps {
  label:    string;
  checked:  boolean;
  onChange: (checked: boolean) => void;
}

export function FormCheckbox({ label, checked, onChange }: FormCheckboxProps) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: "var(--accent-primary)" }}
      />
      <span className="ds-body-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
    </label>
  );
}
