import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type {
  GetOtpRequest,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  VerifyUserResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  PasswordResetRequest,
  PasswordChangeRequest,
} from "./types";

const AUTH_URL = resolveServiceUrl("auth");
const OTP_URL  = resolveServiceUrl("otp");

export async function requestOtp(
  payload: GetOtpRequest,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post(`${OTP_URL}/otp/get-otp/`, payload);
  return res.data;
}

export async function registerUser(
  payload: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> {
  const res = await apiClient.post(`${AUTH_URL}/auth/register/`, payload);
  return res.data;
}

export async function loginUser(
  payload: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
  const res = await apiClient.post(`${AUTH_URL}/auth/login/`, payload);
  return res.data;
}

export async function logoutUser(
  payload: LogoutRequest,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post(`${AUTH_URL}/auth/logout/`, payload);
  return res.data;
}

export async function verifyToken(): Promise<ApiResponse<VerifyUserResponse>> {
  const res = await apiClient.get(`${AUTH_URL}/auth/verify/`);
  return res.data;
}

export async function refreshAccessToken(
  payload: TokenRefreshRequest,
): Promise<ApiResponse<TokenRefreshResponse>> {
  const res = await apiClient.post(`${AUTH_URL}/auth/token/refresh/`, payload);
  return res.data;
}

export async function resetPassword(
  payload: PasswordResetRequest,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post(`${AUTH_URL}/auth/password/reset/`, payload);
  return res.data;
}

export async function changePassword(
  payload: PasswordChangeRequest,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post(`${AUTH_URL}/auth/password/change/`, payload);
  return res.data;
}
