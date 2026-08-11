"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiRequestError, isApiSuccess } from "@/core/api/response";
import {
  addProjectImage,
  createCertification,
  createEducation,
  createExperience,
  createProject,
  createSkill,
  createSocialLink,
  createTechnology,
  deleteCertification,
  deleteEducation,
  deleteExperience,
  deleteProject,
  deleteSkill,
  deleteSocialLink,
  deleteTechnology,
  fetchCertificationOptions,
  fetchCertifications,
  fetchEducations,
  fetchExperiences,
  fetchProjects,
  fetchSkills,
  fetchSocialLinks,
  fetchTechnologies,
  removeProjectImage,
  reorderCertifications,
  reorderEducations,
  reorderExperiences,
  reorderProjectImages,
  reorderProjects,
  reorderSkills,
  reorderSocialLinks,
  reorderTechnologies,
  searchSkills,
  searchTechnologies,
  updateCertification,
  updateEducation,
  updateExperience,
  updateProject,
  updateProjectImage,
  updateSkillProficiency,
  updateSocialLink,
  updateTechnologyProficiency,
} from "./api";
import {
  toCertificationUI,
  toEducationUI,
  toExperienceUI,
  toProjectImageUI,
  toProjectUI,
  toSocialLinkUI,
  toUserSkillUI,
  toUserTechnologyUI,
  type CertificationUI,
  type EducationUI,
  type ExperienceUI,
  type ProjectUI,
  type SocialLinkUI,
  type UserSkillUI,
  type UserTechnologyUI,
} from "./transformers";
import type {
  CertificationFormValues,
  CreateSkillFormValues,
  CreateTechnologyFormValues,
  EducationFormValues,
  ExperienceFormValues,
  ProjectFormValues,
  SocialLinkFormValues,
  TechnologyCategory,
} from "./types";

// ── Technologies (proficiency-rated, category-grouped) ────────────────────────

const TECHNOLOGIES_QUERY_KEY = ["user-data", "technologies"] as const;

export function useTechnologies() {
  return useQuery({
    queryKey: TECHNOLOGIES_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchTechnologies();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toUserTechnologyUI);
    },
  });
}

// Matches the backend's 60s search cache — repeated/backtracked keystrokes for the
// same query resolve from React Query's cache instead of round-tripping again.
const CATALOG_SEARCH_STALE_TIME_MS = 60_000;

export function useTechnologySearch(query: string, category?: TechnologyCategory) {
  return useQuery({
    queryKey: ["user-data", "technology-search", query, category] as const,
    queryFn: async () => {
      const res = await searchTechnologies(query, category);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data;
    },
    enabled: query.trim().length > 0,
    staleTime: CATALOG_SEARCH_STALE_TIME_MS,
  });
}

export function useCreateTechnology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateTechnologyFormValues) => {
      const res = await createTechnology(values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toUserTechnologyUI(res.data);
    },
    onSuccess: (technology) => {
      qc.setQueryData<UserTechnologyUI[]>(TECHNOLOGIES_QUERY_KEY, (prev) => [...(prev ?? []), technology]);
    },
  });
}

export function useUpdateTechnologyProficiency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userTechnologyId, proficiency }: { userTechnologyId: number; proficiency: number }) => {
      const res = await updateTechnologyProficiency(userTechnologyId, proficiency);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toUserTechnologyUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData<UserTechnologyUI[]>(TECHNOLOGIES_QUERY_KEY, (prev) =>
        (prev ?? []).map((t) => (t.id === updated.id ? updated : t)),
      );
    },
  });
}

export function useDeleteTechnology() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userTechnologyId: number) => {
      const res = await deleteTechnology(userTechnologyId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return userTechnologyId;
    },
    onSuccess: (userTechnologyId) => {
      qc.setQueryData<UserTechnologyUI[]>(TECHNOLOGIES_QUERY_KEY, (prev) => (prev ?? []).filter((t) => t.id !== userTechnologyId));
    },
  });
}

export function useReorderTechnologies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      // Optimistic: drag-reorder must feel instant, not wait on a round trip
      const previous = qc.getQueryData<UserTechnologyUI[]>(TECHNOLOGIES_QUERY_KEY);
      const byId = new Map((previous ?? []).map((t) => [t.id, t]));
      qc.setQueryData<UserTechnologyUI[]>(
        TECHNOLOGIES_QUERY_KEY,
        orderedIds.map((id, i) => ({ ...byId.get(id)!, displayOrder: i })),
      );

      const res = await reorderTechnologies(orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toUserTechnologyUI);
    },
    onSuccess: (technologies) => {
      qc.setQueryData(TECHNOLOGIES_QUERY_KEY, technologies);
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: TECHNOLOGIES_QUERY_KEY });
    },
  });
}

