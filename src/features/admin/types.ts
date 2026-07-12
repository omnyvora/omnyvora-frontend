import { z } from "zod";

export const SystemLogSchema = z.object({
  id:           z.number(),
  timestamp:    z.string(),
  log_level:    z.string(),
  event_name:   z.string(),
  message:      z.string(),
  actor_type:   z.string().nullable(),
  actor_id:     z.string().nullable(),
  actor_email:  z.string().nullable(),
  service_name: z.string().nullable(),
  traceback:    z.string().nullable(),
});

export type SystemLog = z.infer<typeof SystemLogSchema>;

export const SystemLogPageSchema = z.object({
  count:    z.number(),
  next:     z.string().nullable(),
  previous: z.string().nullable(),
  results:  z.array(SystemLogSchema),
});

export type SystemLogPage = z.infer<typeof SystemLogPageSchema>;

export const LOG_LEVELS = ["ALL", "ERROR", "WARNING", "INFO", "CRITICAL", "SUCCESS", "DEBUG"] as const;
export type LogLevelFilter = (typeof LOG_LEVELS)[number];
