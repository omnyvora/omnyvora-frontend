"use client";

import { Terminal } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { useAdminLogs } from "../hooks";
import { useAdminStore } from "../store";
import { LogFilterBar } from "../components/LogFilterBar";
import { LogRow } from "../components/LogRow";

export function AdminLogsPage() {
  const logLevelFilter    = useAdminStore((s) => s.logLevelFilter);
  const setLogLevelFilter = useAdminStore((s) => s.setLogLevelFilter);
  const expandedLogId     = useAdminStore((s) => s.expandedLogId);
  const toggleExpandedLog = useAdminStore((s) => s.toggleExpandedLog);

  const { data: logs = [], isLoading } = useAdminLogs(logLevelFilter);

  return (
    <Page>
      <PageHead
        title="Logs"
        subtitle="System event stream — click a row to expand the traceback."
      />

      <LogFilterBar value={logLevelFilter} onChange={setLogLevelFilter} />

      <div className="card">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "90px 1.1fr 1.7fr 1fr 24px",
            padding: "12px 20px",
            borderBottom: "0.5px solid var(--border-default)",
          }}
        >
          <span className="label">Level</span>
          <span className="label">Actor</span>
          <span className="label">Message</span>
          <span className="label">Timestamp</span>
          <span />
        </div>

        {isLoading ? (
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skel" style={{ height: 44 }} />
            ))}
          </div>
        ) : logs.length > 0 ? (
          logs.map((log, i) => (
            <div
              key={log.id}
              style={{ borderBottom: i < logs.length - 1 ? "0.5px solid var(--border-default)" : "none" }}
            >
              <LogRow
                log={log}
                expanded={expandedLogId === log.id}
                onToggle={() => toggleExpandedLog(log.id)}
              />
            </div>
          ))
        ) : (
          <div style={{ padding: "40px 20px" }}>
            <EmptyState
              icon={Terminal}
              title="No logs match this filter"
              desc="Try a different level, or check back after some activity happens."
            />
          </div>
        )}
      </div>
    </Page>
  );
}
