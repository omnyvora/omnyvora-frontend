"use client";

// Dashboard fetches its data independently — per the cross-feature rule,
// it cannot import from features/catalog or shared/notifications hooks directly
// when used at the feature level. Instead it calls its own query functions
// which hit the same endpoints. TanStack Query deduplicates the network requests
// via matching query keys.

import { useQuery } from "@tanstack/react-query";
import { ApiRequestError, isApiSuccess } from "@/core/api/response";
import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import { toServicesUI } from "@/features/catalog/transformers";
import type { PlatformService } from "@/features/catalog/types";
import { toProfileUI } from "@/features/profile/transformers";
import type { Profile } from "@/features/profile/types";
import { toActivityListUI } from "@/features/activity/transformers";
import type { UserActivityPage } from "@/features/activity/types";
import type { Notification, NotificationPage } from "@/shared/notifications/types";

const CATALOG_URL  = resolveServiceUrl("catalog");
const PROFILES_URL = resolveServiceUrl("profiles");
const ACTIVITY_URL = resolveServiceUrl("activity");

// Shares the same query key as usePlatformServices() — TanStack deduplicates.
export function useDashboardServices() {
  return useQuery({
    queryKey: ["platform-services"],
    queryFn: async () => {
      const res = await apiClient.get(`${CATALOG_URL}/catalog/services/`);
      const data = res.data;
      if (!isApiSuccess(data)) throw new ApiRequestError(data);
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
      if (!isApiSuccess(data)) throw new ApiRequestError(data);
      return (data.data as NotificationPage).results;
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
      if (!isApiSuccess(data)) throw new ApiRequestError(data);
      return (data.data as { count: number }).count;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

// Shares the same query key as useMyProfile() — TanStack deduplicates.
export function useDashboardProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const res = await apiClient.get(`${PROFILES_URL}/profiles/me/`);
      const data = res.data;
      if (!isApiSuccess(data)) throw new ApiRequestError(data);
      return toProfileUI(data.data as Profile);
    },
    staleTime: 60_000,
  });
}

// Shares the same query key as useRecentActivity() — TanStack deduplicates.
export function useDashboardActivity() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await apiClient.get(`${ACTIVITY_URL}/activity/`);
      const data = res.data;
      if (!isApiSuccess(data)) throw new ApiRequestError(data);
      return toActivityListUI((data.data as UserActivityPage).results);
    },
    staleTime: 60_000,
  });
}
