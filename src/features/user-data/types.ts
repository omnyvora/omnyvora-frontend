import { z } from "zod";

// Mirrors user_data.taxonomy.constants.TECHNOLOGY_CATEGORY_CHOICES
export const TECHNOLOGY_CATEGORIES = [
  "language",
  "framework",
  "database",
  "tool",
  "soft_skill",
  "other",
] as const;

export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number];

export const TECHNOLOGY_CATEGORY_LABELS: Record<TechnologyCategory, string> = {
  language:   "Languages",
  framework:  "Frameworks",
  database:   "Databases",
  tool:       "Tools",
  soft_skill: "Soft skills",
  other:      "Other",
};

export const TechnologySchema = z.object({
  id:       z.number(),
  name:     z.string(),
  slug:     z.string(),
  category: z.enum(TECHNOLOGY_CATEGORIES),
});

export type Technology = z.infer<typeof TechnologySchema>;

export const UserTechnologySchema = z.object({
  id:            z.number(),
  technology:    TechnologySchema,
  proficiency:   z.number().min(0).max(100).nullable(),
  display_order: z.number(),
});

export type UserTechnology = z.infer<typeof UserTechnologySchema>;

export const CreateTechnologyFormSchema = z.object({
  technology_name: z.string().min(1, "Pick or type a technology"),
  category:        z.enum(TECHNOLOGY_CATEGORIES),
  proficiency:     z.number().min(0).max(100),
});

export type CreateTechnologyFormValues = z.infer<typeof CreateTechnologyFormSchema>;

// ── Skills (separate from the Technology catalog above — no category) ────────

export const SkillCatalogEntrySchema = z.object({
  id:   z.number(),
  name: z.string(),
  slug: z.string(),
});

export type SkillCatalogEntry = z.infer<typeof SkillCatalogEntrySchema>;

export const UserSkillSchema = z.object({
  id:            z.number(),
  skill:         SkillCatalogEntrySchema,
  proficiency:   z.number().min(0).max(100).nullable(),
  display_order: z.number(),
});

export type UserSkill = z.infer<typeof UserSkillSchema>;

export const CreateSkillFormSchema = z.object({
  skill_name:  z.string().min(1, "Pick or type a skill"),
  proficiency: z.number().min(0).max(100),
});

export type CreateSkillFormValues = z.infer<typeof CreateSkillFormSchema>;

// ── Projects ─────────────────────────────────────────────────────────────────

export const ProjectImageSchema = z.object({
  id:            z.number(),
  image:         z.string(),
  caption:       z.string(),
  is_cover:      z.boolean(),
  display_order: z.number(),
});

export type ProjectImage = z.infer<typeof ProjectImageSchema>;

export const ProjectSchema = z.object({
  id:                z.number(),
  title:             z.string(),
  short_description: z.string(),
  description:       z.string(),
  achievements:      z.array(z.string()),
  technologies:      z.array(z.string()),
  skills:            z.array(z.string()),
  github_url:        z.string(),
  live_url:          z.string(),
  is_featured:       z.boolean(),
  display_order:     z.number(),
  images:            z.array(ProjectImageSchema),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectFormSchema = z.object({
  title:             z.string().min(1, "Title is required"),
  short_description: z.string().max(300).optional(),
  description:       z.string().optional(),
  achievements:      z.array(z.string()).optional(),
  technology_names:  z.array(z.string()).optional(),
  skill_names:       z.array(z.string()).optional(),
  github_url:        z.string().optional(),
  live_url:          z.string().optional(),
  is_featured:       z.boolean().optional(),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

// ── Experience ───────────────────────────────────────────────────────────────

export const ExperienceSchema = z.object({
  id:               z.number(),
  job_title:        z.string(),
  company_name:     z.string(),
  company_url:      z.string(),
  location:         z.string(),
  description:      z.string(),
  technologies:     z.array(z.string()),
  skills:           z.array(z.string()),
  certification_id: z.number().nullable(),
  start_date:       z.string(),
  end_date:         z.string().nullable(),
  is_current:       z.boolean(),
  display_order:    z.number(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const ExperienceFormSchema = z.object({
  job_title:        z.string().min(1, "Job title is required"),
  company_name:     z.string().min(1, "Company is required"),
  company_url:      z.string().optional(),
  location:         z.string().optional(),
  description:      z.string().optional(),
  technology_names: z.array(z.string()).optional(),
  skill_names:      z.array(z.string()).optional(),
  certification_id: z.number().nullable().optional(),
  start_date:       z.string().min(1, "Start date is required"),
  end_date:         z.string().nullable().optional(),
});

export type ExperienceFormValues = z.infer<typeof ExperienceFormSchema>;

// ── Certifications ───────────────────────────────────────────────────────────

export const CertificationSchema = z.object({
  id:             z.number(),
  title:          z.string(),
  issuer:         z.string(),
  issue_date:     z.string(),
  credential_url: z.string(),
  image:          z.string().nullable(),
  display_order:  z.number(),
});

export type Certification = z.infer<typeof CertificationSchema>;

export const CertificationOptionSchema = z.object({
  id:     z.number(),
  title:  z.string(),
  issuer: z.string(),
});

export type CertificationOption = z.infer<typeof CertificationOptionSchema>;

export const CertificationFormSchema = z.object({
  title:          z.string().min(1, "Title is required"),
  issuer:         z.string().min(1, "Issuer is required"),
  issue_date:     z.string().min(1, "Issue date is required"),
  credential_url: z.string().optional(),
});

export type CertificationFormValues = z.infer<typeof CertificationFormSchema>;

// ── Education ────────────────────────────────────────────────────────────────

export const EducationSchema = z.object({
  id:                z.number(),
  degree:            z.string(),
  institution:       z.string(),
  department:        z.string(),
  gpa:               z.string().nullable(),
  gpa_scale:         z.string().nullable(),
  certification_id:  z.number().nullable(),
  start_date:        z.string(),
  end_date:          z.string().nullable(),
  display_order:     z.number(),
});

export type Education = z.infer<typeof EducationSchema>;

export const EducationFormSchema = z.object({
  degree:           z.string().min(1, "Degree is required"),
  institution:      z.string().min(1, "Institution is required"),
  department:       z.string().optional(),
  gpa:              z.string().nullable().optional(),
  gpa_scale:        z.string().nullable().optional(),
  certification_id: z.number().nullable().optional(),
  start_date:       z.string().min(1, "Start date is required"),
  end_date:         z.string().nullable().optional(),
});

export type EducationFormValues = z.infer<typeof EducationFormSchema>;

// ── Social links ─────────────────────────────────────────────────────────────

// Mirrors user_data.social_links.constants.PLATFORM_CHOICES
export const SOCIAL_PLATFORMS = ["github", "linkedin", "facebook", "x", "website", "other"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  github:   "GitHub",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  x:        "X",
  website:  "Website",
  other:    "Other",
};

export const SocialLinkSchema = z.object({
  id:            z.number(),
  platform:      z.enum(SOCIAL_PLATFORMS),
  label:         z.string(),
  url:           z.string(),
  display_order: z.number(),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;

export const SocialLinkFormSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  label:    z.string().optional(),
  url:      z.string().min(1, "URL is required"),
});

export type SocialLinkFormValues = z.infer<typeof SocialLinkFormSchema>;
