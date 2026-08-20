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

export async function uploadAvatar(file: File): Promise<ApiResponse<Profile>> {
  const form = new FormData();
  // Derive extension from MIME type — browser-image-compression can strip it when converting formats via WebWorker
  const ext = file.type.split("/")[1] ?? "jpeg";
  form.append("avatar", file, `avatar.${ext}`);
  // null (not undefined) unsets Content-Type — AxiosHeaderValue doesn't include
  // undefined, so this is both correctly typed and how axios drops a header —
  // the browser then sets multipart/form-data with the correct boundary.
  const res = await apiClient.patch(`${PROFILES_URL}/profiles/me/`, form, {
    headers: { "Content-Type": null },
  });
  return res.data;
}
