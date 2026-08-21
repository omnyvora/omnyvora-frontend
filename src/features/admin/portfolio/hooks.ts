"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiRequestError, isApiSuccess } from "@/core/api/response";
import {
  adminToggleFeatured,
  adminUnpublishPortfolio,
  archiveAdminTemplate,
  createAdminTemplate,
  fetchAdminPortfolio,
  fetchAdminPortfolios,
  fetchAdminTemplate,
  fetchAdminTemplatePreview,
  fetchAdminTemplates,
  fetchPortfolioDashboard,
  setTemplateSections,
  updateAdminTemplate,
  uploadTemplateAsset,
  uploadTemplatePage,
} from "./api";
import {
  toAdminPortfolioDetailUI,
  toAdminPortfolioRowUI,
  toAdminTemplateDetailUI,
  toAdminTemplateRowUI,
} from "./transformers";
import type {
  TemplateCreateFormValues,
  TemplateMetadataFormValues,
  TemplatePageType,
} from "./types";

const TEMPLATES_KEY = ["admin", "portfolio", "templates"] as const;
const PORTFOLIOS_KEY = ["admin", "portfolio", "instances"] as const;

function templateKey(id: number) {
  return ["admin", "portfolio", "templates", id] as const;
}

// ── Templates ────────────────────────────────────────────────────────────────

export function useAdminTemplates(status: string, search: string) {
  return useQuery({
    queryKey: [...TEMPLATES_KEY, status, search],
    queryFn: async () => {
      const res = await fetchAdminTemplates(status, search);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toAdminTemplateRowUI);
    },
    staleTime: 30_000,
  });
}

export function useAdminTemplate(templateId: number | null) {
  return useQuery({
    queryKey: templateKey(templateId ?? 0),
    queryFn: async () => {
      const res = await fetchAdminTemplate(templateId as number);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toAdminTemplateDetailUI(res.data);
    },
    enabled: templateId !== null,
  });
}

export function useAdminTemplatePreview(templateId: number | null, pageType: TemplatePageType, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "portfolio", "templates", templateId, "preview", pageType],
    queryFn: async () => {
      const res = await fetchAdminTemplatePreview(templateId as number, pageType);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.html;
    },
    enabled: templateId !== null && enabled,
    retry: false,
  });
}

export function useCreateAdminTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { values: TemplateCreateFormValues; thumbnail: File | null }) => {
      const res = await createAdminTemplate(args.values, args.thumbnail);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toAdminTemplateDetailUI(res.data);
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: TEMPLATES_KEY }); },
  });
}

function useTemplateMutation<TArgs>(
  templateId: number,
  fn: (args: TArgs) => Promise<unknown>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: templateKey(templateId) });
      void qc.invalidateQueries({ queryKey: TEMPLATES_KEY });
      void qc.invalidateQueries({ queryKey: ["admin", "portfolio", "templates", templateId, "preview"] });
    },
  });
}

export function useUpdateAdminTemplate(templateId: number) {
  return useTemplateMutation(
    templateId,
    async (args: { values: Partial<TemplateMetadataFormValues>; thumbnail: File | null }) => {
      const res = await updateAdminTemplate(templateId, args.values, args.thumbnail);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toAdminTemplateDetailUI(res.data);
    },
  );
}

export function useArchiveAdminTemplate(templateId: number) {
  return useTemplateMutation(templateId, async () => {
    const res = await archiveAdminTemplate(templateId);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return toAdminTemplateDetailUI(res.data);
  });
}

export function useUploadTemplatePage(templateId: number) {
  return useTemplateMutation(templateId, async (args: { pageType: TemplatePageType; file: File }) => {
    const res = await uploadTemplatePage(templateId, args.pageType, args.file);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return res.data;
  });
}

export function useUploadTemplateAsset(templateId: number) {
  return useTemplateMutation(templateId, async (args: { file: File; relativePath: string }) => {
    const res = await uploadTemplateAsset(templateId, args.file, args.relativePath);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return res.data;
  });
}

export function useSetTemplateSections(templateId: number) {
  return useTemplateMutation(templateId, async (sections: { section_key: string; is_required: boolean }[]) => {
    const res = await setTemplateSections(templateId, sections);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return toAdminTemplateDetailUI(res.data);
  });
}

// ── Oversight ────────────────────────────────────────────────────────────────

export function useAdminPortfolios(status: string, search: string) {
  return useQuery({
    queryKey: [...PORTFOLIOS_KEY, status, search],
    queryFn: async () => {
      const res = await fetchAdminPortfolios(status, search);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toAdminPortfolioRowUI);
    },
    staleTime: 30_000,
  });
}

export function useAdminPortfolio(instanceId: number | null) {
  return useQuery({
    queryKey: ["admin", "portfolio", "instances", instanceId],
    queryFn: async () => {
      const res = await fetchAdminPortfolio(instanceId as number);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toAdminPortfolioDetailUI(res.data);
    },
    enabled: instanceId !== null,
  });
}

function usePortfolioOversightMutation<TArgs>(fn: (args: TArgs) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PORTFOLIOS_KEY });
      void qc.invalidateQueries({ queryKey: ["admin", "portfolio", "dashboard"] });
    },
  });
}

export function useAdminUnpublishPortfolio() {
  return usePortfolioOversightMutation(async (args: { instanceId: number; reason: string }) => {
    const res = await adminUnpublishPortfolio(args.instanceId, args.reason);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return toAdminPortfolioDetailUI(res.data);
  });
}

export function useAdminToggleFeatured() {
  return usePortfolioOversightMutation(async (instanceId: number) => {
    const res = await adminToggleFeatured(instanceId);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return toAdminPortfolioDetailUI(res.data);
  });
}

export function usePortfolioDashboard() {
  return useQuery({
    queryKey: ["admin", "portfolio", "dashboard"],
    queryFn: async () => {
      const res = await fetchPortfolioDashboard();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data;
    },
    staleTime: 30_000,
  });
}
