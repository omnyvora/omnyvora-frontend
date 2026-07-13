"use client";

interface SettingsTabPanelProps {
  title:      string;
  desc:       string;
  children:   React.ReactNode;
  onCancel?:  () => void;
  saving?:    boolean;
  showFooter?: boolean;
}

export function SettingsTabPanel({
  title, desc, children, onCancel, saving = false, showFooter = true,
}: SettingsTabPanelProps) {
  return (
    <div className="card card--raised">
      <div style={{ padding: "18px 22px", borderBottom: "0.5px solid var(--border-default)" }}>
        <div style={{ font: "500 17px var(--font-sans)", letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
          {title}
        </div>
        <div style={{ font: "400 13px var(--font-sans)", color: "var(--text-tertiary)", marginTop: 3 }}>
          {desc}
        </div>
      </div>
      <div style={{ padding: "8px 22px" }}>{children}</div>
      {showFooter && (
        <div style={{ padding: "16px 22px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" className="btn btn--secondary btn--sm" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--accent btn--sm" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      )}
    </div>
  );
}

interface SettingsRowProps {
  title:    string;
  desc:     string;
  children: React.ReactNode;
}

export function SettingsRow({ title, desc, children }: SettingsRowProps) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 16, padding: "16px 0",
        borderBottom: "0.5px solid var(--border-default)",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ font: "500 14px var(--font-sans)", color: "var(--text-primary)" }}>{title}</div>
        <div style={{ font: "400 13px var(--font-sans)", color: "var(--text-secondary)", marginTop: 3 }}>
          {desc}
        </div>
      </div>
      {children}
    </div>
  );
}
