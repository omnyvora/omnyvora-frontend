import { z } from "zod";

export const ChangeEmailSchema = z.object({
  new_email: z.string().email("Enter a valid email address"),
  otp:       z.string().length(6, "Enter the 6-digit code"),
});

export type ChangeEmailValues = z.infer<typeof ChangeEmailSchema>;
