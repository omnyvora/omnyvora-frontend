import apiClient from "@/core/api/axios";
import type { ApiResponse } from "@/core/api/response";
import type { NotificationPage } from "./types";

export async function fetchNotifications(): Promise<ApiResponse<NotificationPage>> {
  const res = await apiClient.get("/v1/notifications/");
  return res.data;
}

export async function fetchUnreadCount(): Promise<ApiResponse<{ count: number }>> {
  const res = await apiClient.get("/v1/notifications/unread-count/");
  return res.data;
}

export async function markAllRead(): Promise<ApiResponse<null>> {
  const res = await apiClient.patch("/v1/notifications/read-all/");
  return res.data;
}

export async function markOneRead(id: number): Promise<ApiResponse<null>> {
  const res = await apiClient.patch(`/v1/notifications/${id}/read/`);
  return res.data;
}
