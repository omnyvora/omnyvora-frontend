"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Grid2X2,
  History,
  User,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useAuth } from "@/shared/auth/context";
import { useNotificationsDrawer } from "@/shared/notifications/store";
import { useUnreadCount } from "@/shared/notifications/hooks";
import { useLogout } from "@/features/auth/hooks";
import { useWorkspaceStore } from "../store";

const NAV = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, href: "/dashboard" },
  { id: "applications", label: "Applications", icon: Grid2X2,         href: "/applications" },
  { id: "portfolio",    label: "Portfolio",    icon: Layers,          href: "/services/portfolio" },
  { id: "activity",     label: "Activity",     icon: History,         href: "/activity" },
  { id: "profile",      label: "Profile",      icon: User,            href: "/profile" },
  { id: "account",      label: "Account",      icon: ShieldCheck,     href: "/account" },
];

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function Sidebar() {
  const pathname   = usePathname();
  const { user }   = useAuth();
  const logout     = useLogout();
  const collapsed  = useWorkspaceStore((s) => s.sidebarCollapsed);
  const toggle     = useWorkspaceStore((s) => s.toggleSidebar);
  const openDrawer = useNotificationsDrawer((s) => s.open);
  const { data: unreadCount = 0 } = useUnreadCount();

  const W   = collapsed ? 76 : 256;
  const pad = collapsed ? 12 : 16;

  return (
    <nav
      style={{
        width: W,
        flex: "none",
        height: "100%",
        background: "var(--bg-surface)",
        borderRight: "0.5px solid var(--border-default)",
        display: "flex",
        flexDirection: "column",
        padding: pad,
        gap: 4,
        transition: "width var(--duration-base) var(--ease)",
        position: "relative",
      }}
    >
      {/* Brand header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "4px 0 12px" : "4px 8px 14px",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-mark-black.png"
          alt="Omnyvora"
          style={{ width: 26, height: 26, objectFit: "contain", flex: "none" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {!collapsed && (
          <span style={{ font: "600 17px var(--font-sans)", letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
            Omnyvora
          </span>
        )}
      </div>

      <div style={{ height: "0.5px", background: "var(--border-default)", margin: collapsed ? "0 0 8px" : "0 0 10px" }} />

      {!collapsed && (
        <div className="label" style={{ padding: "2px 10px 6px", color: "var(--text-tertiary)" }}>
          Menu
        </div>
      )}

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon   = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                width: "100%",
                height: 40,
                padding: collapsed ? "0" : "0 11px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: "var(--radius-button)",
                border: "0.5px solid transparent",
                cursor: "pointer",
                background: active ? "var(--accent-subtle)" : "transparent",
                color: active ? "var(--accent-text)" : "var(--text-secondary)",
                font: `${active ? 500 : 400} 14px var(--font-sans)`,
                textDecoration: "none",
                transition: "background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "var(--bg-surface-raised)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.85} />
              {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>}
              {!collapsed && active && (
                <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--accent-primary)" }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom section */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ height: "0.5px", background: "var(--border-default)", margin: "6px 0 8px" }} />

        {!collapsed && user && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 10px 8px" }}>
            <div className="avatar avatar--md" style={{ flex: "none" }}>
              {getInitials(user.first_name, user.last_name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "500 13px var(--font-sans)", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.first_name} {user.last_name}
              </div>
              <div style={{ font: "400 11px var(--font-sans)", color: "var(--text-tertiary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={openDrawer}
          title={collapsed ? "Notifications" : undefined}
          style={{
            display: "flex", alignItems: "center", gap: 11, width: "100%", height: 40,
            padding: collapsed ? "0" : "0 11px", justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "var(--radius-button)", border: "0.5px solid transparent", cursor: "pointer",
            background: "transparent", color: "var(--text-secondary)", font: "400 14px var(--font-sans)",
            transition: "background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)",
            position: "relative",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-raised)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <span style={{ position: "relative", display: "flex" }}>
            <Bell size={18} strokeWidth={1.85} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: 4, background: "var(--status-error)", border: "1.5px solid var(--bg-surface)" }} />
            )}
          </span>
          {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>Notifications</span>}
          {!collapsed && unreadCount > 0 && (
            <span style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: "var(--radius-pill)", background: "var(--status-error)", color: "#fff", font: "500 11px var(--font-sans)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={() => logout.mutate()}
          title={collapsed ? "Log out" : undefined}
          disabled={logout.isPending}
          style={{
            display: "flex", alignItems: "center", gap: 11, width: "100%", height: 40,
            padding: collapsed ? "0" : "0 11px", justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "var(--radius-button)", border: "0.5px solid transparent", cursor: "pointer",
            background: "transparent", color: "var(--text-secondary)", font: "400 14px var(--font-sans)",
            transition: "background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--status-error-bg)"; e.currentTarget.style.color = "var(--status-error)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <LogOut size={18} strokeWidth={1.85} />
          {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>Log out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        title={collapsed ? "Expand" : "Collapse"}
        style={{
          position: "absolute", top: 18, right: -11, width: 22, height: 22, borderRadius: "50%",
          background: "var(--bg-surface-raised)", border: "0.5px solid var(--border-strong)",
          boxShadow: "var(--shadow-1)", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--text-secondary)", zIndex: 5, padding: 0,
        }}
      >
        <ChevronRight
          size={13}
          style={{ transform: collapsed ? "none" : "rotate(180deg)", transition: "transform var(--duration-base) var(--ease)" }}
        />
      </button>
    </nav>
  );
}
