import { z } from "zod";

export const UserRoleSchema = z.enum(["superadmin", "user"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  role: UserRoleSchema,
});

export type User = z.infer<typeof UserSchema>;
