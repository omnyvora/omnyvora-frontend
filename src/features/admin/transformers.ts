import type { SystemLog } from "./types";

export interface LogRowUI {
  id:        number;
  level:     string;
  actor:     string;
  message:   string;
  timestamp: string;
  traceback: string | null;
}

export function toLogRowUI(log: SystemLog): LogRowUI {
  return {
    id:        log.id,
    level:     log.log_level,
    actor:     log.actor_email ?? log.actor_type ?? "system",
    message:   log.message,
    timestamp: log.timestamp,
    traceback: log.traceback,
  };
}

export function toLogRowsUI(logs: SystemLog[]): LogRowUI[] {
  return logs.map(toLogRowUI);
}
