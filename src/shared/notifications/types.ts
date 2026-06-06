import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  is_read: z.boolean(),
  read_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const UnreadCountSchema = z.object({
  count: z.number().int().nonnegative(),
});
