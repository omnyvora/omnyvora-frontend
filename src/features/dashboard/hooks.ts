"use client";

// Dashboard fetches its data independently — per the cross-feature rule,
// it cannot import from features/catalog or shared/notifications hooks directly
// when used at the feature level. Instead it calls its own query functions
// which hit the same endpoints. TanStack Query deduplicates the network requests
// via matching query keys.

import { useQuery } from "@tanstack/react-query";
import { isApiSuccess } from "@/core/api/response";
import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import { toServicesUI } from "@/features/catalog/transformers";
import type { PlatformService } from "@/features/catalog/types";
import type { Notification } from "@/shared/notifications/types";

const CATALOG_URL = resolveServiceUrl("catalog");

// Shares the same query key as usePlatformServices() — TanStack deduplicates.
export function useDashboardServices() {
  return useQuery({
    queryKey: ["platform-services"],
    queryFn: async () => {
      const res = await apiClient.get(`${CATALOG_URL}/catalog/services/`);
      const data = res.data;
      if (!isApiSuccess(data)) throw new Error(data.message);
      return toServicesUI(data.data as PlatformService[]);
    },
    staleTime: Infinity,
  });
}

// Shares the same query key as useNotifications() — TanStack deduplicates.
export function useDashboardNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<Notification[]> => {
      const res = await apiClient.get("/v1/notifications/");
      const data = res.data;
      if (!isApiSuccess(data)) throw new Error(data.message);
      return data.data as Notification[];
    },
    staleTime: 60_000,
  });
}

// Shares the same query key as useUnreadCount() — TanStack deduplicates.
export function useDashboardUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async (): Promise<number> => {
      const res = await apiClient.get("/v1/notifications/unread-count/");
      const data = res.data;
      if (!isApiSuccess(data)) throw new Error(data.message);
      return (data.data as { count: number }).count;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
