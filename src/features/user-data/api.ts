import apiClient from "@/core/api/axios";
import { resolveServiceUrl } from "@/core/api/services";
import type { ApiResponse } from "@/core/api/response";
import type {
  Certification,
  CertificationFormValues,
  CertificationOption,
  CreateSkillFormValues,
  CreateTechnologyFormValues,
  Education,
  EducationFormValues,
  Experience,
  ExperienceFormValues,
  Project,
  ProjectFormValues,
  ProjectImage,
  SkillCatalogEntry,
  SocialLink,
  SocialLinkFormValues,
  Technology,
  TechnologyCategory,
  UserSkill,
  UserTechnology,
} from "./types";

const USER_DATA_URL = resolveServiceUrl("userData");

export async function searchTechnologies(
  query: string,
  category?: TechnologyCategory,
): Promise<ApiResponse<Technology[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/taxonomy/technologies/`, {
    params: { q: query, category },
  });
  return res.data;
}

export async function searchSkills(query: string): Promise<ApiResponse<SkillCatalogEntry[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/taxonomy/skills/`, {
    params: { q: query },
  });
  return res.data;
}

// ── Technologies (proficiency-rated, category-grouped) ────────────────────────

export async function fetchTechnologies(): Promise<ApiResponse<UserTechnology[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/technologies/`);
  return res.data;
}

export async function createTechnology(
  payload: CreateTechnologyFormValues,
): Promise<ApiResponse<UserTechnology>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/technologies/`, payload);
  return res.data;
}

export async function updateTechnologyProficiency(
  userTechnologyId: number,
  proficiency: number,
): Promise<ApiResponse<UserTechnology>> {
  const res = await apiClient.patch(`${USER_DATA_URL}/user-data/technologies/${userTechnologyId}/`, { proficiency });
  return res.data;
}

export async function deleteTechnology(userTechnologyId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${USER_DATA_URL}/user-data/technologies/${userTechnologyId}/`);
  return res.data;
}

export async function reorderTechnologies(orderedIds: number[]): Promise<ApiResponse<UserTechnology[]>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/technologies/reorder/`, {
    ordered_ids: orderedIds,
  });
  return res.data;
}

// ── Skills (flat, no category) ─────────────────────────────────────────────

export async function fetchSkills(): Promise<ApiResponse<UserSkill[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/skills/`);
  return res.data;
}

export async function createSkill(
  payload: CreateSkillFormValues,
): Promise<ApiResponse<UserSkill>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/skills/`, payload);
  return res.data;
}

export async function updateSkillProficiency(
  userSkillId: number,
  proficiency: number,
): Promise<ApiResponse<UserSkill>> {
  const res = await apiClient.patch(`${USER_DATA_URL}/user-data/skills/${userSkillId}/`, { proficiency });
  return res.data;
}

export async function deleteSkill(userSkillId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${USER_DATA_URL}/user-data/skills/${userSkillId}/`);
  return res.data;
}

export async function reorderSkills(orderedIds: number[]): Promise<ApiResponse<UserSkill[]>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/skills/reorder/`, {
    ordered_ids: orderedIds,
  });
  return res.data;
}

// ── Projects ─────────────────────────────────────────────────────────────────

export async function fetchProjects(): Promise<ApiResponse<Project[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/projects/`);
  return res.data;
}

export async function createProject(payload: ProjectFormValues): Promise<ApiResponse<Project>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/projects/`, payload);
  return res.data;
}

export async function updateProject(projectId: number, payload: Partial<ProjectFormValues>): Promise<ApiResponse<Project>> {
  const res = await apiClient.patch(`${USER_DATA_URL}/user-data/projects/${projectId}/`, payload);
  return res.data;
}

export async function deleteProject(projectId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${USER_DATA_URL}/user-data/projects/${projectId}/`);
  return res.data;
}

export async function reorderProjects(orderedIds: number[]): Promise<ApiResponse<Project[]>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/projects/reorder/`, { ordered_ids: orderedIds });
  return res.data;
}

export async function addProjectImage(projectId: number, file: File, caption = ""): Promise<ApiResponse<ProjectImage>> {
  const form = new FormData();
  form.append("image", file);
  form.append("caption", caption);
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/projects/${projectId}/images/`, form, {
    headers: { "Content-Type": undefined },
  });
  return res.data;
}

export async function updateProjectImage(
  projectId: number, imageId: number, payload: { caption?: string; is_cover?: boolean },
): Promise<ApiResponse<ProjectImage>> {
  const res = await apiClient.patch(`${USER_DATA_URL}/user-data/projects/${projectId}/images/${imageId}/`, payload);
  return res.data;
}

export async function removeProjectImage(projectId: number, imageId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${USER_DATA_URL}/user-data/projects/${projectId}/images/${imageId}/`);
  return res.data;
}

