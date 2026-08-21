import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type {
  PortfolioInstanceDetail,
  PortfolioInstanceListItem,
  PortfolioItemType,
  PortfolioServiceFormValues,
  PortfolioServiceItem,
  PublishSettingsFormValues,
  TemplateCard,
  TemplateDetail,
} from "./types";

const PORTFOLIO_URL = resolveServiceUrl("portfolio");
const USER_DATA_URL = resolveServiceUrl("userData");

const TEMPLATES = `${PORTFOLIO_URL}/portfolio/templates`;
const INSTANCES = `${PORTFOLIO_URL}/portfolio/instances`;

// ── Templates ────────────────────────────────────────────────────────────────

export async function fetchTemplateGallery(category: string, search: string): Promise<ApiResponse<TemplateCard[]>> {
  const res = await apiClient.get(`${TEMPLATES}/`, {
    params: {
      ...(category && category !== "All" ? { category } : {}),
      ...(search ? { search } : {}),
    },
  });
  return res.data;
}

export async function fetchTemplateDetail(slug: string): Promise<ApiResponse<TemplateDetail>> {
  const res = await apiClient.get(`${TEMPLATES}/${slug}/`);
  return res.data;
}

export async function fetchTemplatePreview(slug: string): Promise<ApiResponse<{ html: string }>> {
  const res = await apiClient.get(`${TEMPLATES}/${slug}/preview/`);
  return res.data;
}

// ── Instances ────────────────────────────────────────────────────────────────

export async function fetchPortfolios(): Promise<ApiResponse<PortfolioInstanceListItem[]>> {
  const res = await apiClient.get(`${INSTANCES}/`);
  return res.data;
}

export async function fetchPortfolio(instanceId: number): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const res = await apiClient.get(`${INSTANCES}/${instanceId}/`);
  return res.data;
}

export async function createPortfolio(payload: { template_id: number; title: string }): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const res = await apiClient.post(`${INSTANCES}/`, payload);
  return res.data;
}

export async function updatePortfolio(
  instanceId: number,
  payload: Partial<PublishSettingsFormValues>,
): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const res = await apiClient.patch(`${INSTANCES}/${instanceId}/`, payload);
  return res.data;
}

export async function uploadOgImage(instanceId: number, file: File): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const form = new FormData();
  form.append("og_image", file);
  const res = await apiClient.patch(`${INSTANCES}/${instanceId}/`, form, {
    headers: { "Content-Type": null },
  });
  return res.data;
}

export async function deletePortfolio(instanceId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${INSTANCES}/${instanceId}/`);
  return res.data;
}

export async function setSectionStates(
  instanceId: number,
  states: { section_id: number; is_enabled: boolean }[],
): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const res = await apiClient.patch(`${INSTANCES}/${instanceId}/sections/`, { states });
  return res.data;
}

export async function setItemVisibility(
  instanceId: number,
  itemType: PortfolioItemType,
  items: { item_id: string; is_visible: boolean }[],
): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const res = await apiClient.patch(`${INSTANCES}/${instanceId}/visibility/`, {
    item_type: itemType,
    items,
  });
  return res.data;
}

export async function createPortfolioService(
  instanceId: number,
  payload: PortfolioServiceFormValues,
): Promise<ApiResponse<PortfolioServiceItem>> {
  const res = await apiClient.post(`${INSTANCES}/${instanceId}/services/`, payload);
  return res.data;
}

export async function updatePortfolioService(
  instanceId: number,
  serviceId: number,
  payload: Partial<PortfolioServiceFormValues>,
): Promise<ApiResponse<PortfolioServiceItem>> {
  const res = await apiClient.patch(`${INSTANCES}/${instanceId}/services/${serviceId}/`, payload);
  return res.data;
}

export async function deletePortfolioService(instanceId: number, serviceId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${INSTANCES}/${instanceId}/services/${serviceId}/`);
  return res.data;
}

export async function reorderPortfolioServices(instanceId: number, orderedIds: number[]): Promise<ApiResponse<null>> {
  const res = await apiClient.post(`${INSTANCES}/${instanceId}/services/reorder/`, { ordered_ids: orderedIds });
  return res.data;
}

export async function checkSlugAvailability(
  slug: string,
  excludeInstanceId: number,
): Promise<ApiResponse<{ slug: string; available: boolean }>> {
  const res = await apiClient.get(`${INSTANCES}/slug-available/`, {
    params: { slug, exclude_instance_id: excludeInstanceId },
  });
  return res.data;
}

export async function changePortfolioTemplate(
  instanceId: number,
  templateId: number,
): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const res = await apiClient.post(`${INSTANCES}/${instanceId}/change-template/`, { template_id: templateId });
  return res.data;
}

export async function publishPortfolio(instanceId: number): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const res = await apiClient.post(`${INSTANCES}/${instanceId}/publish/`);
  return res.data;
}

export async function unpublishPortfolio(instanceId: number): Promise<ApiResponse<PortfolioInstanceDetail>> {
  const res = await apiClient.post(`${INSTANCES}/${instanceId}/unpublish/`);
  return res.data;
}

export async function fetchPortfolioPreview(instanceId: number): Promise<ApiResponse<{ html: string }>> {
  const res = await apiClient.get(`${INSTANCES}/${instanceId}/preview/`);
  return res.data;
}

// ── "My Data" item lists shown in the builder ────────────────────────────────
// Fetched here rather than reused from features/user-data — cross-feature
// internal imports are banned, so this feature owns its own read path.

interface RawUserDataRecord {
  id: number;
  [key: string]: unknown;
}

export async function fetchUserDataItems(itemType: PortfolioItemType): Promise<ApiResponse<RawUserDataRecord[]>> {
  const path = {
    project:      "projects",
    experience:   "experience",
    education:    "education",
    certification: "certifications",
    skill:        "skills",
    social_link:  "social-links",
  }[itemType];

  const res = await apiClient.get(`${USER_DATA_URL}/user-data/${path}/`);
  return res.data;
}
