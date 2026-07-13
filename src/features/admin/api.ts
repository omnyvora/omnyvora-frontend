import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type { SystemLogPage, LogLevelFilter, AdminUserPage, AdminUserDetail } from "./types";

const LOGS_URL  = resolveServiceUrl("logs");
const ADMIN_URL = resolveServiceUrl("admin");

export async function fetchLogs(level: LogLevelFilter): Promise<ApiResponse<SystemLogPage>> {
  const res = await apiClient.get(`${LOGS_URL}/logs/`, {
    params: level === "ALL" ? {} : { level },
  });
  return res.data;
}

export async function fetchAdminUsers(q: string): Promise<ApiResponse<AdminUserPage>> {
  const res = await apiClient.get(`${ADMIN_URL}/admin/users/`, {
    params: q ? { q } : {},
  });
  return res.data;
}

export async function fetchAdminUserDetail(id: number): Promise<ApiResponse<AdminUserDetail>> {
  const res = await apiClient.get(`${ADMIN_URL}/admin/users/${id}/`);
  return res.data;
}
