import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type { Profile, UpdateProfileRequest } from "./types";

const PROFILES_URL = resolveServiceUrl("profiles");

export async function fetchMyProfile(): Promise<ApiResponse<Profile>> {
  const res = await apiClient.get(`${PROFILES_URL}/profiles/me/`);
  return res.data;
}

export async function updateMyProfile(
  payload: UpdateProfileRequest,
): Promise<ApiResponse<Profile>> {
  const res = await apiClient.patch(`${PROFILES_URL}/profiles/me/`, payload);
  return res.data;
}
