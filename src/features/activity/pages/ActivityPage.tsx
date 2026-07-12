"use client";

import { History } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { ActivityItem } from "@/shared/workspace/components/ActivityItem";
import { useRecentActivity } from "../hooks";

export function ActivityPage() {
  const { data: activity = [], isLoading } = useRecentActivity();

  return (
    <Page>
      <PageHead
        title="Activity"
        subtitle="A history of what's happened across your Omnyvora account."
      />
      <div className="card">
        {isLoading ? (
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skel" style={{ height: 60 }} />
            ))}
          </div>
        ) : activity.length > 0 ? (
          activity.map((a, i) => (
            <div
              key={a.id}
              style={{ borderBottom: i < activity.length - 1 ? "0.5px solid var(--border-default)" : "none" }}
            >
              <ActivityItem activity={a} />
            </div>
          ))
        ) : (
          <div style={{ padding: "40px 20px" }}>
            <EmptyState
              icon={History}
              title="No activity yet"
              desc="Actions you take across Omnyvora will show up here."
            />
          </div>
        )}
      </div>
    </Page>
  );
}