// ── Skills (flat, no category) ─────────────────────────────────────────────

const SKILLS_QUERY_KEY = ["user-data", "skills"] as const;

export function useSkills() {
  return useQuery({
    queryKey: SKILLS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchSkills();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toUserSkillUI);
    },
  });
}

export function useSkillSearch(query: string) {
  return useQuery({
    queryKey: ["user-data", "skill-search", query] as const,
    queryFn: async () => {
      const res = await searchSkills(query);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data;
    },
    enabled: query.trim().length > 0,
    staleTime: CATALOG_SEARCH_STALE_TIME_MS,
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateSkillFormValues) => {
      const res = await createSkill(values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toUserSkillUI(res.data);
    },
    onSuccess: (skill) => {
      qc.setQueryData<UserSkillUI[]>(SKILLS_QUERY_KEY, (prev) => [...(prev ?? []), skill]);
    },
  });
}

export function useUpdateSkillProficiency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userSkillId, proficiency }: { userSkillId: number; proficiency: number }) => {
      const res = await updateSkillProficiency(userSkillId, proficiency);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toUserSkillUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData<UserSkillUI[]>(SKILLS_QUERY_KEY, (prev) =>
        (prev ?? []).map((s) => (s.id === updated.id ? updated : s)),
      );
    },
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userSkillId: number) => {
      const res = await deleteSkill(userSkillId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return userSkillId;
    },
    onSuccess: (userSkillId) => {
      qc.setQueryData<UserSkillUI[]>(SKILLS_QUERY_KEY, (prev) => (prev ?? []).filter((s) => s.id !== userSkillId));
    },
  });
}

export function useReorderSkills() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      // Optimistic: drag-reorder must feel instant, not wait on a round trip
      const previous = qc.getQueryData<UserSkillUI[]>(SKILLS_QUERY_KEY);
      const byId = new Map((previous ?? []).map((s) => [s.id, s]));
      qc.setQueryData<UserSkillUI[]>(
        SKILLS_QUERY_KEY,
        orderedIds.map((id, i) => ({ ...byId.get(id)!, displayOrder: i })),
      );

      const res = await reorderSkills(orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toUserSkillUI);
    },
    onSuccess: (skills) => {
      qc.setQueryData(SKILLS_QUERY_KEY, skills);
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
    },
  });
}

// ── Projects ─────────────────────────────────────────────────────────────────

const PROJECTS_QUERY_KEY = ["user-data", "projects"] as const;

export function useProjects() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchProjects();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toProjectUI);
    },
  });
}

// Project skill_names/technology_names writes auto-sync the Skills/Technologies
// rollup on the backend — their caches must be invalidated alongside the project's.
function invalidateSkillAndTechnologyRollups(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
  qc.invalidateQueries({ queryKey: TECHNOLOGIES_QUERY_KEY });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const res = await createProject(values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toProjectUI(res.data);
    },
    onSuccess: (project) => {
      qc.setQueryData<ProjectUI[]>(PROJECTS_QUERY_KEY, (prev) => [...(prev ?? []), project]);
      invalidateSkillAndTechnologyRollups(qc);
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, values }: { projectId: number; values: Partial<ProjectFormValues> }) => {
      const res = await updateProject(projectId, values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toProjectUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData<ProjectUI[]>(PROJECTS_QUERY_KEY, (prev) => (prev ?? []).map((p) => (p.id === updated.id ? updated : p)));
      invalidateSkillAndTechnologyRollups(qc);
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: number) => {
      const res = await deleteProject(projectId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.setQueryData<ProjectUI[]>(PROJECTS_QUERY_KEY, (prev) => (prev ?? []).filter((p) => p.id !== projectId));
      invalidateSkillAndTechnologyRollups(qc);
    },
  });
}

export function useReorderProjects() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      const previous = qc.getQueryData<ProjectUI[]>(PROJECTS_QUERY_KEY);
      const byId = new Map((previous ?? []).map((p) => [p.id, p]));
      qc.setQueryData<ProjectUI[]>(PROJECTS_QUERY_KEY, orderedIds.map((id, i) => ({ ...byId.get(id)!, displayOrder: i })));

      const res = await reorderProjects(orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toProjectUI);
    },
    onSuccess: (projects) => qc.setQueryData(PROJECTS_QUERY_KEY, projects),
    onError: () => qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY }),
  });
}

// Image sub-resource mutations refetch the projects list on success rather than
// hand-patching nested arrays — cover-swap is server truth (only one image can
// be cover) and not worth reproducing client-side for occasional, non-drag edits.
export function useAddProjectImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, file, caption }: { projectId: number; file: File; caption?: string }) => {
      const res = await addProjectImage(projectId, file, caption);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toProjectImageUI(res.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY }),
  });
}

