import type { SystemLog, AdminUser, AdminUserDetail, AdminService } from "./types";

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

export function toAdminUserListItemUI(user: AdminUser): AdminUserListItemUI {
  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const initials =
    [user.first_name[0], user.last_name[0]].filter(Boolean).join("").toUpperCase() ||
    user.email[0]?.toUpperCase() ||
    "?";
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
