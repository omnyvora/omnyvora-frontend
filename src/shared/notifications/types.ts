import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  is_read: z.boolean(),
  read_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const NotificationPageSchema = z.object({
  count:    z.number(),
  next:     z.string().nullable(),
  previous: z.string().nullable(),
  results:  z.array(NotificationSchema),
});

export type NotificationPage = z.infer<typeof NotificationPageSchema>;

export const UnreadCountSchema = z.object({
  count: z.number().int().nonnegative(),
});
