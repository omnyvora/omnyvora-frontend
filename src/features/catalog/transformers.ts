import type { PlatformService, PlatformServiceUI } from "./types";

export function toServiceUI(s: PlatformService): PlatformServiceUI {
  return {
    id:          s.id,
    slug:        s.slug,
    name:        s.name,
    description: s.description,
    icon:        s.icon,
    category:    s.category,
    bg:          s.accent_subtle,
    fg:          s.accent_text,
  };
}

export function toServicesUI(services: PlatformService[]): PlatformServiceUI[] {
  return services.map(toServiceUI);
}

export function uniqueCategories(services: PlatformServiceUI[]): string[] {
  return Array.from(new Set(services.map((s) => s.category)));
}
