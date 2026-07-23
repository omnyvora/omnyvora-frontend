import { z } from "zod";

export const PlatformServiceSchema = z.object({
  id:                z.number(),
  slug:              z.string(),
  name:              z.string(),
  description:       z.string(),
  icon:              z.string(),
  category:          z.string(),
  user_path:         z.string(),
  admin_path:        z.string(),
  accent_primary:    z.string(),
  accent_subtle:     z.string(),
  accent_subtle_dark: z.string(),
  accent_text:       z.string(),
  is_active:         z.boolean(),
  sort_order:        z.number(),
  created_at:        z.string(),
  updated_at:        z.string(),
});

export type PlatformService = z.infer<typeof PlatformServiceSchema>;

export const PlatformServiceListSchema = z.array(PlatformServiceSchema);

export interface PlatformServiceUI {
  id:       number;
  slug:     string;
  name:     string;
  description: string;
  icon:     string;
  category: string;
  userPath: string;
  adminPath: string;
  bg:       string;
  fg:       string;
}
