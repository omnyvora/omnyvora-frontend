"use client";

import * as Icons from "lucide-react";

export interface AppCardService {
  id:          number;
  slug:        string;
  name:        string;
  description: string;
  icon:        string;
  category:    string;
  bg:          string;
  fg:          string;
}

interface AppCardProps {
  service:      AppCardService;
  showCategory?: boolean;
  onOpen?:      (service: AppCardService) => void;
}

function ServiceIcon({ name, size }: { name: string; size: number }) {
  const pascal = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const LucideIcon = (Icons as Record<string, unknown>)[pascal] as
    | React.ComponentType<{ size: number; strokeWidth: number }>
    | undefined;

  if (!LucideIcon) {
    const Fallback = Icons.Box;
    return <Fallback size={size} strokeWidth={1.75} />;
  }
  return <LucideIcon size={size} strokeWidth={1.75} />;
}

export function AppCard({ service, showCategory = false, onOpen }: AppCardProps) {
  return (
    <div
      className="app-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "var(--bg-surface-raised)",
        border: "0.5px solid var(--border-default)",
        borderRadius: "var(--radius-card)",
        padding: 20,
        transition: "box-shadow var(--duration-fast) var(--ease)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-icon)",
            background: service.bg,
            color: service.fg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ServiceIcon name={service.icon} size={24} />
        </div>
        {showCategory && (
          <span className="badge badge--neutral">{service.category}</span>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ font: "600 15px var(--font-sans)", color: "var(--text-primary)" }}>
          {service.name}
        </div>
        <div
          className="ds-body-sm clamp-2"
          style={{ color: "var(--text-secondary)", marginTop: 4 }}
        >
          {service.description}
        </div>
      </div>

      <div>
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onOpen?.(service)}
        >
          {showCategory ? "Open app" : "Open"}
        </button>
      </div>
    </div>
  );
}
