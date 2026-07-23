"use client";

import { useRouter } from "next/navigation";
import { Grid2X2, Bell } from "lucide-react";
import { useAuth } from "@/shared/auth/context";
import { useNotificationsDrawer } from "@/shared/notifications/store";
import { Page, SectionRow } from "@/shared/workspace/components/ui";
import { RingStat } from "@/shared/workspace/components/StatCard";
import { AppCard } from "@/shared/workspace/components/AppCard";
import { getServiceOpenPath } from "@/features/catalog/utils";
import { NotifItem } from "@/shared/notifications/NotifItem";
import type { Notification } from "@/shared/notifications/types";
import { ActivityItem } from "@/shared/workspace/components/ActivityItem";
import type { ActivityItemUI } from "@/features/activity/transformers";
import {
  useDashboardServices,
  useDashboardNotifications,
  useDashboardUnreadCount,
  useDashboardProfile,
  useDashboardActivity,
} from "../hooks";
import { getProfileCompletionHint } from "../utils";

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

interface RecentNotificationsProps {
  notifications: Notification[];
  isLoading:     boolean;
  onOpen:        () => void;
}

function RecentNotifications({ notifications, isLoading, onOpen }: RecentNotificationsProps) {
  const recent = notifications.slice(0, 4);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionRow title="Recent notifications" linkLabel="View all" onLink={onOpen} />
      <div className="card">
        {isLoading ? (
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2].map((i) => (
              <div key={i} className="skel" style={{ height: 52 }} />
            ))}
          </div>
        ) : recent.length > 0 ? (
          recent.map((n, i) => (
            <div
              key={n.id}
              style={{ borderBottom: i < recent.length - 1 ? "0.5px solid var(--border-default)" : "none" }}
            >
              <NotifItem notification={n} compact onClick={onOpen} />
            </div>
          ))
        ) : (
          <div style={{ padding: "20px", color: "var(--text-tertiary)", font: "400 14px var(--font-sans)", textAlign: "center" }}>
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}

interface RecentActivityProps {
  activity:  ActivityItemUI[];
  isLoading: boolean;
  onViewAll: () => void;
}

function RecentActivity({ activity, isLoading, onViewAll }: RecentActivityProps) {
  const recent = activity.slice(0, 4);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionRow title="Recent activity" linkLabel="View all" onLink={onViewAll} />
      <div className="card">
        {isLoading ? (
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2].map((i) => (
              <div key={i} className="skel" style={{ height: 52 }} />
            ))}
          </div>
        ) : recent.length > 0 ? (
          recent.map((a, i) => (
            <div
              key={a.id}
              style={{ borderBottom: i < recent.length - 1 ? "0.5px solid var(--border-default)" : "none" }}
            >
              <ActivityItem activity={a} compact />
            </div>
          ))
        ) : (
          <div style={{ padding: "20px", color: "var(--text-tertiary)", font: "400 14px var(--font-sans)", textAlign: "center" }}>
            No activity yet.
          </div>
        )}
      </div>
    </div>
  );
}

interface AppsAlertsCardProps {
  appsCount: number;
  unreadCount: number;
}

function AppsAlertsCard({ appsCount, unreadCount }: AppsAlertsCardProps) {
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: "0.5px solid var(--border-default)" }}>
        <div style={{ width: 38, height: 38, borderRadius: "var(--radius-icon)", background: "var(--accent-subtle)", color: "var(--accent-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Grid2X2 size={19} strokeWidth={1.85} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 20px var(--font-sans)", color: "var(--text-primary)" }}>{appsCount}</div>
          <div className="label" style={{ color: "var(--text-tertiary)", marginTop: 2 }}>Apps available</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px" }}>
        <div style={{ width: 38, height: 38, borderRadius: "var(--radius-icon)", background: "var(--red-50)", color: "var(--status-error)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bell size={19} strokeWidth={1.85} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 20px var(--font-sans)", color: "var(--text-primary)" }}>{unreadCount}</div>
          <div className="label" style={{ color: "var(--text-tertiary)", marginTop: 2 }}>Unread alerts</div>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const router      = useRouter();
  const { user }    = useAuth();
  const openDrawer  = useNotificationsDrawer((s) => s.open);

  const { data: services = [],      isLoading: loadingServices } = useDashboardServices();
  const { data: notifications = [], isLoading: loadingNotifs }   = useDashboardNotifications();
  const { data: unreadCount = 0 }                                = useDashboardUnreadCount();
  const { data: profile, isLoading: loadingProfile }             = useDashboardProfile();
  const { data: activity = [],      isLoading: loadingActivity } = useDashboardActivity();

  return (
    <Page>
      <WelcomeBanner firstName={user?.first_name ?? ""} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 28, alignItems: "start" }}>
        {/* Main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionRow title="Your applications" linkLabel="View all" href="/applications" />
          {loadingServices ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {[1, 2].map((i) => (
                <div key={i} className="skel" style={{ height: 160 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {services.map((s) => (
                <AppCard
                  key={s.id}
                  service={s}
                  onOpen={(svc) => router.push(getServiceOpenPath(svc, user?.role))}
                />
              ))}
            </div>
          )}

          <RecentActivity
            activity={activity}
            isLoading={loadingActivity}
            onViewAll={() => router.push("/activity")}
          />
        </div>

        {/* Right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 36 }}>
          {loadingProfile || !profile ? (
            <div className="skel" style={{ height: 92 }} />
          ) : (
            <RingStat
              percent={profile.completionPercentage}
              label="Profile completion"
              sub={getProfileCompletionHint(profile)}
            />
          )}

          <AppsAlertsCard appsCount={services.length} unreadCount={unreadCount} />

          <RecentNotifications
            notifications={notifications}
            isLoading={loadingNotifs}
            onOpen={openDrawer}
          />
        </div>
      </div>
    </Page>
  );
}
