import { z } from "zod";

export const TEMPLATE_STATUSES = ["draft", "published", "archived"] as const;
export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number];

export const PAGE_TYPES = ["main", "project_detail"] as const;
export type TemplatePageType = (typeof PAGE_TYPES)[number];

// Fixed section vocabulary — mirrors portfolio/templates/constants.py SECTION_CHOICES.
export const SECTION_KEYS = [
  "hero", "about", "skills", "projects", "experience",
  "services", "certifications", "education", "contact",
] as const;

export const AdminTemplateListItemSchema = z.object({
  id:          z.number(),
  name:        z.string(),
  slug:        z.string(),
  thumbnail:   z.string().nullable(),
  category:    z.string(),
  status:      z.enum(TEMPLATE_STATUSES),
  created_by:  z.string(),
  usage_count: z.number(),
});

export const AdminTemplateSectionSchema = z.object({
  section_key:   z.string(),
  is_required:   z.boolean(),
  display_order: z.number(),
});

export const AdminTemplatePageSchema = z.object({
  id:        z.number(),
  page_type: z.string(),
  html_file: z.string(),
});

export const AdminTemplateAssetSchema = z.object({
  id:            z.number(),
  file:          z.string(),
  relative_path: z.string(),
});

export const AdminTemplateDetailSchema = AdminTemplateListItemSchema.extend({
  description: z.string(),
  sections:    z.array(AdminTemplateSectionSchema),
  pages:       z.array(AdminTemplatePageSchema),
  assets:      z.array(AdminTemplateAssetSchema),
  fields_used: z.array(z.object({ placeholder_key: z.string() })),
});

export type AdminTemplateListItem = z.infer<typeof AdminTemplateListItemSchema>;
export type AdminTemplateDetail = z.infer<typeof AdminTemplateDetailSchema>;

export const AdminPortfolioListItemSchema = z.object({
  id:            z.number(),
  slug:          z.string(),
  title:         z.string(),
  status:        z.string(),
  template:      z.object({ id: z.number(), name: z.string(), slug: z.string(), thumbnail: z.string().nullable() }),
  owner_email:   z.string(),
  custom_domain: z.string().nullable(),
  setup_step:    z.number(),
  is_featured:   z.boolean(),
  published_at:  z.string().nullable(),
  updated_at:    z.string(),
});

export const AdminPortfolioDetailSchema = AdminPortfolioListItemSchema.extend({
  created_at:     z.string(),
  section_states: z.array(z.object({
    section_id:  z.number(),
    section_key: z.string(),
    is_required: z.boolean(),
    is_enabled:  z.boolean(),
  })),
  services: z.array(z.object({
    id: z.number(), title: z.string(), description: z.string(),
    bullets: z.array(z.string()), display_order: z.number(),
  })),
});

export type AdminPortfolioListItem = z.infer<typeof AdminPortfolioListItemSchema>;
export type AdminPortfolioDetail = z.infer<typeof AdminPortfolioDetailSchema>;

export const PortfolioDashboardStatsSchema = z.object({
  total:       z.number(),
  published:   z.number(),
  draft:       z.number(),
  unpublished: z.number(),
});

export type PortfolioDashboardStats = z.infer<typeof PortfolioDashboardStatsSchema>;

// ── Forms ────────────────────────────────────────────────────────────────────

export const TemplateCreateFormSchema = z.object({
  name:        z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category:    z.string().optional(),
});
export type TemplateCreateFormValues = z.infer<typeof TemplateCreateFormSchema>;

export const TemplateMetadataFormSchema = z.object({
  name:        z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category:    z.string().optional(),
  status:      z.enum(TEMPLATE_STATUSES),
});
export type TemplateMetadataFormValues = z.infer<typeof TemplateMetadataFormSchema>;

export const UnpublishReasonFormSchema = z.object({
  reason: z.string().min(5, "Give a reason (at least 5 characters)"),
});
export type UnpublishReasonFormValues = z.infer<typeof UnpublishReasonFormSchema>;
