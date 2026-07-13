"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiSuccess } from "@/core/api/response";
import { fetchLogs, fetchAdminUsers, fetchAdminUserDetail } from "./api";
import { toLogRowsUI, toAdminUserListUI, toAdminUserDetailUI } from "./transformers";
import type { LogLevelFilter } from "./types";

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
