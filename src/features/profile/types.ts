import { z } from "zod";

export const ProfileSchema = z.object({
  id:         z.number(),
  user:       z.number(),
  first_name: z.string(),
  last_name:  z.string(),
  phone:      z.string().nullable(),
  dob:        z.string().nullable(),
  bio:        z.string().nullable(),
  avatar:     z.string().url().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const UpdateProfileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name:  z.string().min(1, "Last name is required"),
  phone:      z.string().optional(),
  dob:        z.string().optional(),
  bio:        z.string().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof UpdateProfileFormSchema>;

export const UpdateProfileRequestSchema = UpdateProfileFormSchema;
export type UpdateProfileRequest = UpdateProfileFormValues;
