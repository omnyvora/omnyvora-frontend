import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
});

export type User = z.infer<typeof UserSchema>;
