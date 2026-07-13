"use client";

import { User, Activity, TrendingUp, Server, Bell, ShieldAlert } from "lucide-react";
import { Page, PageHead } from "@/shared/workspace/components/ui";
import { MiniStat } from "@/shared/workspace/components/StatCard";
import { useAdminDashboard } from "../hooks";
import { GrowthChart } from "../components/GrowthChart";
import { ServiceUsageBars } from "../components/ServiceUsageBars";
import { AlertCard } from "../components/AlertCard";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  if (isLoading || !data) {
    return (
      <Page>
        <PageHead title="Admin Dashboard" subtitle={today} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[1, 2, 3, 4].map((i) => <div key={i} className="skel" style={{ height: 100 }} />)}
        </div>
        <div className="skel" style={{ height: 260 }} />
      </Page>
    );
  }

  return (
    <Page>
      <PageHead title="Admin Dashboard" subtitle={today} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        <MiniStat icon={User} value={data.totalUsers.toLocaleString()} label="Total users" />
        <MiniStat icon={Activity} value={data.activeToday.toLocaleString()} label="Active today" bg="var(--status-success-bg)" fg="#0b6e4a" />
        <MiniStat icon={TrendingUp} value={data.newThisWeek.toLocaleString()} label="New this week" bg="var(--status-info-bg)" fg="#1d4ed8" />
        <MiniStat icon={Server} value={data.servicesRunning} label="Services running" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        <div className="card card--raised">
          <div style={{ padding: "18px 20px 6px" }}>
            <div style={{ font: "500 16px var(--font-sans)", letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
              User Growth
            </div>
            <div style={{ font: "400 12px var(--font-sans)", color: "var(--text-tertiary)", marginTop: 2 }}>
              30-day daily active users
            </div>
          </div>
          <div style={{ padding: "8px 16px 18px" }}>
            <GrowthChart points={data.userGrowth} />
          </div>
        </div>

        <div className="card card--raised">
          <div style={{ padding: "18px 20px 6px" }}>
            <div style={{ font: "500 16px var(--font-sans)", letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
              Service Usage
            </div>
            <div style={{ font: "400 12px var(--font-sans)", color: "var(--text-tertiary)", marginTop: 2 }}>
              Active users per service
            </div>
          </div>
          <div style={{ padding: "14px 20px 20px" }}>
            <ServiceUsageBars services={data.serviceUsage} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, alignItems: "start" }}>
        <div className="card card--raised">
          <div
            style={{
              padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: "0.5px solid var(--border-default)",
            }}
          >
            <div style={{ font: "500 16px var(--font-sans)", letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
              Recent Registrations
            </div>
          </div>
          <div
            style={{
              display: "grid", gridTemplateColumns: "1.6fr 1.6fr 0.9fr 0.9fr", padding: "10px 20px",
              borderBottom: "0.5px solid var(--border-default)",
            }}
          >
            <span className="label">User</span>
            <span className="label">Email</span>
            <span className="label">Joined</span>
            <span className="label">Status</span>
          </div>
          {data.recentRegistrations.map((r, i) => (
            <div
              key={r.id}
              style={{
                display: "grid", gridTemplateColumns: "1.6fr 1.6fr 0.9fr 0.9fr", padding: "12px 20px",
                alignItems: "center",
                borderBottom: i < data.recentRegistrations.length - 1 ? "0.5px solid var(--border-default)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span className="avatar avatar--sm" style={{ fontWeight: 600 }}>{r.initials}</span>
                <span
                  style={{
                    font: "500 13px var(--font-sans)", color: "var(--text-primary)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                >
                  {r.fullName}
                </span>
              </div>
              <span
                style={{
                  font: "400 13px var(--font-sans)", color: "var(--text-secondary)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}
              >
                {r.email}
              </span>
              <span style={{ font: "400 13px var(--font-sans)", color: "var(--text-tertiary)" }}>
                {fmtDate(r.dateJoined)}
              </span>
              <span>
                <span className={`badge ${r.isActive ? "badge--success" : "badge--warning"}`}>
                  {r.isActive ? "Active" : "Inactive"}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AlertCard
            icon={Bell} label="Unread System Alerts" sub="requires attention"
            value={data.unreadSystemAlerts} bg="var(--status-error-bg)" fg="#a3262a"
          />
          <AlertCard
            icon={ShieldAlert} label="Security Alerts" sub="last 24 hours"
            value={data.securityAlerts} bg="var(--status-warning-bg)" fg="#92600c"
          />
          <AlertCard
            icon={Server} label="Services Available" sub="across platform"
            value={data.servicesRunning} bg="var(--accent-subtle)" fg="var(--accent-text)"
          />
        </div>
      </div>
    </Page>
  );
}
