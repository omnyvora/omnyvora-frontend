import type { UserRole } from "@/shared/auth/types";
import type { PlatformServiceUI } from "./types";

export function getServiceOpenPath(service: PlatformServiceUI, role: UserRole | undefined): string {
  return role === "superadmin" ? service.adminPath : service.userPath;
}