export function useUpdateProjectImageCaption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, imageId, caption }: { projectId: number; imageId: number; caption: string }) => {
      const res = await updateProjectImage(projectId, imageId, { caption });
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toProjectImageUI(res.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY }),
  });
}

export function useSetProjectCoverImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, imageId }: { projectId: number; imageId: number }) => {
      const res = await updateProjectImage(projectId, imageId, { is_cover: true });
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toProjectImageUI(res.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY }),
  });
}

export function useRemoveProjectImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, imageId }: { projectId: number; imageId: number }) => {
      const res = await removeProjectImage(projectId, imageId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY }),
  });
}

export function useReorderProjectImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, orderedIds }: { projectId: number; orderedIds: number[] }) => {
      const res = await reorderProjectImages(projectId, orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY }),
  });
}

// ── Experience ───────────────────────────────────────────────────────────────

const EXPERIENCE_QUERY_KEY = ["user-data", "experience"] as const;

export function useExperiences() {
  return useQuery({
    queryKey: EXPERIENCE_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchExperiences();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toExperienceUI);
    },
  });
}

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: ExperienceFormValues) => {
      const res = await createExperience(values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toExperienceUI(res.data);
    },
    onSuccess: (experience) => {
      qc.setQueryData<ExperienceUI[]>(EXPERIENCE_QUERY_KEY, (prev) => [...(prev ?? []), experience]);
      invalidateSkillAndTechnologyRollups(qc);
    },
  });
}

export function useUpdateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ experienceId, values }: { experienceId: number; values: Partial<ExperienceFormValues> }) => {
      const res = await updateExperience(experienceId, values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toExperienceUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData<ExperienceUI[]>(EXPERIENCE_QUERY_KEY, (prev) => (prev ?? []).map((e) => (e.id === updated.id ? updated : e)));
      invalidateSkillAndTechnologyRollups(qc);
    },
  });
}

export function useDeleteExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (experienceId: number) => {
      const res = await deleteExperience(experienceId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return experienceId;
    },
    onSuccess: (experienceId) => {
      qc.setQueryData<ExperienceUI[]>(EXPERIENCE_QUERY_KEY, (prev) => (prev ?? []).filter((e) => e.id !== experienceId));
      invalidateSkillAndTechnologyRollups(qc);
    },
  });
}

export function useReorderExperiences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      const previous = qc.getQueryData<ExperienceUI[]>(EXPERIENCE_QUERY_KEY);
      const byId = new Map((previous ?? []).map((e) => [e.id, e]));
      qc.setQueryData<ExperienceUI[]>(EXPERIENCE_QUERY_KEY, orderedIds.map((id, i) => ({ ...byId.get(id)!, displayOrder: i })));

      const res = await reorderExperiences(orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toExperienceUI);
    },
    onSuccess: (experiences) => qc.setQueryData(EXPERIENCE_QUERY_KEY, experiences),
    onError: () => qc.invalidateQueries({ queryKey: EXPERIENCE_QUERY_KEY }),
  });
}

// ── Certifications ───────────────────────────────────────────────────────────

const CERTIFICATIONS_QUERY_KEY = ["user-data", "certifications"] as const;

export function useCertifications() {
  return useQuery({
    queryKey: CERTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchCertifications();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toCertificationUI);
    },
  });
}

export function useCertificationOptions() {
  return useQuery({
    queryKey: ["user-data", "certification-options"] as const,
    queryFn: async () => {
      const res = await fetchCertificationOptions();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data;
    },
  });
}

export function useCreateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: CertificationFormValues & { image?: File | null }) => {
      const res = await createCertification(values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toCertificationUI(res.data);
    },
    onSuccess: (certification) => {
      qc.setQueryData<CertificationUI[]>(CERTIFICATIONS_QUERY_KEY, (prev) => [...(prev ?? []), certification]);
    },
  });
}

export function useUpdateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      { certificationId, values }: { certificationId: number; values: Partial<CertificationFormValues> & { image?: File | null } },
    ) => {
      const res = await updateCertification(certificationId, values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toCertificationUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData<CertificationUI[]>(CERTIFICATIONS_QUERY_KEY, (prev) => (prev ?? []).map((c) => (c.id === updated.id ? updated : c)));
    },
  });
}

export function useDeleteCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (certificationId: number) => {
      const res = await deleteCertification(certificationId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return certificationId;
    },
    onSuccess: (certificationId) => {
      qc.setQueryData<CertificationUI[]>(CERTIFICATIONS_QUERY_KEY, (prev) => (prev ?? []).filter((c) => c.id !== certificationId));
    },
  });
}

