import { z } from "zod";

export const INSTANCE_STATUSES = ["draft", "published", "unpublished"] as const;
export type InstanceStatus = (typeof INSTANCE_STATUSES)[number];

export const ITEM_TYPES = [
  "project", "experience", "education", "certification", "skill", "social_link",
] as const;
export type PortfolioItemType = (typeof ITEM_TYPES)[number];

// ── Templates (user-facing gallery) ──────────────────────────────────────────

export const TemplateSectionSchema = z.object({
  section_key:   z.string(),
  is_required:   z.boolean(),
  display_order: z.number(),
});

export const TemplateCardSchema = z.object({
  id:             z.number(),
  name:           z.string(),
  slug:           z.string(),
  description:    z.string(),
  thumbnail:      z.string().nullable(),
  category:       z.string(),
  sections_count: z.number(),
});

export const TemplateDetailSchema = z.object({
  id:          z.number(),
  name:        z.string(),
  slug:        z.string(),
  description: z.string(),
  thumbnail:   z.string().nullable(),
  category:    z.string(),
  sections:    z.array(TemplateSectionSchema),
});

export type TemplateCard = z.infer<typeof TemplateCardSchema>;
export type TemplateDetail = z.infer<typeof TemplateDetailSchema>;

// ── Portfolio instances ──────────────────────────────────────────────────────

export const InstanceTemplateSummarySchema = z.object({
  id:        z.number(),
  name:      z.string(),
  slug:      z.string(),
  thumbnail: z.string().nullable(),
});

export const SectionStateSchema = z.object({
  section_id:  z.number(),
  section_key: z.string(),
  is_required: z.boolean(),
  is_enabled:  z.boolean(),
});

export const PortfolioServiceSchema = z.object({
  id:            z.number(),
  title:         z.string(),
  description:   z.string(),
  bullets:       z.array(z.string()),
  display_order: z.number(),
});

export const ItemVisibilitySchema = z.object({
  item_type:     z.string(),
  item_id:       z.string(),
  is_visible:    z.boolean(),
  display_order: z.number(),
});

export const PortfolioInstanceListItemSchema = z.object({
  id:            z.number(),
  slug:          z.string(),
  title:         z.string(),
  status:        z.enum(INSTANCE_STATUSES),
  template:      InstanceTemplateSummarySchema,
  setup_step:    z.number(),
  custom_domain: z.string().nullable(),
  published_at:  z.string().nullable(),
  created_at:    z.string(),
  updated_at:    z.string(),
});

export const PortfolioInstanceDetailSchema = PortfolioInstanceListItemSchema.extend({
  meta_title:        z.string(),
  meta_description:  z.string(),
  og_image:          z.string().nullable(),
  is_featured:       z.boolean(),
  section_states:    z.array(SectionStateSchema),
  services:          z.array(PortfolioServiceSchema),
  item_visibilities: z.array(ItemVisibilitySchema),
});

export type PortfolioInstanceListItem = z.infer<typeof PortfolioInstanceListItemSchema>;
export type PortfolioInstanceDetail = z.infer<typeof PortfolioInstanceDetailSchema>;
export type PortfolioServiceItem = z.infer<typeof PortfolioServiceSchema>;

export const RenderedHtmlSchema = z.object({ html: z.string() });

export const SlugAvailabilitySchema = z.object({
  slug:      z.string(),
  available: z.boolean(),
});

// ── Selectable "My Data" items shown in the builder ──────────────────────────
// Fetched independently by this feature (never imported from features/user-data —
// cross-feature internal imports are banned), so only the few display fields the
// builder actually renders are modelled here.

export const SelectableItemSchema = z.object({
  id:    z.number(),
  label: z.string(),
  meta:  z.string(),
});

export type SelectableItem = z.infer<typeof SelectableItemSchema>;

// ── Forms ────────────────────────────────────────────────────────────────────

export const CreatePortfolioFormSchema = z.object({
  title: z.string().min(1, "Give this portfolio a name"),
});
export type CreatePortfolioFormValues = z.infer<typeof CreatePortfolioFormSchema>;

export const PortfolioServiceFormSchema = z.object({
  title:       z.string().min(1, "Title is required"),
  description: z.string().optional(),
  bullets:     z.array(z.string()).optional(),
});
export type PortfolioServiceFormValues = z.infer<typeof PortfolioServiceFormSchema>;

export const PublishSettingsFormSchema = z.object({
  title:            z.string().min(1, "Name is required"),
  slug:             z.string()
    .min(3, "At least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  custom_domain:    z.string().optional(),
  meta_title:       z.string().max(200).optional(),
  meta_description: z.string().max(300).optional(),
});
export type PublishSettingsFormValues = z.infer<typeof PublishSettingsFormSchema>;
