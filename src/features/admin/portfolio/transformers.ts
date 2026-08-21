import type {
  AdminPortfolioDetail,
  AdminPortfolioListItem,
  AdminTemplateDetail,
  AdminTemplateListItem,
  TemplateStatus,
} from "./types";

const TEMPLATE_STATUS_BADGE: Record<TemplateStatus, string> = {
  draft:     "badge--warning",
  published: "badge--success",
  archived:  "badge--neutral",
};

const INSTANCE_STATUS_BADGE: Record<string, string> = {
  draft:       "badge--warning",
  published:   "badge--success",
  unpublished: "badge--neutral",
};

function titleCase(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export interface AdminTemplateRowUI {
  id:          number;
  name:        string;
  slug:        string;
  thumbnail:   string | null;
  category:    string;
  status:      TemplateStatus;
  statusLabel: string;
  statusBadge: string;
  createdBy:   string;
  usageCount:  number;
  // Deleting/restructuring a template that portfolios already use is blocked
  // server-side — surfacing it here keeps the UI honest about why.
  isInUse:     boolean;
}

export interface AdminTemplateDetailUI extends AdminTemplateRowUI {
  description: string;
  sections:    { sectionKey: string; isRequired: boolean; displayOrder: number }[];
  pages:       { id: number; pageType: string; htmlFile: string }[];
  assets:      { id: number; file: string; relativePath: string }[];
  placeholders: string[];
  hasMainPage: boolean;
}

export function toAdminTemplateRowUI(t: AdminTemplateListItem): AdminTemplateRowUI {
  return {
    id: t.id, name: t.name, slug: t.slug, thumbnail: t.thumbnail, category: t.category,
    status: t.status, statusLabel: titleCase(t.status), statusBadge: TEMPLATE_STATUS_BADGE[t.status],
    createdBy: t.created_by, usageCount: t.usage_count, isInUse: t.usage_count > 0,
  };
}

export function toAdminTemplateDetailUI(t: AdminTemplateDetail): AdminTemplateDetailUI {
  return {
    ...toAdminTemplateRowUI(t),
    description: t.description,
    sections: [...t.sections]
      .sort((a, b) => a.display_order - b.display_order)
      .map((s) => ({ sectionKey: s.section_key, isRequired: s.is_required, displayOrder: s.display_order })),
    pages: t.pages.map((p) => ({ id: p.id, pageType: p.page_type, htmlFile: p.html_file })),
    assets: t.assets.map((a) => ({ id: a.id, file: a.file, relativePath: a.relative_path })),
    placeholders: t.fields_used.map((f) => f.placeholder_key).sort(),
    hasMainPage: t.pages.some((p) => p.page_type === "main"),
  };
}

export interface AdminPortfolioRowUI {
  id:           number;
  slug:         string;
  title:        string;
  status:       string;
  statusLabel:  string;
  statusBadge:  string;
  templateName: string;
  ownerEmail:   string;
  address:      string;
  isFeatured:   boolean;
  publishedAt:  string | null;
  updatedAt:    string;
}

export interface AdminPortfolioDetailUI extends AdminPortfolioRowUI {
  createdAt:  string;
  setupStep:  number;
  sections:   { sectionKey: string; isEnabled: boolean; isRequired: boolean }[];
  services:   { id: number; title: string }[];
}

export function toAdminPortfolioRowUI(p: AdminPortfolioListItem): AdminPortfolioRowUI {
  return {
    id: p.id, slug: p.slug, title: p.title || "Untitled portfolio",
    status: p.status, statusLabel: titleCase(p.status),
    statusBadge: INSTANCE_STATUS_BADGE[p.status] ?? "badge--neutral",
    templateName: p.template.name, ownerEmail: p.owner_email,
    address: p.custom_domain ?? `/p/${p.slug}/`,
    isFeatured: p.is_featured, publishedAt: p.published_at, updatedAt: p.updated_at,
  };
}

export function toAdminPortfolioDetailUI(p: AdminPortfolioDetail): AdminPortfolioDetailUI {
  return {
    ...toAdminPortfolioRowUI(p),
    createdAt: p.created_at,
    setupStep: p.setup_step,
    sections: p.section_states.map((s) => ({
      sectionKey: s.section_key, isEnabled: s.is_enabled, isRequired: s.is_required,
    })),
    services: p.services.map((s) => ({ id: s.id, title: s.title })),
  };
}
