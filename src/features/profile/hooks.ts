"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiRequestError, isApiSuccess } from "@/core/api/response";
import { compressImage, AVATAR_COMPRESSION_CONFIG } from "@/core/utils/image";
import { fetchMyProfile, updateMyProfile, uploadAvatar } from "./api";
import { toProfileUI, toUpdateRequest } from "./transformers";
import type { UpdateProfileFormValues } from "./types";

const PROFILE_QUERY_KEY = ["profile", "me"] as const;

export function useMyProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchMyProfile();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toProfileUI(res.data);
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: UpdateProfileFormValues) => {
      const res = await updateMyProfile(toUpdateRequest(values));
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toProfileUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData(PROFILE_QUERY_KEY, updated);
    },
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const compressed = await compressImage(file, AVATAR_COMPRESSION_CONFIG);
      const res = await uploadAvatar(compressed);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toProfileUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData(PROFILE_QUERY_KEY, updated);
    },
  });
}
