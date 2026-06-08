"use client";

import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

// ── Page ─────────────────────────────────────────────────────────────────────

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: "var(--content-max)",
        margin: "0 auto",
        width: "100%",
        padding: "36px 40px 56px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {children}
    </div>
  );
}

// ── PageHead ─────────────────────────────────────────────────────────────────

interface PageHeadProps {
  eyebrow?:  string;
  title:     string;
  subtitle?: string;
  action?:   React.ReactNode;
}

export function PageHead({ eyebrow, title, subtitle, action }: PageHeadProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        {eyebrow && (
          <div className="label" style={{ color: "var(--accent-text)", marginBottom: 6 }}>
            {eyebrow}
          </div>
        )}
        <div className="ds-display-lg" style={{ color: "var(--text-primary)" }}>
          {title}
        </div>
        {subtitle && (
          <div className="ds-body-md" style={{ color: "var(--text-secondary)", marginTop: 6 }}>
            {subtitle}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

// ── SectionRow ───────────────────────────────────────────────────────────────

interface SectionRowProps {
  title:      string;
  linkLabel?: string;
  onLink?:    () => void;
  href?:      string;
}

export function SectionRow({ title, linkLabel, onLink, href }: SectionRowProps) {
  const router = useRouter();
  const handleLink = onLink ?? (href ? () => router.push(href) : undefined);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="ds-display-sm" style={{ color: "var(--text-primary)" }}>
        {title}
      </div>
      {linkLabel && handleLink && (
        <span
          className="link-accent ds-body-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}
          onClick={handleLink}
        >
          {linkLabel}
          <ArrowRight size={14} />
        </span>
      )}
    </div>
  );
}

// ── SubNav ───────────────────────────────────────────────────────────────────

interface SubNavItem {
  id:     string;
  label:  string;
  icon?:  LucideIcon;
}

interface SubNavProps {
  items:    SubNavItem[];
  value:    string;
  onChange: (id: string) => void;
  width?:   number;
}

export function SubNav({ items, value, onChange, width = 200 }: SubNavProps) {
  return (
    <div
      style={{
        width,
        flex: "none",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {items.map((it) => {
        const active = it.id === value;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              height: 40,
              padding: "0 12px",
              width: "100%",
              borderRadius: "var(--radius-button)",
              border: "0.5px solid transparent",
              cursor: "pointer",
              textAlign: "left",
              background: active ? "var(--accent-subtle)" : "transparent",
              color: active ? "var(--accent-text)" : "var(--text-secondary)",
              font: `${active ? 500 : 400} 14px var(--font-sans)`,
              transition:
                "background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)",
            }}
          >
            {Icon && <Icon size={17} strokeWidth={active ? 2 : 1.85} />}
            <span style={{ flex: 1 }}>{it.label}</span>
            {active && <ChevronRight size={15} />}
          </button>
        );
      })}
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

interface TabItem {
  id:     string;
  label:  string;
  icon?:  LucideIcon;
  count?: number;
}

interface TabsProps {
  items:    TabItem[];
  value:    string;
  onChange: (id: string) => void;
}

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        borderBottom: "0.5px solid var(--border-default)",
      }}
    >
      {items.map((it) => {
        const active = it.id === value;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 42,
              padding: "0 14px",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${active ? "var(--accent-primary)" : "transparent"}`,
              marginBottom: "-0.5px",
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              font: `${active ? 500 : 400} 14px var(--font-sans)`,
              transition:
                "color var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease)",
            }}
          >
            {Icon && <Icon size={16} strokeWidth={1.85} />}
            {it.label}
            {typeof it.count === "number" && it.count > 0 && (
              <span
                style={{
                  minWidth: 18,
                  height: 18,
                  padding: "0 5px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--bg-surface)",
                  border: "0.5px solid var(--border-default)",
                  color: "var(--text-secondary)",
                  font: "500 11px var(--font-sans)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon:          LucideIcon;
  title:         string;
  desc:          string;
  actionLabel?:  string;
  onAction?:     () => void;
}

export function EmptyState({ icon: Icon, title, desc, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <div className="empty__title">{title}</div>
      <div className="empty__desc">{desc}</div>
      {actionLabel && onAction && (
        <button
          className="btn btn--secondary btn--sm"
          onClick={onAction}
          style={{ marginTop: 4 }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
