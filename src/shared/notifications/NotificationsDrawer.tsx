"use client";

import { CheckCheck, X, Inbox } from "lucide-react";
import { useNotifications, useMarkAllRead } from "./hooks";
import { useNotificationsDrawer } from "./store";
import { NotifItem } from "./NotifItem";

export function NotificationsDrawer() {
  const { isOpen, close }    = useNotificationsDrawer();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAll = useMarkAllRead();

  const handleMarkAll = () => markAll.mutate();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 80,
          background: "rgba(17,17,17,0.45)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity var(--duration-base) var(--ease)",
        }}
      />

      {/* Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 408,
          zIndex: 81,
          background: "var(--bg-overlay)",
          borderLeft: "0.5px solid var(--border-default)",
          boxShadow: "var(--shadow-3)",
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform var(--duration-slow) var(--ease)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "18px 20px",
            borderBottom: "0.5px solid var(--border-default)",
          }}
        >
          <div className="ds-display-sm" style={{ flex: 1 }}>
            Notifications
          </div>
          {notifications.length > 0 && (
            <span
              className="link-accent ds-body-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              onClick={handleMarkAll}
            >
              <CheckCheck size={15} />
              Mark all as read
            </span>
          )}
          <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} onClick={close}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {isLoading ? (
            <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skel" style={{ height: 60, borderRadius: "var(--radius-card)" }} />
              ))}
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((n, i) => (
              <div
                key={n.id}
                style={{
                  borderBottom:
                    i < notifications.length - 1 ? "0.5px solid var(--border-default)" : "none",
                }}
              >
                <NotifItem notification={n} />
              </div>
            ))
          ) : (
            <div style={{ paddingTop: 40 }}>
              <div className="empty">
                <div className="empty__icon">
                  <Inbox size={24} strokeWidth={1.75} />
                </div>
                <div className="empty__title">You&apos;re all caught up</div>
                <div className="empty__desc">
                  New notifications about your account and apps will show up here.
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
