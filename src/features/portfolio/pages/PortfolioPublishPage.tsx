"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Check, Globe, Loader2, RefreshCw } from "lucide-react";
import { applyServerErrors, describeApiError } from "@/core/utils/applyServerErrors";
import { useDebounce } from "@/core/hooks/useDebounce";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { FieldError } from "@/shared/components/FieldError";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { FormSelect } from "@/shared/components/FormSelect";
import {
  useChangeTemplate,
  useDeletePortfolio,
  usePortfolio,
  usePublishPortfolio,
  useSlugAvailability,
  useTemplateGallery,
  useUnpublishPortfolio,
  useUpdatePortfolio,
} from "../hooks";
import { PORTFOLIO_BASE_PATH } from "../constants";
import { PublishSettingsFormSchema, type PublishSettingsFormValues } from "../types";

interface PortfolioPublishPageProps {
  instanceId: number;
}

type PendingAction = "unpublish" | "delete" | "change-template" | null;

export function PortfolioPublishPage({ instanceId }: PortfolioPublishPageProps) {
  const router = useRouter();
  const { data: detail, isLoading, isError, error } = usePortfolio(instanceId);

  const updatePortfolio = useUpdatePortfolio(instanceId);
  const publish = usePublishPortfolio(instanceId);
  const unpublish = useUnpublishPortfolio(instanceId);
  const changeTemplate = useChangeTemplate(instanceId);
  const deletePortfolio = useDeletePortfolio();
  const { data: templates = [] } = useTemplateGallery("All", "");

  const [pending, setPending] = useState<PendingAction>(null);
  const [nextTemplateId, setNextTemplateId] = useState<string>("");

  const form = useForm<PublishSettingsFormValues>({
    resolver: zodResolver(PublishSettingsFormSchema),
    defaultValues: { title: "", slug: "", custom_domain: "", meta_title: "", meta_description: "" },
  });

  useEffect(() => {
    if (!detail) return;
    form.reset({
      title:            detail.title,
      slug:             detail.slug,
      custom_domain:    detail.customDomain ?? "",
      meta_title:       detail.metaTitle,
      meta_description: detail.metaDescription,
    });
    setNextTemplateId(String(detail.templateId));
  }, [detail, form]);

  useEffect(() => {
    if (updatePortfolio.error) applyServerErrors(form, updatePortfolio.error);
  }, [updatePortfolio.error, form]);

  const slugValue = form.watch("slug");
  const debouncedSlug = useDebounce(slugValue, 400);
  const slugChanged = Boolean(detail) && debouncedSlug !== detail?.slug;
  const { data: slugAvailable, isFetching: slugChecking } = useSlugAvailability(
    debouncedSlug, instanceId, slugChanged,
  );

  if (isLoading) {
    return (
      <Page>
        <div className="skel" style={{ height: 56, width: 320 }} />
        <div className="skel" style={{ height: 240 }} />
        <div className="skel" style={{ height: 200 }} />
      </Page>
    );
  }

  if (isError || !detail) {
    return (
      <Page>
        <EmptyState
          icon={Globe}
          title="Portfolio not found"
          desc={describeApiError(error)}
          actionLabel="Back to my portfolios"
          onAction={() => router.push(PORTFOLIO_BASE_PATH)}
        />
      </Page>
    );
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const publicHref = `${base}/p/${detail.slug}/`;

  return (
    <Page>
      <button
        type="button"
        className="link-accent ds-body-sm"
        onClick={() => router.push(`${PORTFOLIO_BASE_PATH}/${instanceId}/builder`)}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <ArrowLeft size={14} /> Back to builder
      </button>

      <PageHead
        eyebrow="Portfolio"
        title="Publish and address"
        subtitle="Control where this portfolio lives and who can see it."
        action={<span className={`badge ${detail.statusBadge}`}>{detail.statusLabel}</span>}
      />

      {/* ── Status ─────────────────────────────────────────────────────────── */}
      <div className="card card--raised" style={{ padding: 22, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div className="ds-display-sm" style={{ color: "var(--text-primary)" }}>
            {detail.status === "published" ? "This portfolio is live" : "This portfolio is not live"}
          </div>
          <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {detail.status === "published"
              ? "Anyone with the link can view it."
              : "Only you can see it until you publish."}
          </div>
          {detail.status === "published" && (
            <a className="link-accent ds-code" style={{ fontSize: 12, marginTop: 8, display: "inline-block" }} href={publicHref} target="_blank" rel="noreferrer">
              {publicHref}
            </a>
          )}
        </div>
        {detail.status === "published" ? (
          <button type="button" className="btn btn--secondary" onClick={() => setPending("unpublish")}>
            Unpublish
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--accent"
            disabled={publish.isPending}
            onClick={() =>
              publish.mutate(undefined, {
                onSuccess: () => toast.success("Portfolio published"),
                onError: (err) => toast.error("Could not publish", { description: describeApiError(err) }),
              })
            }
          >
            {publish.isPending ? "Publishing…" : "Publish now"}
          </button>
        )}
      </div>

      {/* ── Address + SEO ──────────────────────────────────────────────────── */}
      <form
        className="card"
        onSubmit={form.handleSubmit((values) =>
          updatePortfolio.mutate(values, {
            onSuccess: () => toast.success("Settings saved"),
            onError: (err) => toast.error("Could not save settings", { description: describeApiError(err) }),
          }),
        )}
      >
        <div className="card__header">
          <div style={{ font: "500 15px var(--font-sans)" }}>Address and search preview</div>
        </div>

        <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="field">
            <label className="label">Portfolio name</label>
            <input className="input" {...form.register("title")} />
            <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
              Only you see this — it is how the portfolio is labelled in your list.
            </div>
            <FieldError error={form.formState.errors.title} />
          </div>

          <div className="field">
            <label className="label">Public address</label>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <span
                className="ds-code"
                style={{
                  display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13,
                  background: "var(--bg-surface)", border: "0.5px solid var(--input-border)",
                  borderRight: "none", borderRadius: "var(--radius-input) 0 0 var(--radius-input)",
                  color: "var(--text-tertiary)", whiteSpace: "nowrap",
                }}
              >
                /p/
              </span>
              <input
                className="input"
                style={{ borderRadius: "0 var(--radius-input) var(--radius-input) 0", fontFamily: "var(--font-mono)", fontSize: 13 }}
                {...form.register("slug")}
              />
            </div>
            {slugChanged && (
              <div
                className="ds-caption"
                style={{
                  display: "flex", alignItems: "center", gap: 6, marginTop: 2,
                  color: slugChecking
                    ? "var(--text-tertiary)"
                    : slugAvailable ? "var(--status-success)" : "var(--status-error)",
                }}
              >
                {slugChecking ? <Loader2 size={12} className="spin" /> : slugAvailable ? <Check size={12} /> : null}
                {slugChecking ? "Checking…" : slugAvailable ? "Available" : "That address is already taken"}
              </div>
            )}
            <FieldError error={form.formState.errors.slug} />
          </div>

          <div className="field">
            <label className="label">Custom domain (optional)</label>
            <input
              className="input"
              style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
              placeholder="portfolio.yourdomain.com"
              {...form.register("custom_domain")}
            />
            <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
              Point a CNAME record at your Omnyvora address before saving a custom domain.
            </div>
            <FieldError error={form.formState.errors.custom_domain} />
          </div>

          <div className="field">
            <label className="label">Search/social title</label>
            <input className="input" placeholder={detail.title} {...form.register("meta_title")} />
            <FieldError error={form.formState.errors.meta_title} />
          </div>

          <div className="field">
            <label className="label">Search/social description</label>
            <textarea
              className="input textarea"
              rows={3}
              placeholder="A short summary shown by Google and when your link is shared."
              {...form.register("meta_description")}
            />
            <FieldError error={form.formState.errors.meta_description} />
          </div>
        </div>

        <div className="card__footer">
          <button type="button" className="btn btn--ghost" onClick={() => form.reset()}>Discard</button>
          <button type="submit" className="btn btn--accent" disabled={updatePortfolio.isPending}>
            {updatePortfolio.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      {/* ── Template ───────────────────────────────────────────────────────── */}
      <div className="card">
        <div className="card__header">
          <div style={{ font: "500 15px var(--font-sans)" }}>Template</div>
        </div>
        <div className="card__body" style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <FormSelect
              label="Current template"
              value={nextTemplateId}
              onChange={setNextTemplateId}
              options={templates.map((t) => ({ value: String(t.id), label: t.name }))}
              hint="Switching resets which sections are on to the new template's defaults. Your services are kept."
            />
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={nextTemplateId === String(detail.templateId) || changeTemplate.isPending}
            onClick={() => setPending("change-template")}
          >
            <RefreshCw size={14} style={{ marginRight: 6 }} />Change template
          </button>
        </div>
      </div>

      {/* ── Danger zone ────────────────────────────────────────────────────── */}
      <div className="card" style={{ borderColor: "var(--status-error)" }}>
        <div className="card__header" style={{ borderColor: "var(--status-error)" }}>
          <div style={{ font: "500 15px var(--font-sans)", color: "var(--status-error)" }}>Danger zone</div>
        </div>
        <div className="card__body" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ font: "500 13px var(--font-sans)", color: "var(--text-primary)" }}>Delete this portfolio</div>
            <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
              Removes this portfolio, its section setup and its services. My Data is untouched.
            </div>
          </div>
          <button type="button" className="btn btn--danger btn--sm" onClick={() => setPending("delete")}>
            Delete portfolio
          </button>
        </div>
      </div>

      <ConfirmModal
        config={
          pending === "unpublish"
            ? ({
                title: "Unpublish this portfolio?",
                body: "Your public address will stop working immediately. All of your content is kept, and you can publish again at any time.",
                confirmLabel: "Unpublish",
                tone: "warning",
              } satisfies ConfirmConfig)
            : pending === "change-template"
            ? ({
                title: "Change template?",
                body: "Which sections are on will reset to the new template's defaults, so any sections you turned off will need turning off again. Services you wrote for this portfolio are kept.",
                confirmLabel: "Change template",
                tone: "warning",
              } satisfies ConfirmConfig)
            : pending === "delete"
            ? ({
                title: "Delete this portfolio?",
                body: `"${detail.title}" and its setup will be removed, and its public address will stop working. The projects, experience and skills in My Data are not affected.`,
                confirmLabel: "Delete portfolio",
                tone: "danger",
                requireType: true,
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPending(null)}
        onConfirm={() => {
          const action = pending;
          setPending(null);
          if (action === "unpublish") {
            unpublish.mutate(undefined, {
              onSuccess: () => toast.success("Portfolio unpublished"),
              onError: (err) => toast.error("Could not unpublish", { description: describeApiError(err) }),
            });
          } else if (action === "change-template") {
            changeTemplate.mutate(Number(nextTemplateId), {
              onSuccess: () => toast.success("Template changed"),
              onError: (err) => toast.error("Could not change template", { description: describeApiError(err) }),
            });
          } else if (action === "delete") {
            deletePortfolio.mutate(instanceId, {
              onSuccess: () => { toast.success("Portfolio deleted"); router.push(PORTFOLIO_BASE_PATH); },
              onError: (err) => toast.error("Could not delete", { description: describeApiError(err) }),
            });
          }
        }}
      />
    </Page>
  );
}
