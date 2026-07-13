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

// ── Users ────────────────────────────────────────────────────────────────────

export const AdminUserRoleSchema = z.enum(["superadmin", "user"]);

export const AdminUserSchema = z.object({
  id:          z.number(),
  email:       z.string().email(),
  first_name:  z.string(),
  last_name:   z.string(),
  is_active:   z.boolean(),
  role:        AdminUserRoleSchema,
  date_joined: z.string(),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

export const AdminUserPageSchema = z.object({
  count:    z.number(),
  next:     z.string().nullable(),
  previous: z.string().nullable(),
  results:  z.array(AdminUserSchema),
});

export type AdminUserPage = z.infer<typeof AdminUserPageSchema>;

export const AdminUserProfileSchema = z.object({
  phone:         z.string().nullable(),
  date_of_birth: z.string().nullable(),
  bio:           z.string().nullable(),
  avatar:        z.string().url().nullable(),
});

export const AdminUserActivitySchema = z.object({
  id:          z.number(),
  service:     z.string(),
  action:      z.string(),
  occurred_at: z.string(),
});

export const AdminUserDetailSchema = z.object({
  user:     AdminUserSchema,
  profile:  AdminUserProfileSchema,
  activity: z.array(AdminUserActivitySchema),
});

export type AdminUserDetail = z.infer<typeof AdminUserDetailSchema>;

// ── Services ─────────────────────────────────────────────────────────────────

export const AdminServiceSchema = z.object({
  id:         z.number(),
  slug:       z.string(),
  name:       z.string(),
  is_active:  z.boolean(),
  user_count: z.number(),
});

export type AdminService = z.infer<typeof AdminServiceSchema>;

export const AdminServiceListSchema = z.array(AdminServiceSchema);

// ── Dashboard ────────────────────────────────────────────────────────────────

export const AdminGrowthPointSchema = z.object({
  date:  z.string(),
  count: z.number(),
});

export const AdminRecentRegistrationSchema = z.object({
  id:          z.number(),
  email:       z.string().email(),
  first_name:  z.string(),
  last_name:   z.string(),
  is_active:   z.boolean(),
  date_joined: z.string(),
});

export const AdminDashboardSummarySchema = z.object({
  total_users:          z.number(),
  active_today:         z.number(),
  new_this_week:        z.number(),
  services_running:     z.number(),
  user_growth:          z.array(AdminGrowthPointSchema),
  service_usage:        z.array(AdminServiceSchema),
  recent_registrations: z.array(AdminRecentRegistrationSchema),
  unread_system_alerts: z.number(),
  security_alerts:      z.number(),
});

export type AdminDashboardSummary = z.infer<typeof AdminDashboardSummarySchema>;
