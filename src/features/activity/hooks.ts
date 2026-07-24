"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiRequestError, isApiSuccess } from "@/core/api/response";
import { fetchActivity } from "./api";
import { toActivityListUI } from "./transformers";

export const ACTIVITY_QUERY_KEY = ["activity"] as const;

export function useRecentActivity() {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchActivity();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toActivityListUI(res.data.results);
    },
    staleTime: 60_000,
  });
}
