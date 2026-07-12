import { z } from "zod";

export const UserActivitySchema = z.object({
  id:            z.number(),
  service:       z.string(),
  service_label: z.string(),
  action:        z.string(),
  action_label:  z.string(),
  device_type:   z.string(),
  occurred_at:   z.string().datetime(),
});

export type UserActivity = z.infer<typeof UserActivitySchema>;

export const UserActivityPageSchema = z.object({
  count:    z.number(),
  next:     z.string().nullable(),
  previous: z.string().nullable(),
  results:  z.array(UserActivitySchema),
});

export type UserActivityPage = z.infer<typeof UserActivityPageSchema>;
