import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type { PlatformService } from "./types";

const CATALOG_URL = resolveServiceUrl("catalog");

export async function fetchServices(): Promise<ApiResponse<PlatformService[]>> {
  const res = await apiClient.get(`${CATALOG_URL}/catalog/services/`);
  return res.data;
}

export async function fetchServiceBySlug(
  slug: string,
): Promise<ApiResponse<PlatformService>> {
  const res = await apiClient.get(`${CATALOG_URL}/catalog/services/${slug}/`);
  return res.data;
}
