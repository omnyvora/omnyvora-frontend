"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiRequestError, isApiSuccess } from "@/core/api/response";
import {
  changePortfolioTemplate,
  checkSlugAvailability,
  createPortfolio,
  createPortfolioService,
  deletePortfolio,
  deletePortfolioService,
  fetchPortfolio,
  fetchPortfolioPreview,
  fetchPortfolios,
  fetchTemplateDetail,
  fetchTemplateGallery,
  fetchTemplatePreview,
  fetchUserDataItems,
  publishPortfolio,
  reorderPortfolioServices,
  setItemVisibility,
  setSectionStates,
  unpublishPortfolio,
  updatePortfolio,
  updatePortfolioService,
  uploadOgImage,
} from "./api";
import {
  toPortfolioDetailUI,
  toPortfolioListItemUI,
  toSelectableItems,
  toTemplateCardUI,
} from "./transformers";
import type {
  PortfolioItemType,
  PortfolioServiceFormValues,
  PublishSettingsFormValues,
} from "./types";

const PORTFOLIOS_KEY = ["portfolio", "instances"] as const;

function portfolioKey(id: number) {
  return ["portfolio", "instances", id] as const;
}

// ── Templates ────────────────────────────────────────────────────────────────

export function useTemplateGallery(category: string, search: string) {
  return useQuery({
    queryKey: ["portfolio", "templates", category, search],
    queryFn: async () => {
      const res = await fetchTemplateGallery(category, search);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toTemplateCardUI);
    },
    staleTime: 60_000,
  });
}

export function useTemplateDetail(slug: string | null) {
  return useQuery({
    queryKey: ["portfolio", "templates", "detail", slug],
    queryFn: async () => {
      const res = await fetchTemplateDetail(slug as string);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data;
    },
    enabled: slug !== null,
  });
}

export function useTemplatePreview(slug: string | null) {
  return useQuery({
    queryKey: ["portfolio", "templates", "preview", slug],
    queryFn: async () => {
      const res = await fetchTemplatePreview(slug as string);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.html;
    },
    enabled: slug !== null,
  });
}

// ── Instances ────────────────────────────────────────────────────────────────

export function usePortfolios() {
  return useQuery({
    queryKey: PORTFOLIOS_KEY,
    queryFn: async () => {
      const res = await fetchPortfolios();
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.map(toPortfolioListItemUI);
    },
    staleTime: 30_000,
  });
}

export function usePortfolio(instanceId: number | null) {
  return useQuery({
    queryKey: portfolioKey(instanceId ?? 0),
    queryFn: async () => {
      const res = await fetchPortfolio(instanceId as number);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toPortfolioDetailUI(res.data);
    },
    enabled: instanceId !== null,
  });
}

export function usePortfolioPreview(instanceId: number | null, enabled = true) {
  return useQuery({
    queryKey: ["portfolio", "instances", instanceId, "preview"],
    queryFn: async () => {
      const res = await fetchPortfolioPreview(instanceId as number);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.html;
    },
    enabled: instanceId !== null && enabled,
  });
}

export function useCreatePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { template_id: number; title: string }) => {
      const res = await createPortfolio(payload);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toPortfolioDetailUI(res.data);
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: PORTFOLIOS_KEY }); },
  });
}

export function useUpdatePortfolio(instanceId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PublishSettingsFormValues>) => {
      const res = await updatePortfolio(instanceId, payload);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toPortfolioDetailUI(res.data);
    },
    onSuccess: (detail) => {
      qc.setQueryData(portfolioKey(instanceId), detail);
      void qc.invalidateQueries({ queryKey: PORTFOLIOS_KEY });
    },
  });
}

export function useUploadOgImage(instanceId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await uploadOgImage(instanceId, file);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toPortfolioDetailUI(res.data);
    },
    onSuccess: (detail) => { qc.setQueryData(portfolioKey(instanceId), detail); },
  });
}

export function useDeletePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (instanceId: number) => {
      const res = await deletePortfolio(instanceId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: PORTFOLIOS_KEY }); },
  });
}

