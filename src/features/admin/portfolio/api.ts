import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type {
  AdminPortfolioDetail,
  AdminPortfolioListItem,
  AdminTemplateDetail,
  AdminTemplateListItem,
  PortfolioDashboardStats,
  TemplateCreateFormValues,
  TemplateMetadataFormValues,
  TemplatePageType,
} from "./types";

const PORTFOLIO_URL = resolveServiceUrl("portfolio");
const TEMPLATES = `${PORTFOLIO_URL}/portfolio/templates/admin`;
const INSTANCES = `${PORTFOLIO_URL}/portfolio/instances/admin`;

// ── Templates ────────────────────────────────────────────────────────────────

export async function fetchAdminTemplates(status: string, search: string): Promise<ApiResponse<AdminTemplateListItem[]>> {
  const res = await apiClient.get(`${TEMPLATES}/`, {
    params: {
      ...(status && status !== "All" ? { status: status.toLowerCase() } : {}),
      ...(search ? { search } : {}),
    },
  });
  return res.data;
}

export async function fetchAdminTemplate(templateId: number): Promise<ApiResponse<AdminTemplateDetail>> {
  const res = await apiClient.get(`${TEMPLATES}/${templateId}/`);
  return res.data;
}

export async function createAdminTemplate(
  values: TemplateCreateFormValues,
  thumbnail: File | null,
): Promise<ApiResponse<AdminTemplateDetail>> {
  const form = new FormData();
  form.append("name", values.name);
  form.append("description", values.description ?? "");
  form.append("category", values.category ?? "");
  if (thumbnail) form.append("thumbnail", thumbnail);

  const res = await apiClient.post(`${TEMPLATES}/`, form, {
    headers: { "Content-Type": null },
  });
  return res.data;
}

export async function updateAdminTemplate(
  templateId: number,
  values: Partial<TemplateMetadataFormValues>,
  thumbnail: File | null,
): Promise<ApiResponse<AdminTemplateDetail>> {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) form.append(key, String(value));
  }
  if (thumbnail) form.append("thumbnail", thumbnail);

  const res = await apiClient.patch(`${TEMPLATES}/${templateId}/`, form, {
    headers: { "Content-Type": null },
  });
  return res.data;
}

export async function archiveAdminTemplate(templateId: number): Promise<ApiResponse<AdminTemplateDetail>> {
  const res = await apiClient.post(`${TEMPLATES}/${templateId}/archive/`);
  return res.data;
}

export async function uploadTemplatePage(
  templateId: number,
  pageType: TemplatePageType,
  file: File,
): Promise<ApiResponse<{ id: number; page_type: string; html_file: string }>> {
  const form = new FormData();
  form.append("page_type", pageType);
  form.append("html_file", file);

  const res = await apiClient.post(`${TEMPLATES}/${templateId}/pages/`, form, {
    headers: { "Content-Type": null },
  });
  return res.data;
}

export async function uploadTemplateAsset(
  templateId: number,
  file: File,
  relativePath: string,
): Promise<ApiResponse<{ id: number; file: string; relative_path: string }>> {
  const form = new FormData();
  form.append("file", file);
  form.append("relative_path", relativePath);

  const res = await apiClient.post(`${TEMPLATES}/${templateId}/assets/`, form, {
    headers: { "Content-Type": null },
  });
  return res.data;
}

export async function setTemplateSections(
  templateId: number,
  sections: { section_key: string; is_required: boolean }[],
): Promise<ApiResponse<AdminTemplateDetail>> {
  const res = await apiClient.put(`${TEMPLATES}/${templateId}/sections/`, { sections });
  return res.data;
}

export async function fetchAdminTemplatePreview(
  templateId: number,
  pageType: TemplatePageType,
): Promise<ApiResponse<{ html: string }>> {
  const res = await apiClient.get(`${TEMPLATES}/${templateId}/preview/`, {
    params: { page_type: pageType },
  });
  return res.data;
}

// ── Portfolio instances (oversight) ──────────────────────────────────────────

export async function fetchAdminPortfolios(status: string, search: string): Promise<ApiResponse<AdminPortfolioListItem[]>> {
  const res = await apiClient.get(`${INSTANCES}/`, {
    params: {
      ...(status && status !== "All" ? { status: status.toLowerCase() } : {}),
      ...(search ? { search } : {}),
    },
  });
  return res.data;
}

export async function fetchAdminPortfolio(instanceId: number): Promise<ApiResponse<AdminPortfolioDetail>> {
  const res = await apiClient.get(`${INSTANCES}/${instanceId}/`);
  return res.data;
}

export async function adminUnpublishPortfolio(
  instanceId: number,
  reason: string,
): Promise<ApiResponse<AdminPortfolioDetail>> {
  const res = await apiClient.post(`${INSTANCES}/${instanceId}/unpublish/`, { reason });
  return res.data;
}

export async function adminToggleFeatured(instanceId: number): Promise<ApiResponse<AdminPortfolioDetail>> {
  const res = await apiClient.post(`${INSTANCES}/${instanceId}/feature/`);
  return res.data;
}

export async function fetchPortfolioDashboard(): Promise<ApiResponse<PortfolioDashboardStats>> {
  const res = await apiClient.get(`${INSTANCES}/dashboard/`);
  return res.data;
}
