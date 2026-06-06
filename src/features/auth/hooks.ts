"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { tokenStore, refreshTokenStore } from "@/core/api/axios";
import { isApiSuccess } from "@/core/api/response";
import { useAuth } from "@/shared/auth/context";
import { UserSchema } from "@/shared/auth/types";
import { verifyResponseToUser } from "./transformers";
import { VerifyUserResponseSchema } from "./types";
import {
  requestOtp,
  registerUser,
  loginUser,
  resetPassword,
  changePassword,
  verifyToken,
} from "./api";
import type {
  GetOtpRequest,
  RegisterRequest,
  LoginRequest,
  PasswordResetRequest,
  PasswordChangeRequest,
} from "./types";
import { AUTH_ROUTES } from "./constants";

// ── Shared helper ─────────────────────────────────────────────────────────────

// Fetches the full user profile after a successful auth action that returns tokens.
// Stores both tokens in memory and resolves the complete User object.
async function hydrateSession(access: string, refresh: string) {
  tokenStore.set(access);
  refreshTokenStore.set(refresh);

  const verifyRes = await verifyToken();
  if (!isApiSuccess(verifyRes)) throw new Error(verifyRes.message);

  const parsed = VerifyUserResponseSchema.safeParse(verifyRes.data);
  if (!parsed.success) throw new Error("Unexpected user data from server");

  const userParsed = UserSchema.safeParse(verifyResponseToUser(parsed.data));
  if (!userParsed.success) throw new Error("User shape mismatch");

  return { access, refresh, user: userParsed.data };
}

// ── OTP ───────────────────────────────────────────────────────────────────────

export function useRequestOtp() {
  return useMutation({
    mutationFn: (payload: GetOtpRequest) => requestOtp(payload),
    onError: () => {
      // Surface via mutation.error — no silent failures.
    },
  });
}

// ── Register ──────────────────────────────────────────────────────────────────

export function useRegister() {
  const { setTokenAndUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const res = await registerUser(payload);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return hydrateSession(res.data.access, res.data.refresh);
    },
    onSuccess: ({ access, user }) => {
      setTokenAndUser(access, user);
      router.replace(AUTH_ROUTES.dashboard);
    },
    onError: () => {
      tokenStore.clear();
      refreshTokenStore.clear();
    },
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const { setTokenAndUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const res = await loginUser(payload);
      if (!isApiSuccess(res)) throw new Error(res.message);
      return hydrateSession(res.data.access, res.data.refresh);
    },
    onSuccess: ({ access, user }) => {
      setTokenAndUser(access, user);
      router.replace(AUTH_ROUTES.dashboard);
    },
    onError: () => {
      tokenStore.clear();
      refreshTokenStore.clear();
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const { logout } = useAuth();
  return useMutation({
    mutationFn: () => logout(),
  });
}

// ── Password Reset ────────────────────────────────────────────────────────────

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: PasswordResetRequest) => {
      const res = await resetPassword(payload);
      if (!isApiSuccess(res)) throw new Error(res.message);
    },
  });
}

// ── Password Change ───────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: PasswordChangeRequest) => {
      const res = await changePassword(payload);
      if (!isApiSuccess(res)) throw new Error(res.message);
    },
  });
}
