"use client";

import { useEffect } from "react";
import { Search, Users } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { useAdminUsers, useAdminUserDetail } from "../hooks";
import { useAdminStore } from "../store";
import { UserListRow } from "../components/UserListRow";
import { UserDetailPanel } from "../components/UserDetailPanel";

export function AdminUsersPage() {
  const userSearchQuery    = useAdminStore((s) => s.userSearchQuery);
  const setUserSearchQuery = useAdminStore((s) => s.setUserSearchQuery);
  const selectedUserId     = useAdminStore((s) => s.selectedUserId);
  const setSelectedUserId  = useAdminStore((s) => s.setSelectedUserId);

  const { data: users = [], isLoading: loadingUsers } = useAdminUsers(userSearchQuery);

  // Default to the first result so the detail panel is never empty on load.
  useEffect(() => {
    if (selectedUserId === null && users.length > 0) {
      setSelectedUserId(users[0]?.id ?? null);
    }
  }, [users, selectedUserId, setSelectedUserId]);

  const { data: detail, isLoading: loadingDetail } = useAdminUserDetail(selectedUserId);

  return (
    <Page>
      <PageHead title="Users" subtitle="Search accounts and view details." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 20, alignItems: "start" }}>
        <div className="card card--raised">
          <div style={{ padding: "14px 16px", borderBottom: "0.5px solid var(--border-default)" }}>
            <div className="input-wrap">
              <span className="input-icon input-icon--lead"><Search size={15} /></span>
              <input
                className="input input--has-lead"
                placeholder="Search users…"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div style={{ maxHeight: 560, overflowY: "auto" }}>
            {loadingUsers ? (
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3, 4].map((i) => <div key={i} className="skel" style={{ height: 48 }} />)}
              </div>
            ) : users.length > 0 ? (
              users.map((u) => (
                <UserListRow
                  key={u.id}
                  user={u}
                  active={u.id === selectedUserId}
                  onClick={() => setSelectedUserId(u.id)}
                />
              ))
            ) : (
              <div style={{ padding: "40px 20px" }}>
                <EmptyState icon={Users} title="No users found" desc="Try a different search term." />
              </div>
            )}
          </div>
        </div>

        {loadingDetail || !detail ? (
          <div className="skel" style={{ height: 420 }} />
        ) : (
          <UserDetailPanel detail={detail} />
        )}
      </div>
    </Page>
  );
}
