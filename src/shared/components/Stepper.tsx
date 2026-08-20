"use client";

interface StepperStep {
  label: string;
}

interface StepperProps {
  steps:       StepperStep[];
  currentStep: number; // 1-indexed
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((step, i) => {
        const n = i + 1;
        const done = n < currentStep;
        const current = n === currentStep;
        const bg = current ? "var(--accent-primary)" : done ? "var(--text-primary)" : "transparent";
        const fg = current || done ? "var(--bg-page)" : "var(--text-tertiary)";
        const bd = current ? "var(--accent-primary)" : done ? "var(--text-primary)" : "var(--border-strong)";
        const tc = current ? "var(--text-primary)" : "var(--text-secondary)";

        return (
          <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <div
                style={{
                  flex: "none", width: 22, height: 22, borderRadius: 999,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: bg, color: fg, border: `0.5px solid ${bd}`,
                  font: "500 11px/1 var(--font-mono)",
                }}
              >
                {n}
              </div>
              <span style={{ font: "500 12px/1 var(--font-sans)", color: tc, whiteSpace: "nowrap" }}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 0.5, background: "var(--border-default)", minWidth: 14 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
