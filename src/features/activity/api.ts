import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type { UserActivityPage } from "./types";

const ACTIVITY_URL = resolveServiceUrl("activity");

export async function fetchActivity(): Promise<ApiResponse<UserActivityPage>> {
  const res = await apiClient.get(`${ACTIVITY_URL}/activity/`);
  return res.data;
}