function useInstanceMutation<TArgs>(
  instanceId: number,
  fn: (args: TArgs) => Promise<{ detail: ReturnType<typeof toPortfolioDetailUI> } | void>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (result) => {
      if (result && "detail" in result) qc.setQueryData(portfolioKey(instanceId), result.detail);
      // The rendered preview is derived from all of this — always refetch it.
      void qc.invalidateQueries({ queryKey: ["portfolio", "instances", instanceId, "preview"] });
      void qc.invalidateQueries({ queryKey: PORTFOLIOS_KEY });
    },
  });
}

export function useSetSectionStates(instanceId: number) {
  return useInstanceMutation(instanceId, async (states: { section_id: number; is_enabled: boolean }[]) => {
    const res = await setSectionStates(instanceId, states);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return { detail: toPortfolioDetailUI(res.data) };
  });
}

export function useSetItemVisibility(instanceId: number) {
  return useInstanceMutation(
    instanceId,
    async (args: { itemType: PortfolioItemType; items: { item_id: string; is_visible: boolean }[] }) => {
      const res = await setItemVisibility(instanceId, args.itemType, args.items);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return { detail: toPortfolioDetailUI(res.data) };
    },
  );
}

export function useCreatePortfolioService(instanceId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PortfolioServiceFormValues) => {
      const res = await createPortfolioService(instanceId, payload);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: portfolioKey(instanceId) });
      void qc.invalidateQueries({ queryKey: ["portfolio", "instances", instanceId, "preview"] });
    },
  });
}

export function useUpdatePortfolioService(instanceId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { serviceId: number; values: Partial<PortfolioServiceFormValues> }) => {
      const res = await updatePortfolioService(instanceId, args.serviceId, args.values);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: portfolioKey(instanceId) });
      void qc.invalidateQueries({ queryKey: ["portfolio", "instances", instanceId, "preview"] });
    },
  });
}

export function useDeletePortfolioService(instanceId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (serviceId: number) => {
      const res = await deletePortfolioService(instanceId, serviceId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: portfolioKey(instanceId) });
      void qc.invalidateQueries({ queryKey: ["portfolio", "instances", instanceId, "preview"] });
    },
  });
}

export function useReorderPortfolioServices(instanceId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      const res = await reorderPortfolioServices(instanceId, orderedIds);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: portfolioKey(instanceId) });
      void qc.invalidateQueries({ queryKey: ["portfolio", "instances", instanceId, "preview"] });
    },
  });
}

export function useSlugAvailability(slug: string, excludeInstanceId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["portfolio", "slug-available", slug, excludeInstanceId],
    queryFn: async () => {
      const res = await checkSlugAvailability(slug, excludeInstanceId);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return res.data.available;
    },
    enabled: enabled && slug.length >= 3,
    staleTime: 10_000,
  });
}

export function useChangeTemplate(instanceId: number) {
  return useInstanceMutation(instanceId, async (templateId: number) => {
    const res = await changePortfolioTemplate(instanceId, templateId);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return { detail: toPortfolioDetailUI(res.data) };
  });
}

export function usePublishPortfolio(instanceId: number) {
  return useInstanceMutation(instanceId, async () => {
    const res = await publishPortfolio(instanceId);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return { detail: toPortfolioDetailUI(res.data) };
  });
}

export function useUnpublishPortfolio(instanceId: number) {
  return useInstanceMutation(instanceId, async () => {
    const res = await unpublishPortfolio(instanceId);
    if (!isApiSuccess(res)) throw new ApiRequestError(res);
    return { detail: toPortfolioDetailUI(res.data) };
  });
}

// ── "My Data" item lists ─────────────────────────────────────────────────────

export function useSelectableItems(itemType: PortfolioItemType, enabled: boolean) {
  return useQuery({
    queryKey: ["portfolio", "selectable-items", itemType],
    queryFn: async () => {
      const res = await fetchUserDataItems(itemType);
      if (!isApiSuccess(res)) throw new ApiRequestError(res);
      return toSelectableItems(itemType, res.data);
    },
    enabled,
    staleTime: 60_000,
  });
}
