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
