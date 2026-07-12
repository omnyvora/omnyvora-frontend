import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type { SystemLogPage, LogLevelFilter } from "./types";

const LOGS_URL = resolveServiceUrl("logs");

export async function fetchLogs(level: LogLevelFilter): Promise<ApiResponse<SystemLogPage>> {
  const res = await apiClient.get(`${LOGS_URL}/logs/`, {
    params: level === "ALL" ? {} : { level },
  });
  return res.data;
}
