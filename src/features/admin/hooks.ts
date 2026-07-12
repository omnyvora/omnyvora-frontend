"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiSuccess } from "@/core/api/response";
import { fetchLogs } from "./api";
import { toLogRowsUI } from "./transformers";
import type { LogLevelFilter } from "./types";

export function useAdminLogs(level: LogLevelFilter) {
  return useQuery({
    queryKey: ["admin", "logs", level],
    queryFn: async () => {
      const res = await fetchLogs(level);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toLogRowsUI(res.data.results);
    },
    staleTime: 30_000,
  });
}
