"use client";

import { flushSync } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { tokenStore, refreshTokenStore } from "@/core/api/axios";
import { ApiRequestError, isApiSuccess } from "@/core/api/response";
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

// Stores tokens and resolves the full User object via /verify/.
// Access token goes to memory; refresh token goes to localStorage for reload persistence.
async function hydrateSession(access: string, refresh: string) {
  tokenStore.set(access);
  refreshTokenStore.set(refresh);

  const verifyRes = await verifyToken();
  if (!isApiSuccess(verifyRes)) throw new ApiRequestError(verifyRes);

  const parsed = VerifyUserResponseSchema.safeParse(verifyRes.data);
  if (!parsed.success) throw new Error("Unexpected user data from server");

  const userParsed = UserSchema.safeParse(verifyResponseToUser(parsed.data));
  if (!userParsed.success) throw new Error("User shape mismatch");

  return { access, user: userParsed.data };
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

// ── Redirect helper ───────────────────────────────────────────────────────────

// Absent an explicit ?next= target, route by role — superadmins land in the
// admin console, everyone else in the regular workspace.
function defaultRouteFor(user: { role: string }): string {
  return user.role === "superadmin" ? AUTH_ROUTES.adminDashboard : AUTH_ROUTES.dashboard;
}

// ── Register ──────────────────────────────────────────────────────────────────

export function useRegister(explicitRedirectTo?: string) {
  const { setTokenAndUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const res = await registerUser(payload);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return hydrateSession(res.data.access, res.data.refresh);
    },
    onSuccess: ({ access, user }) => {
      // flushSync forces React to commit the auth state update synchronously
      // before router.replace fires. Without this, AuthGuard renders with
      // isAuthenticated=false and redirects back to login (race condition).
      flushSync(() => setTokenAndUser(access, user));
      router.replace(explicitRedirectTo ?? defaultRouteFor(user));
    },
    onError: () => {
      tokenStore.clear();
      refreshTokenStore.clear();
    },
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function useLogin(explicitRedirectTo?: string) {
  const { setTokenAndUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const res = await loginUser(payload);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return hydrateSession(res.data.access, res.data.refresh);
    },
    onSuccess: ({ access, user }) => {
      flushSync(() => setTokenAndUser(access, user));
      router.replace(explicitRedirectTo ?? defaultRouteFor(user));
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
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
    },
  });
}

// ── Password Change ───────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: PasswordChangeRequest) => {
      const res = await changePassword(payload);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
    },
  });
}