export function useReorderCertifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      const previous = qc.getQueryData<CertificationUI[]>(CERTIFICATIONS_QUERY_KEY);
      const byId = new Map((previous ?? []).map((c) => [c.id, c]));
      qc.setQueryData<CertificationUI[]>(CERTIFICATIONS_QUERY_KEY, orderedIds.map((id, i) => ({ ...byId.get(id)!, displayOrder: i })));

      const res = await reorderCertifications(orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toCertificationUI);
    },
    onSuccess: (certifications) => qc.setQueryData(CERTIFICATIONS_QUERY_KEY, certifications),
    onError: () => qc.invalidateQueries({ queryKey: CERTIFICATIONS_QUERY_KEY }),
  });
}

// ── Education ────────────────────────────────────────────────────────────────

const EDUCATION_QUERY_KEY = ["user-data", "education"] as const;

export function useEducations() {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchEducations();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toEducationUI);
    },
  });
}

export function useCreateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: EducationFormValues) => {
      const res = await createEducation(values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toEducationUI(res.data);
    },
    onSuccess: (education) => {
      qc.setQueryData<EducationUI[]>(EDUCATION_QUERY_KEY, (prev) => [...(prev ?? []), education]);
    },
  });
}

export function useUpdateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ educationId, values }: { educationId: number; values: Partial<EducationFormValues> }) => {
      const res = await updateEducation(educationId, values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toEducationUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData<EducationUI[]>(EDUCATION_QUERY_KEY, (prev) => (prev ?? []).map((e) => (e.id === updated.id ? updated : e)));
    },
  });
}

export function useDeleteEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (educationId: number) => {
      const res = await deleteEducation(educationId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return educationId;
    },
    onSuccess: (educationId) => {
      qc.setQueryData<EducationUI[]>(EDUCATION_QUERY_KEY, (prev) => (prev ?? []).filter((e) => e.id !== educationId));
    },
  });
}

export function useReorderEducations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      const previous = qc.getQueryData<EducationUI[]>(EDUCATION_QUERY_KEY);
      const byId = new Map((previous ?? []).map((e) => [e.id, e]));
      qc.setQueryData<EducationUI[]>(EDUCATION_QUERY_KEY, orderedIds.map((id, i) => ({ ...byId.get(id)!, displayOrder: i })));

      const res = await reorderEducations(orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toEducationUI);
    },
    onSuccess: (educations) => qc.setQueryData(EDUCATION_QUERY_KEY, educations),
    onError: () => qc.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY }),
  });
}

// ── Social links ─────────────────────────────────────────────────────────────

const SOCIAL_LINKS_QUERY_KEY = ["user-data", "social-links"] as const;

export function useSocialLinks() {
  return useQuery({
    queryKey: SOCIAL_LINKS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchSocialLinks();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toSocialLinkUI);
    },
  });
}

export function useCreateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: SocialLinkFormValues) => {
      const res = await createSocialLink(values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toSocialLinkUI(res.data);
    },
    onSuccess: (link) => {
      qc.setQueryData<SocialLinkUI[]>(SOCIAL_LINKS_QUERY_KEY, (prev) => [...(prev ?? []), link]);
    },
  });
}

export function useUpdateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ socialLinkId, values }: { socialLinkId: number; values: Partial<SocialLinkFormValues> }) => {
      const res = await updateSocialLink(socialLinkId, values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toSocialLinkUI(res.data);
    },
    onSuccess: (updated) => {
      qc.setQueryData<SocialLinkUI[]>(SOCIAL_LINKS_QUERY_KEY, (prev) => (prev ?? []).map((s) => (s.id === updated.id ? updated : s)));
    },
  });
}

export function useDeleteSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (socialLinkId: number) => {
      const res = await deleteSocialLink(socialLinkId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return socialLinkId;
    },
    onSuccess: (socialLinkId) => {
      qc.setQueryData<SocialLinkUI[]>(SOCIAL_LINKS_QUERY_KEY, (prev) => (prev ?? []).filter((s) => s.id !== socialLinkId));
    },
  });
}

export function useReorderSocialLinks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      const previous = qc.getQueryData<SocialLinkUI[]>(SOCIAL_LINKS_QUERY_KEY);
      const byId = new Map((previous ?? []).map((s) => [s.id, s]));
      qc.setQueryData<SocialLinkUI[]>(SOCIAL_LINKS_QUERY_KEY, orderedIds.map((id, i) => ({ ...byId.get(id)!, displayOrder: i })));

      const res = await reorderSocialLinks(orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toSocialLinkUI);
    },
    onSuccess: (links) => qc.setQueryData(SOCIAL_LINKS_QUERY_KEY, links),
    onError: () => qc.invalidateQueries({ queryKey: SOCIAL_LINKS_QUERY_KEY }),
  });
}