export async function reorderProjectImages(projectId: number, orderedIds: number[]): Promise<ApiResponse<null>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/projects/${projectId}/images/reorder/`, { ordered_ids: orderedIds });
  return res.data;
}

// ── Experience ───────────────────────────────────────────────────────────────

export async function fetchExperiences(): Promise<ApiResponse<Experience[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/experience/`);
  return res.data;
}

export async function createExperience(payload: ExperienceFormValues): Promise<ApiResponse<Experience>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/experience/`, payload);
  return res.data;
}

export async function updateExperience(experienceId: number, payload: Partial<ExperienceFormValues>): Promise<ApiResponse<Experience>> {
  const res = await apiClient.patch(`${USER_DATA_URL}/user-data/experience/${experienceId}/`, payload);
  return res.data;
}

export async function deleteExperience(experienceId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${USER_DATA_URL}/user-data/experience/${experienceId}/`);
  return res.data;
}

export async function reorderExperiences(orderedIds: number[]): Promise<ApiResponse<Experience[]>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/experience/reorder/`, { ordered_ids: orderedIds });
  return res.data;
}

// ── Certifications ───────────────────────────────────────────────────────────

export async function fetchCertifications(): Promise<ApiResponse<Certification[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/certifications/`);
  return res.data;
}

export async function fetchCertificationOptions(): Promise<ApiResponse<CertificationOption[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/certifications/options/`);
  return res.data;
}

export async function createCertification(
  payload: CertificationFormValues & { image?: File | null },
): Promise<ApiResponse<Certification>> {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("issuer", payload.issuer);
  form.append("issue_date", payload.issue_date);
  if (payload.credential_url) form.append("credential_url", payload.credential_url);
  if (payload.image) form.append("image", payload.image);
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/certifications/`, form, {
    headers: { "Content-Type": undefined },
  });
  return res.data;
}

export async function updateCertification(
  certificationId: number, payload: Partial<CertificationFormValues> & { image?: File | null },
): Promise<ApiResponse<Certification>> {
  const form = new FormData();
  if (payload.title !== undefined) form.append("title", payload.title);
  if (payload.issuer !== undefined) form.append("issuer", payload.issuer);
  if (payload.issue_date !== undefined) form.append("issue_date", payload.issue_date);
  if (payload.credential_url !== undefined) form.append("credential_url", payload.credential_url);
  if (payload.image) form.append("image", payload.image);
  const res = await apiClient.patch(`${USER_DATA_URL}/user-data/certifications/${certificationId}/`, form, {
    headers: { "Content-Type": undefined },
  });
  return res.data;
}

export async function deleteCertification(certificationId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${USER_DATA_URL}/user-data/certifications/${certificationId}/`);
  return res.data;
}

export async function reorderCertifications(orderedIds: number[]): Promise<ApiResponse<Certification[]>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/certifications/reorder/`, { ordered_ids: orderedIds });
  return res.data;
}

// ── Education ────────────────────────────────────────────────────────────────

export async function fetchEducations(): Promise<ApiResponse<Education[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/education/`);
  return res.data;
}

export async function createEducation(payload: EducationFormValues): Promise<ApiResponse<Education>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/education/`, payload);
  return res.data;
}

export async function updateEducation(educationId: number, payload: Partial<EducationFormValues>): Promise<ApiResponse<Education>> {
  const res = await apiClient.patch(`${USER_DATA_URL}/user-data/education/${educationId}/`, payload);
  return res.data;
}

export async function deleteEducation(educationId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${USER_DATA_URL}/user-data/education/${educationId}/`);
  return res.data;
}

export async function reorderEducations(orderedIds: number[]): Promise<ApiResponse<Education[]>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/education/reorder/`, { ordered_ids: orderedIds });
  return res.data;
}

// ── Social links ─────────────────────────────────────────────────────────────

export async function fetchSocialLinks(): Promise<ApiResponse<SocialLink[]>> {
  const res = await apiClient.get(`${USER_DATA_URL}/user-data/social-links/`);
  return res.data;
}

export async function createSocialLink(payload: SocialLinkFormValues): Promise<ApiResponse<SocialLink>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/social-links/`, payload);
  return res.data;
}

export async function updateSocialLink(socialLinkId: number, payload: Partial<SocialLinkFormValues>): Promise<ApiResponse<SocialLink>> {
  const res = await apiClient.patch(`${USER_DATA_URL}/user-data/social-links/${socialLinkId}/`, payload);
  return res.data;
}

export async function deleteSocialLink(socialLinkId: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete(`${USER_DATA_URL}/user-data/social-links/${socialLinkId}/`);
  return res.data;
}

export async function reorderSocialLinks(orderedIds: number[]): Promise<ApiResponse<SocialLink[]>> {
  const res = await apiClient.post(`${USER_DATA_URL}/user-data/social-links/reorder/`, { ordered_ids: orderedIds });
  return res.data;
}
