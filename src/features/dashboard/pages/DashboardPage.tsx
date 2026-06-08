"use client";

import { useRouter } from "next/navigation";
import { Grid2X2, Bell, User } from "lucide-react";
import { useAuth } from "@/shared/auth/context";
import { useNotificationsDrawer } from "@/shared/notifications/store";
import { Page, SectionRow } from "@/shared/workspace/components/ui";
import { MiniStat } from "@/shared/workspace/components/StatCard";
import { AppCard } from "@/shared/workspace/components/AppCard";
import { NotifItem } from "@/shared/notifications/NotifItem";
import {
  useDashboardServices,
  useDashboardNotifications,
  useDashboardUnreadCount,
} from "../hooks";

function WelcomeBanner({ firstName }: { firstName: string }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });
  return (
    <div>
      <div className="ds-display-lg" style={{ color: "var(--text-primary)" }}>
        Welcome back, {firstName}
      </div>
      <div className="ds-body-md" style={{ color: "var(--text-secondary)", marginTop: 6 }}>
        {today}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const router      = useRouter();
  const { user }    = useAuth();
  const openDrawer  = useNotificationsDrawer((s) => s.open);

  const { data: services = [],      isLoading: loadingServices }   = useDashboardServices();
  const { data: notifications = [], isLoading: loadingNotifs }     = useDashboardNotifications();
  const { data: unreadCount = 0 }                                  = useDashboardUnreadCount();

  const recentNotifications = notifications.slice(0, 4);

  return (
    <Page>
      <WelcomeBanner firstName={user?.first_name ?? ""} />

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--grid-gutter)" }}>
        {loadingServices ? (
          <>
            <div className="skel" style={{ height: 80 }} />
            <div className="skel" style={{ height: 80 }} />
            <div className="skel" style={{ height: 80 }} />
          </>
        ) : (
          <>
            <MiniStat icon={Grid2X2} value={services.length}  label="Applications available" />
            <MiniStat icon={Bell}    value={unreadCount}       label="Unread notifications"  bg="var(--red-50)"   fg="var(--status-error)" />
            <MiniStat icon={User}    value="—"                 label="Profile completion"    bg="var(--green-50)" fg="#0b7a52" />
          </>
        )}
      </div>

      {/* Applications grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionRow
          title="Your applications"
          linkLabel="View all"
          href="/applications"
        />
        {loadingServices ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skel" style={{ height: 160 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {services.map((s) => (
              <AppCard
                key={s.id}
                service={s}
                onOpen={(svc) => router.push(`/${svc.slug}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent notifications */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <SectionRow
          title="Recent notifications"
          linkLabel="View all"
          onLink={openDrawer}
        />
        <div className="card">
          {loadingNotifs ? (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2].map((i) => (
                <div key={i} className="skel" style={{ height: 52 }} />
              ))}
            </div>
          ) : recentNotifications.length > 0 ? (
            recentNotifications.map((n, i) => (
              <div
                key={n.id}
                style={{ borderBottom: i < recentNotifications.length - 1 ? "0.5px solid var(--border-default)" : "none" }}
              >
                <NotifItem notification={n} compact onClick={openDrawer} />
              </div>
            ))
          ) : (
            <div style={{ padding: "20px", color: "var(--text-tertiary)", font: "400 14px var(--font-sans)", textAlign: "center" }}>
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
