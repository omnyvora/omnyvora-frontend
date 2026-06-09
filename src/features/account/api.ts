import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";

const AUTH_URL = resolveServiceUrl("auth");
const OTP_URL  = resolveServiceUrl("otp");

export async function requestEmailChangeOtp(
  newEmail: string,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post(`${OTP_URL}/otp/get-otp/`, {
    purpose:         "change_email",
    user_identifier: newEmail,
    otp_channel:     "email",
  });
  return res.data;
}

export async function changeEmail(payload: {
  new_email: string;
  otp:       string;
}): Promise<ApiResponse<null>> {
  const res = await apiClient.post(`${AUTH_URL}/auth/email/change/`, payload);
  return res.data;
}
