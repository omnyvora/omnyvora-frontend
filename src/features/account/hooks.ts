"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/context";
import { tokenStore } from "@/core/api/axios";
import { isApiSuccess } from "@/core/api/response";
import { requestEmailChangeOtp, changeEmail } from "./api";

export function useRequestEmailChangeOtp() {
  return useMutation({
    mutationFn: (newEmail: string) => requestEmailChangeOtp(newEmail),
  });
}

export function useChangeEmail() {
  const { user, setTokenAndUser } = useAuth();

  return useMutation({
    mutationFn: async (payload: { new_email: string; otp: string }) => {
      const res = await changeEmail(payload);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return payload.new_email;
    },
    onSuccess: (newEmail) => {
      const access = tokenStore.get();
      if (user && access) {
        // Update the in-context user email without a round-trip to /verify/
        setTokenAndUser(access, { ...user, email: newEmail });
      }
    },
  });
}
