import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type {
  SystemLogPage,
  LogLevelFilter,
  AdminUserPage,
  AdminUserDetail,
  AdminService,
} from "./types";

const LOGS_URL    = resolveServiceUrl("logs");
const ADMIN_URL   = resolveServiceUrl("admin");
const CATALOG_URL = resolveServiceUrl("catalog");

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

export async function fetchAdminServices(): Promise<ApiResponse<AdminService[]>> {
  const res = await apiClient.get(`${ADMIN_URL}/admin/services/`);
  return res.data;
}

// Toggling still goes through catalog's own PATCH endpoint — the admin
// services API above is read-only composition, not a mutation path.
export async function toggleServiceActive(
  slug: string,
  isActive: boolean,
): Promise<ApiResponse<unknown>> {
  const res = await apiClient.patch(`${CATALOG_URL}/catalog/services/${slug}/`, {
    is_active: isActive,
  });
  return res.data;
}
