import type {
  ItemVisibilitySchema,
  PortfolioInstanceDetail,
  PortfolioInstanceListItem,
  PortfolioItemType,
  PortfolioServiceItem,
  SectionStateSchema,
  SelectableItem,
  TemplateCard,
  TemplateDetail,
} from "./types";
import type { z } from "zod";

type SectionState = z.infer<typeof SectionStateSchema>;
type ItemVisibility = z.infer<typeof ItemVisibilitySchema>;

export interface TemplateCardUI {
  id:            number;
  name:          string;
  slug:          string;
  description:   string;
  thumbnail:     string | null;
  category:      string;
  sectionsCount: number;
}

export interface SectionStateUI {
  sectionId:  number;
  sectionKey: string;
  label:      string;
  isRequired: boolean;
  isEnabled:  boolean;
}

export interface PortfolioServiceUI {
  id:           number;
  title:        string;
  description:  string;
  bullets:      string[];
  displayOrder: number;
}

export interface PortfolioListItemUI {
  id:           number;
  slug:         string;
  title:        string;
  status:       PortfolioInstanceListItem["status"];
  statusLabel:  string;
  statusBadge:  string;
  templateName: string;
  templateThumb: string | null;
  customDomain: string | null;
  publishedAt:  string | null;
  updatedAt:    string;
}

export interface PortfolioDetailUI extends PortfolioListItemUI {
  metaTitle:       string;
  metaDescription: string;
  ogImage:         string | null;
  isFeatured:      boolean;
  templateId:      number;
  sections:        SectionStateUI[];
  services:        PortfolioServiceUI[];
  visibility:      ItemVisibility[];
}

const STATUS_META: Record<PortfolioInstanceListItem["status"], { label: string; badge: string }> = {
  draft:       { label: "Draft",       badge: "badge--warning" },
  published:   { label: "Published",   badge: "badge--success" },
  unpublished: { label: "Unpublished", badge: "badge--neutral" },
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero", about: "About", skills: "Skills", projects: "Projects",
  experience: "Experience", services: "Services", certifications: "Certifications",
  education: "Education", contact: "Contact",
};

export function sectionLabel(key: string): string {
  return SECTION_LABELS[key] ?? key;
}

export function toTemplateCardUI(t: TemplateCard): TemplateCardUI {
  return {
    id: t.id, name: t.name, slug: t.slug, description: t.description,
    thumbnail: t.thumbnail, category: t.category, sectionsCount: t.sections_count,
  };
}

export function uniqueTemplateCategories(templates: TemplateCardUI[]): string[] {
  return [...new Set(templates.map((t) => t.category).filter(Boolean))].sort();
}

export function toSectionStateUI(s: SectionState): SectionStateUI {
  return {
    sectionId: s.section_id, sectionKey: s.section_key,
    label: sectionLabel(s.section_key), isRequired: s.is_required, isEnabled: s.is_enabled,
  };
}

export function toPortfolioServiceUI(s: PortfolioServiceItem): PortfolioServiceUI {
  return {
    id: s.id, title: s.title, description: s.description,
    bullets: s.bullets, displayOrder: s.display_order,
  };
}

export function toPortfolioListItemUI(p: PortfolioInstanceListItem): PortfolioListItemUI {
  const meta = STATUS_META[p.status];
  return {
    id: p.id, slug: p.slug, title: p.title || "Untitled portfolio",
    status: p.status, statusLabel: meta.label, statusBadge: meta.badge,
    templateName: p.template.name, templateThumb: p.template.thumbnail,
    customDomain: p.custom_domain, publishedAt: p.published_at, updatedAt: p.updated_at,
  };
}

export function toPortfolioDetailUI(p: PortfolioInstanceDetail): PortfolioDetailUI {
  return {
    ...toPortfolioListItemUI(p),
    metaTitle: p.meta_title, metaDescription: p.meta_description,
    ogImage: p.og_image, isFeatured: p.is_featured, templateId: p.template.id,
    sections: p.section_states.map(toSectionStateUI),
    services: [...p.services].sort((a, b) => a.display_order - b.display_order).map(toPortfolioServiceUI),
    visibility: p.item_visibilities,
  };
}

export function toTemplateDetailSections(t: TemplateDetail): { key: string; label: string; isRequired: boolean }[] {
  return t.sections.map((s) => ({
    key: s.section_key, label: sectionLabel(s.section_key), isRequired: s.is_required,
  }));
}

// ── "My Data" records → the builder's checkbox rows ──────────────────────────

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function year(value: unknown): string {
  const s = str(value);
  return s ? s.slice(0, 4) : "";
}

export function toSelectableItems(
  itemType: PortfolioItemType,
  records: { id: number; [key: string]: unknown }[],
): SelectableItem[] {
  return records.map((r) => {
    switch (itemType) {
      case "project":
        return { id: r.id, label: str(r.title) || "Untitled project", meta: str(r.short_description) };
      case "experience": {
        const range = `${year(r.start_date)} — ${r.is_current ? "Present" : year(r.end_date) || "—"}`;
        return { id: r.id, label: `${str(r.job_title)} @ ${str(r.company_name)}`, meta: range };
      }
      case "education":
        return { id: r.id, label: str(r.degree) || "Education", meta: str(r.institution) };
      case "certification":
        return { id: r.id, label: str(r.title) || "Certification", meta: str(r.issuer) };
      case "skill": {
        const skill = r.skill as { name?: string } | undefined;
        const proficiency = typeof r.proficiency === "number" ? `${r.proficiency}%` : "";
        return { id: r.id, label: skill?.name ?? "Skill", meta: proficiency };
      }
      case "social_link":
        return { id: r.id, label: str(r.label) || str(r.platform) || "Link", meta: str(r.url) };
    }
  });
}

// Items with no stored visibility row are visible by default — this mirrors the
// backend's own rule in portfolio/instances/context.py, so the builder never
// shows an item as hidden that the published page would actually render.
export function isItemVisible(visibility: ItemVisibility[], itemType: string, itemId: number): boolean {
  const row = visibility.find((v) => v.item_type === itemType && v.item_id === String(itemId));
  return row ? row.is_visible : true;
}
