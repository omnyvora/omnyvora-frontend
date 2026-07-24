"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiRequestError, isApiSuccess } from "@/core/api/response";
import { fetchServices } from "./api";
import { toServicesUI } from "./transformers";
import type { PlatformServiceUI } from "./types";

export const CATALOG_QUERY_KEY = ["platform-services"] as const;

export function usePlatformServices() {
  return useQuery({
    queryKey: CATALOG_QUERY_KEY,
    queryFn:  async (): Promise<PlatformServiceUI[]> => {
      const res = await fetchServices();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toServicesUI(res.data);
    },
    staleTime: Infinity,
  });
}
