"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isApiSuccess } from "@/core/api/response";
import {
  fetchLogs,
  fetchAdminUsers,
  fetchAdminUserDetail,
  fetchAdminServices,
  toggleServiceActive,
} from "./api";
import {
  toLogRowsUI,
  toAdminUserListUI,
  toAdminUserDetailUI,
  toAdminServiceListUI,
} from "./transformers";
import type { LogLevelFilter } from "./types";

const ADMIN_SERVICES_QUERY_KEY = ["admin", "services"] as const;

export function useAdminLogs(level: LogLevelFilter) {
  return useQuery({
    queryKey: ["admin", "logs", level],
    queryFn: async () => {
      const res = await fetchLogs(level);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toLogRowsUI(res.data.results);
    },
    staleTime: 30_000,
  });
}

export function useAdminUsers(q: string) {
  return useQuery({
    queryKey: ["admin", "users", q],
    queryFn: async () => {
      const res = await fetchAdminUsers(q);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toAdminUserListUI(res.data.results);
    },
    staleTime: 30_000,
  });
}

export function useAdminUserDetail(id: number | null) {
  return useQuery({
    queryKey: ["admin", "users", "detail", id],
    queryFn: async () => {
      const res = await fetchAdminUserDetail(id as number);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toAdminUserDetailUI(res.data);
    },
    enabled: id !== null,
  });
}

export function useAdminServices() {
  return useQuery({
    queryKey: ADMIN_SERVICES_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchAdminServices();
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toAdminServiceListUI(res.data);
    },
    staleTime: 30_000,
  });
}

export function useToggleService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, isActive }: { slug: string; isActive: boolean }) => {
      const res = await toggleServiceActive(slug, isActive);
      if (!isApiSuccess(res)) throw new Error(res.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_SERVICES_QUERY_KEY });
      // Also used by the public catalog/dashboard app grids.
      qc.invalidateQueries({ queryKey: ["platform-services"] });
    },
  });
}
