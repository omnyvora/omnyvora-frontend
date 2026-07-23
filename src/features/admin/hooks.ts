"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isApiSuccess } from "@/core/api/response";
import {
  fetchLogs,
  fetchAdminUsers,
  fetchAdminUserDetail,
  fetchAdminServices,
  toggleServiceActive,
  fetchPlatformServiceDetail,
  createPlatformService,
  updatePlatformService,
  deletePlatformService,
  fetchAdminDashboard,
  fetchAdminSettings,
  updateAdminSettings,
} from "./api";
import {
  toLogRowsUI,
  toAdminUserListUI,
  toAdminUserDetailUI,
  toAdminServiceListUI,
  toAdminDashboardUI,
  toAdminSettingsFormValues,
} from "./transformers";
import type { LogLevelFilter, AdminSettingsFormValues, PlatformServiceFormValues } from "./types";

const ADMIN_SETTINGS_QUERY_KEY = ["admin", "settings"] as const;

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

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await fetchAdminDashboard();
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toAdminDashboardUI(res.data);
    },
    staleTime: 30_000,
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchAdminSettings();
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toAdminSettingsFormValues(res.data);
    },
  });
}

export function useUpdateAdminSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<AdminSettingsFormValues>) => {
      const res = await updateAdminSettings(payload);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toAdminSettingsFormValues(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData(ADMIN_SETTINGS_QUERY_KEY, updated);
    },
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

export function usePlatformServiceDetail(slug: string | null) {
  return useQuery({
    queryKey: ["admin", "services", "detail", slug],
    queryFn: async () => {
      const res = await fetchPlatformServiceDetail(slug as string);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return res.data;
    },
    enabled: slug !== null,
  });
}

export function useCreatePlatformService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PlatformServiceFormValues) => {
      const res = await createPlatformService(payload);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_SERVICES_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["platform-services"] });
    },
  });
}

export function useUpdatePlatformService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: Omit<PlatformServiceFormValues, "slug"> }) => {
      const res = await updatePlatformService(slug, data);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_SERVICES_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["platform-services"] });
    },
  });
}

export function useDeletePlatformService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await deletePlatformService(slug);
      if (!isApiSuccess(res)) throw new Error(res.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_SERVICES_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["platform-services"] });
    },
  });
}
