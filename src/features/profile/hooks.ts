"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isApiSuccess } from "@/core/api/response";
import { fetchMyProfile, updateMyProfile } from "./api";
import { toProfileUI, toUpdateRequest } from "./transformers";
import type { UpdateProfileFormValues } from "./types";

const PROFILE_QUERY_KEY = ["profile", "me"] as const;

export function useMyProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchMyProfile();
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toProfileUI(res.data);
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: UpdateProfileFormValues) => {
      const res = await updateMyProfile(toUpdateRequest(values));
      if (!isApiSuccess(res)) throw new Error(res.message);
      return toProfileUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData(PROFILE_QUERY_KEY, updated);
    },
  });
}
