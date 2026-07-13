import type {
  SystemLog,
  AdminUser,
  AdminUserDetail,
  AdminService,
  AdminDashboardSummary,
  AdminSettings,
  AdminSettingsFormValues,
} from "./types";

export interface LogRowUI {
  id:        number;
  level:     string;
  actor:     string;
  message:   string;
  timestamp: string;
  traceback: string | null;
}

export function toLogRowUI(log: SystemLog): LogRowUI {
  return {
    id:        log.id,
    level:     log.log_level,
    actor:     log.actor_email ?? log.actor_type ?? "system",
    message:   log.message,
    timestamp: log.timestamp,
    traceback: log.traceback,
  };
}

export function toLogRowsUI(logs: SystemLog[]): LogRowUI[] {
  return logs.map(toLogRowUI);
}

// ── Users ────────────────────────────────────────────────────────────────────

function formatLabel(raw: string): string {
  const spaced = raw.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export interface AdminUserListItemUI {
  id:         number;
  fullName:   string;
  initials:   string;
  email:      string;
  isActive:   boolean;
  role:       AdminUser["role"];
  dateJoined: string;
}

function initialsOf(firstName: string, lastName: string, email: string): string {
  return (
    [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() ||
    email[0]?.toUpperCase() ||
    "?"
  );
}

export function toAdminUserListItemUI(user: AdminUser): AdminUserListItemUI {
  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const initials = initialsOf(user.first_name, user.last_name, user.email);
  return {
    id:         user.id,
    fullName,
    initials,
    email:      user.email,
    isActive:   user.is_active,
    role:       user.role,
    dateJoined: user.date_joined,
  };
}

export function toAdminUserListUI(users: AdminUser[]): AdminUserListItemUI[] {
  return users.map(toAdminUserListItemUI);
}

export interface AdminUserActivityUI {
  id:         number;
  action:     string;
  title:      string;
  subtitle:   string;
  occurredAt: string;
}

export interface AdminUserDetailUI {
  user:        AdminUserListItemUI;
  phone:       string;
  dateOfBirth: string;
  bio:         string;
  avatar:      string | null;
  activity:    AdminUserActivityUI[];
}

export function toAdminUserDetailUI(detail: AdminUserDetail): AdminUserDetailUI {
  return {
    user:        toAdminUserListItemUI(detail.user),
    phone:       detail.profile.phone ?? "",
    dateOfBirth: detail.profile.date_of_birth ?? "",
    bio:         detail.profile.bio ?? "",
    avatar:      detail.profile.avatar,
    activity:    detail.activity.map((a) => ({
      id:         a.id,
      action:     a.action,
      title:      formatLabel(a.action),
      subtitle:   formatLabel(a.service),
      occurredAt: a.occurred_at,
    })),
  };
}

// ── Services ─────────────────────────────────────────────────────────────────

export interface AdminServiceUI {
  id:        number;
  slug:      string;
  name:      string;
  isActive:  boolean;
  userCount: number;
}

export function toAdminServiceUI(service: AdminService): AdminServiceUI {
  return {
    id:        service.id,
    slug:      service.slug,
    name:      service.name,
    isActive:  service.is_active,
    userCount: service.user_count,
  };
}

export function toAdminServiceListUI(services: AdminService[]): AdminServiceUI[] {
  return services.map(toAdminServiceUI);
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export interface AdminRegistrationUI {
  id:         number;
  fullName:   string;
  initials:   string;
  email:      string;
  isActive:   boolean;
  dateJoined: string;
}

export interface AdminGrowthPointUI {
  date:  string;
  count: number;
}

export interface AdminDashboardUI {
  totalUsers:          number;
  activeToday:         number;
  newThisWeek:         number;
  servicesRunning:     number;
  userGrowth:          AdminGrowthPointUI[];
  serviceUsage:        AdminServiceUI[];
  recentRegistrations: AdminRegistrationUI[];
  unreadSystemAlerts:  number;
  securityAlerts:      number;
}

export function toAdminDashboardUI(summary: AdminDashboardSummary): AdminDashboardUI {
  return {
    totalUsers:      summary.total_users,
    activeToday:     summary.active_today,
    newThisWeek:     summary.new_this_week,
    servicesRunning: summary.services_running,
    userGrowth:      summary.user_growth.map((p) => ({ date: p.date, count: p.count })),
    serviceUsage:    toAdminServiceListUI(summary.service_usage),
    recentRegistrations: summary.recent_registrations.map((r) => ({
      id:         r.id,
      fullName:   `${r.first_name} ${r.last_name}`.trim() || r.email,
      initials:   initialsOf(r.first_name, r.last_name, r.email),
      email:      r.email,
      isActive:   r.is_active,
      dateJoined: r.date_joined,
    })),
    unreadSystemAlerts: summary.unread_system_alerts,
    securityAlerts:     summary.security_alerts,
  };
}

// ── Settings ─────────────────────────────────────────────────────────────────

// Field names already match the form 1:1 — this just drops the read-only
// updated_at so the object is safe to feed straight into form.reset().
export function toAdminSettingsFormValues(settings: AdminSettings): AdminSettingsFormValues {
  return {
    maintenance_mode:          settings.maintenance_mode,
    allow_signups:             settings.allow_signups,
    default_region:            settings.default_region,
    session_timeout_minutes:   settings.session_timeout_minutes,
    require_otp_on_login:      settings.require_otp_on_login,
    otp_delivery_channel:      settings.otp_delivery_channel,
    otp_code_lifetime_minutes: settings.otp_code_lifetime_minutes,
    allow_password_reset:      settings.allow_password_reset,
    email_admin_alerts:        settings.email_admin_alerts,
    weekly_digest:             settings.weekly_digest,
    failed_login_alerts:       settings.failed_login_alerts,
    quota_warnings:            settings.quota_warnings,
  };
}
