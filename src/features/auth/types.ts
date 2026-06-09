import { z } from "zod";
import { OTP_LENGTH, OTP_PURPOSE, OTP_CHANNEL } from "./constants";

// ── OTP ──────────────────────────────────────────────────────────────────────

export const OtpPurposeSchema = z.enum([
  OTP_PURPOSE.registration,
  OTP_PURPOSE.passwordReset,
]);
export type OtpPurpose = z.infer<typeof OtpPurposeSchema>;

export const GetOtpRequestSchema = z.object({
  purpose:         OtpPurposeSchema,
  user_identifier: z.string().email("Invalid email address"),
  otp_channel:     z.literal(OTP_CHANNEL.email),
});
export type GetOtpRequest = z.infer<typeof GetOtpRequestSchema>;

// ── Register ─────────────────────────────────────────────────────────────────

export const RegisterRequestSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name:  z.string().min(1, "Last name is required"),
  email:      z.string().email("Invalid email address"),
  password:   z.string().min(8, "Password must be at least 8 characters"),
  otp:        z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// UI-only schema — confirm_password is validated here and stripped before the API call.
export const RegisterFormSchema = z
  .object({
    first_name:       z.string().min(1, "First name is required"),
    last_name:        z.string().min(1, "Last name is required"),
    email:            z.string().email("Invalid email address"),
    password:         z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
    otp:              z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path:    ["confirm_password"],
  });
export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export const RegisterResponseSchema = z.object({
  email:   z.string().email(),
  access:  z.string(),
  refresh: z.string(),
});
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// ── Login ─────────────────────────────────────────────────────────────────────
// Field name is `email` because the User model uses email as USERNAME_FIELD.

export const LoginRequestSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  access:  z.string(),
  refresh: z.string(),
  user:    z.object({ id: z.number(), email: z.string().email() }),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// ── Logout ───────────────────────────────────────────────────────────────────

export const LogoutRequestSchema = z.object({
  refresh: z.string(),
});
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;

// ── Verify ───────────────────────────────────────────────────────────────────

export const VerifyUserResponseSchema = z.object({
  id:         z.number(),
  email:      z.string().email(),
  first_name: z.string(),
  last_name:  z.string(),
});
export type VerifyUserResponse = z.infer<typeof VerifyUserResponseSchema>;

// ── Token Refresh ─────────────────────────────────────────────────────────────

export const TokenRefreshRequestSchema = z.object({
  refresh: z.string(),
});
export type TokenRefreshRequest = z.infer<typeof TokenRefreshRequestSchema>;

export const TokenRefreshResponseSchema = z.object({
  access:  z.string(),
  refresh: z.string().optional(), // present when ROTATE_REFRESH_TOKENS=True
});
export type TokenRefreshResponse = z.infer<typeof TokenRefreshResponseSchema>;

// ── Password Reset ────────────────────────────────────────────────────────────
// Backend fields: email, otp, new_password — no confirm field.
// confirm_new_password is UI-only, stripped before submission.

export const PasswordResetFormSchema = z
  .object({
    email:                z.string().email("Invalid email address"),
    otp:                  z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`),
    new_password:         z.string().min(8, "Password must be at least 8 characters"),
    confirm_new_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_new_password, {
    message: "Passwords do not match",
    path:    ["confirm_new_password"],
  });
export type PasswordResetFormValues = z.infer<typeof PasswordResetFormSchema>;

export const PasswordResetRequestSchema = z.object({
  email:        z.string().email(),
  otp:          z.string(),
  new_password: z.string(),
});
export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>;

// ── Password Change ───────────────────────────────────────────────────────────
// Backend fields: old_password, new_password — no confirm field.
// confirm_new_password is UI-only, stripped before submission.

export const PasswordChangeFormSchema = z
  .object({
    old_password:         z.string().min(1, "Current password is required"),
    new_password:         z.string().min(8, "New password must be at least 8 characters"),
    confirm_new_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_new_password, {
    message: "Passwords do not match",
    path:    ["confirm_new_password"],
  });
export type PasswordChangeFormValues = z.infer<typeof PasswordChangeFormSchema>;

export const PasswordChangeRequestSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
});
export type PasswordChangeRequest = z.infer<typeof PasswordChangeRequestSchema>;
