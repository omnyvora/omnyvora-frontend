"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isApiSuccess } from "@/core/api/response";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllRead,
  markOneRead,
} from "./api";
import type { Notification } from "./types";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;
export const UNREAD_COUNT_QUERY_KEY  = ["notifications", "unread-count"] as const;

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async (): Promise<Notification[]> => {
      const res = await fetchNotifications();
      if (!isApiSuccess(res)) throw new Error(res.message);
      return res.data;
    },
    staleTime: 60_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: async (): Promise<number> => {
      const res = await fetchUnreadCount();
      if (!isApiSuccess(res)) throw new Error(res.message);
      return res.data.count;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await markAllRead();
      if (!isApiSuccess(res)) throw new Error(res.message);
    },
    onSuccess: () => {
      qc.setQueryData(UNREAD_COUNT_QUERY_KEY, 0);
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

export function useMarkOneRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await markOneRead(id);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      qc.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
    },
  });
}
