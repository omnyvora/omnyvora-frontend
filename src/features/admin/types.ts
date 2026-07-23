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
  user_path:  z.string(),
  admin_path: z.string(),
  user_count: z.number(),
});

export type AdminService = z.infer<typeof AdminServiceSchema>;

export const AdminServiceListSchema = z.array(AdminServiceSchema);

// Mirrors shared.catalog's hex-colour validator (core `_HEX_RE`) so bad values
// are caught client-side before hitting the API.
const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const hexColor = () => z.string().regex(HEX_COLOR_RE, "Must be a valid hex colour (e.g. #2563EB)");

export const PlatformServiceFormSchema = z.object({
  slug: z.string()
    .min(1, "Required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers, and hyphens only"),
  name:        z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  icon:        z.string().min(1, "Required"),
  category:    z.string().min(1, "Required"),
  user_path:   z.string().min(1, "Required"),
  admin_path:  z.string().min(1, "Required"),
  accent_primary:     hexColor(),
  accent_subtle:      hexColor(),
  accent_subtle_dark: hexColor(),
  accent_text:        hexColor(),
  is_active:  z.boolean(),
  sort_order: z.number().int().min(0, "Must be 0 or greater"),
});

export type PlatformServiceFormValues = z.infer<typeof PlatformServiceFormSchema>;

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

// ── Settings ─────────────────────────────────────────────────────────────────

export const OTP_DELIVERY_CHANNELS = ["all", "email", "phone"] as const;

export const AdminSettingsFormSchema = z.object({
  maintenance_mode:          z.boolean(),
  allow_signups:             z.boolean(),
  default_region:            z.string().min(1, "Required"),
  session_timeout_minutes:   z.coerce.number().int().min(1, "Must be at least 1 minute"),
  require_otp_on_login:      z.boolean(),
  otp_delivery_channel:      z.enum(OTP_DELIVERY_CHANNELS),
  otp_code_lifetime_minutes: z.coerce.number().int().min(1, "Must be at least 1 minute"),
  allow_password_reset:      z.boolean(),
  email_admin_alerts:        z.boolean(),
  weekly_digest:             z.boolean(),
  failed_login_alerts:       z.boolean(),
  quota_warnings:            z.boolean(),
});

export type AdminSettingsFormValues = z.infer<typeof AdminSettingsFormSchema>;

export const AdminSettingsSchema = AdminSettingsFormSchema.extend({
  updated_at: z.string(),
});

export type AdminSettings = z.infer<typeof AdminSettingsSchema>;

export const SETTINGS_TABS = ["platform", "auth", "services", "notifications"] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];
