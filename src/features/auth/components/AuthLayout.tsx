"use client";

import Image from "next/image";
import { GuestGuard } from "@/shared/auth/guards/GuestGuard";
import { cn } from "@/core/utils/cn";

interface AuthLayoutProps {
  children: React.ReactNode;
  footer?:  React.ReactNode;
  maxWidth?: number;
}

export function AuthLayout({ children, footer, maxWidth = 424 }: AuthLayoutProps) {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-[var(--bg-page)] flex flex-col md:bg-[var(--bg-surface)] md:items-center md:justify-center md:p-10">
        {/* Mobile: full-bleed card; Desktop: centered elevated card */}
        <div
          className={cn(
            "flex-1 flex flex-col overflow-hidden",
            "px-6 pt-[52px] pb-7",
            "md:flex-none md:w-full md:px-0 md:pt-0 md:pb-0",
            "md:rounded-[var(--radius-card)] md:border md:border-[var(--border-default)]",
            "md:bg-[var(--bg-surface-raised)] md:shadow-[var(--shadow-2)]",
          )}
          style={{ maxWidth: `${maxWidth}px` }}
        >
          <div className="flex flex-col gap-[var(--space-7)] flex-1 md:p-9 md:flex-none">
            {children}
          </div>

          {footer && (
            <div className={cn(
              "mt-auto pt-[var(--space-6)] text-center",
              "md:mt-0 md:px-9 md:py-5 md:border-t md:border-[var(--border-default)]",
              "md:bg-[var(--bg-surface)]",
            )}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </GuestGuard>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-5)]">
      <div className="w-[52px] h-[52px] rounded-[var(--radius-card)] bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center flex-none">
        <Image
          src="/logo-mark-black.png"
          alt="Omnyvora"
          width={31}
          height={31}
          className="object-contain"
        />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.4px] text-[var(--text-primary)] m-0">
          {title}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-[320px] leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-[var(--space-4)]" aria-hidden="true">
      <div className="flex-1 h-px bg-[var(--border-default)]" />
      <span className="text-[11px] font-medium tracking-[0.04em] uppercase text-[var(--text-tertiary)]">
        or
      </span>
      <div className="flex-1 h-px bg-[var(--border-default)]" />
    </div>
  );
}

export function FooterLink({
  prompt,
  label,
  href,
}: {
  prompt: string;
  label:  string;
  href:   string;
}) {
  return (
    <span className="text-[13px] text-[var(--text-secondary)]">
      {prompt}{" "}
      <a
        href={href}
        className="text-[var(--accent-text)] font-medium hover:underline"
      >
        {label}
      </a>
    </span>
  );
}

// Google brand mark — self-contained SVG per Google sign-in guidelines.
// Brand colors are the one place outside the design system palette that is allowed.
function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="flex-none"
    >
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.85 14.1a6.6 6.6 0 0 1-.35-2.1c0-.73.13-1.44.35-2.1V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.67 2.84C6.72 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function GoogleButton({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={disabled ? "Coming soon" : undefined}
      className={cn(
        "w-full h-11 flex items-center justify-center gap-3",
        "rounded-[var(--radius-button)] border border-[var(--border-default)]",
        "bg-[var(--bg-surface-raised)] text-[var(--text-primary)]",
        "text-sm font-medium",
        "transition-colors duration-[var(--duration-fast)]",
        "hover:bg-[var(--bg-surface)] hover:border-[var(--border-strong)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]",
      )}
    >
      <GoogleMark size={18} />
      {label}
    </button>
  );
}
