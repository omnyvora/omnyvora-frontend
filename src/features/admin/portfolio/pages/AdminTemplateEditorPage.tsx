"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, Check, FileCode2, LayoutGrid, Lock, Upload } from "lucide-react";
import { applyServerErrors, describeApiError } from "@/core/utils/applyServerErrors";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { FieldError } from "@/shared/components/FieldError";
import { FormSelect } from "@/shared/components/FormSelect";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { ApiRequestError } from "@/core/api/response";
import {
  useAdminTemplate,
  useAdminTemplatePreview,
  useArchiveAdminTemplate,
  useSetTemplateSections,
  useUpdateAdminTemplate,
  useUploadTemplateAsset,
  useUploadTemplatePage,
} from "../hooks";
import { ADMIN_PORTFOLIO_BASE_PATH } from "../constants";
import {
  SECTION_KEYS,
  TEMPLATE_STATUSES,
  TemplateMetadataFormSchema,
  type TemplateMetadataFormValues,
  type TemplatePageType,
} from "../types";

interface AdminTemplateEditorPageProps {
  templateId: number;
}

// The backend blocks structural edits once portfolios use a template — surface
// that as a banner instead of letting the admin discover it through a failed save.
function InUseBanner({ usageCount }: { usageCount: number }) {
  return (
    <div
      className="card"
      style={{ padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start", background: "var(--bg-surface)" }}
    >
      <AlertTriangle size={17} style={{ color: "var(--status-warning)", flex: "none", marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ font: "500 13px var(--font-sans)", color: "var(--text-primary)" }}>
          {usageCount} portfolio{usageCount === 1 ? "" : "s"} already use this template
        </div>
        <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 3 }}>
          Name, description, category, thumbnail and status can still be changed. Pages, assets and sections are
          locked — create a new template instead so live portfolios keep working.
        </div>
      </div>
    </div>
  );
}

function UploadRow({
  title,
  description,
  accept,
  buttonLabel,
  disabled,
  isUploading,
  onFile,
  extra,
}: {
  title:       string;
  description: string;
  accept:      string;
  buttonLabel: string;
  disabled:    boolean;
  isUploading: boolean;
  onFile:      (file: File) => void;
  extra?:      React.ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: 14,
        borderRadius: "var(--radius-card)", border: "0.5px dashed var(--border-strong)",
        background: "var(--bg-surface)", opacity: disabled ? 0.55 : 1,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ds-body-sm" style={{ color: "var(--text-primary)" }}>{title}</div>
        <div className="ds-caption" style={{ color: "var(--text-tertiary)", marginTop: 2 }}>{description}</div>
        {extra}
      </div>
      <input
        ref={input}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="btn btn--secondary btn--sm"
        disabled={disabled || isUploading}
        onClick={() => input.current?.click()}
      >
        <Upload size={14} style={{ marginRight: 6 }} />
        {isUploading ? "Uploading…" : buttonLabel}
      </button>
    </div>
  );
}

export function AdminTemplateEditorPage({ templateId }: AdminTemplateEditorPageProps) {
  const router = useRouter();
  const { data: template, isLoading, isError, error } = useAdminTemplate(templateId);

  const updateTemplate = useUpdateAdminTemplate(templateId);
  const archiveTemplate = useArchiveAdminTemplate(templateId);
  const uploadPage = useUploadTemplatePage(templateId);
  const uploadAsset = useUploadTemplateAsset(templateId);
  const setSections = useSetTemplateSections(templateId);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [assetPath, setAssetPath] = useState("");
  const [pageType, setPageType] = useState<TemplatePageType>("main");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: previewHtml, isError: previewFailed, error: previewError } =
    useAdminTemplatePreview(templateId, "main", previewOpen);

  const form = useForm<TemplateMetadataFormValues>({
    resolver: zodResolver(TemplateMetadataFormSchema),
    defaultValues: { name: "", description: "", category: "", status: "draft" },
  });

  useEffect(() => {
    if (!template) return;
    form.reset({
      name: template.name, description: template.description,
      category: template.category, status: template.status,
    });
  }, [template, form]);

  useEffect(() => {
    if (updateTemplate.error) applyServerErrors(form, updateTemplate.error);
  }, [updateTemplate.error, form]);

  if (isLoading) {
    return (
      <Page>
        <div className="skel" style={{ height: 56, width: 320 }} />
        <div className="skel" style={{ height: 300 }} />
      </Page>
    );
  }

  if (isError || !template) {
    return (
      <Page>
        <EmptyState
          icon={LayoutGrid}
          title="Template not found"
          desc={describeApiError(error)}
          actionLabel="Back to templates"
          onAction={() => router.push(ADMIN_PORTFOLIO_BASE_PATH)}
        />
      </Page>
    );
  }

  const structuralLocked = template.isInUse;

  // The render-based validator returns the exact failing placeholder/line in the
  // html_file error — show it verbatim rather than a generic "upload failed".
  const uploadPageError = uploadPage.error instanceof ApiRequestError
    ? uploadPage.error.errors?.html_file?.[0] ?? uploadPage.error.message
    : uploadPage.error
    ? describeApiError(uploadPage.error)
    : null;

  return (
    <Page>
      <button
        type="button"
        className="link-accent ds-body-sm"
        onClick={() => router.push(ADMIN_PORTFOLIO_BASE_PATH)}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <ArrowLeft size={14} /> All templates
      </button>

      <PageHead
        eyebrow="Services · Portfolio"
        title={template.name}
        subtitle={`${template.slug} · ${template.usageCount} portfolio${template.usageCount === 1 ? "" : "s"} · created by ${template.createdBy}`}
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className={`badge ${template.statusBadge}`}>{template.statusLabel}</span>
            {template.hasMainPage && (
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => setPreviewOpen((v) => !v)}>
                {previewOpen ? "Hide preview" : "Preview"}
              </button>
            )}
            {template.status !== "archived" && (
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => setConfirmArchive(true)}>
                Archive
              </button>
            )}
          </div>
        }
      />

      {structuralLocked && <InUseBanner usageCount={template.usageCount} />}

      {!template.hasMainPage && (
        <div className="card" style={{ padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start", borderColor: "var(--status-warning)" }}>
          <AlertTriangle size={17} style={{ color: "var(--status-warning)", flex: "none", marginTop: 1 }} />
          <div>
            <div style={{ font: "500 13px var(--font-sans)", color: "var(--text-primary)" }}>
              No main page uploaded yet
            </div>
            <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 3 }}>
              This template cannot be published or used until a main HTML page is uploaded and passes validation.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        {/* ── Metadata ─────────────────────────────────────────────────────── */}
        <form
          className="card"
          onSubmit={form.handleSubmit((values) =>
            updateTemplate.mutate(
              { values, thumbnail },
              {
                onSuccess: () => { toast.success("Template saved"); setThumbnail(null); },
                onError: (err) => toast.error("Could not save template", { description: describeApiError(err) }),
              },
            ),
          )}
        >
          <div className="card__header"><div style={{ font: "500 15px var(--font-sans)" }}>Metadata</div></div>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="field">
              <label className="label">Name</label>
              <input className="input" {...form.register("name")} />
              <FieldError error={form.formState.errors.name} />
            </div>

            <div className="field">
              <label className="label">Category</label>
              <input className="input" placeholder="Minimal" {...form.register("category")} />
              <FieldError error={form.formState.errors.category} />
            </div>

            <div className="field">
              <label className="label">Description</label>
              <textarea className="input textarea" rows={3} {...form.register("description")} />
              <FieldError error={form.formState.errors.description} />
            </div>

            <div className="field">
              <label className="label">Status</label>
              <select className="input" style={{ cursor: "pointer" }} {...form.register("status")}>
                {TEMPLATE_STATUSES.map((s) => (
                  <option key={s} value={s} disabled={s === "published" && !template.hasMainPage}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
                Only published templates appear in the user template gallery.
              </div>
              <FieldError error={form.formState.errors.status} />
            </div>

            <UploadRow
              title={thumbnail ? thumbnail.name : "Replace thumbnail"}
              description="JPG, PNG or WebP — shown on the template card."
              accept="image/jpeg,image/png,image/webp"
              buttonLabel="Choose"
              disabled={false}
              isUploading={false}
              onFile={setThumbnail}
            />
          </div>
          <div className="card__footer">
            <button type="button" className="btn btn--ghost" onClick={() => { form.reset(); setThumbnail(null); }}>
              Discard
            </button>
            <button type="submit" className="btn btn--primary" disabled={updateTemplate.isPending}>
              {updateTemplate.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ── Pages & assets ─────────────────────────────────────────────── */}
          <div className="card">
            <div className="card__header">
              <div style={{ font: "500 15px var(--font-sans)" }}>Pages and assets</div>
              <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 3 }}>
                Uploaded HTML is rendered against sample data — it is rejected if a placeholder does not resolve.
              </div>
            </div>

            <div style={{ padding: "0 20px" }}>
              {template.pages.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "0.5px solid var(--border-default)" }}>
                  <FileCode2 size={15} style={{ color: "var(--text-tertiary)", flex: "none" }} />
                  <span className="ds-code" style={{ flex: 1, fontSize: 12, color: "var(--text-primary)" }}>
                    {p.htmlFile.split("/").pop()}
                  </span>
                  <span className="badge badge--neutral">{p.pageType}</span>
                </div>
              ))}
              {template.assets.map((a) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "0.5px solid var(--border-default)" }}>
                  <FileCode2 size={15} style={{ color: "var(--text-tertiary)", flex: "none" }} />
                  <span className="ds-code" style={{ flex: 1, fontSize: 12, color: "var(--text-primary)" }}>{a.relativePath}</span>
                  <span className="badge badge--neutral">asset</span>
                </div>
              ))}
              {template.pages.length === 0 && template.assets.length === 0 && (
                <div className="ds-body-sm" style={{ color: "var(--text-secondary)", padding: "14px 0" }}>
                  Nothing uploaded yet.
                </div>
              )}
            </div>

            <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{ width: 190 }}>
                  <FormSelect
                    label="Page type"
                    value={pageType}
                    onChange={(v) => setPageType(v as TemplatePageType)}
                    options={[
                      { value: "main", label: "Main page" },
                      { value: "project_detail", label: "Project detail" },
                    ]}
                  />
                </div>
              </div>

              <UploadRow
                title="Upload page HTML"
                description={structuralLocked ? "Locked — this template is already in use." : "A single .html file, max 2 MB."}
                accept=".html,text/html"
                buttonLabel="Upload HTML"
                disabled={structuralLocked}
                isUploading={uploadPage.isPending}
                onFile={(file) =>
                  uploadPage.mutate(
                    { pageType, file },
                    { onSuccess: () => toast.success("Page uploaded and validated") },
                  )
                }
                extra={
                  uploadPageError ? (
                    <div
                      style={{
                        marginTop: 10, padding: "10px 12px", borderRadius: "var(--radius-input)",
                        background: "var(--bg-surface-raised)", border: "0.5px solid var(--status-error)",
                      }}
                    >
                      <div style={{ font: "500 12px var(--font-sans)", color: "var(--status-error)" }}>
                        Validation failed
                      </div>
                      <div className="ds-code" style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4, whiteSpace: "pre-wrap" }}>
                        {uploadPageError}
                      </div>
                    </div>
                  ) : null
                }
              />

              <UploadRow
                title="Upload asset"
                description={structuralLocked ? "Locked — this template is already in use." : "CSS, JS, images or fonts. SVG is not allowed."}
                accept=".css,.js,.png,.jpg,.jpeg,.webp,.gif,.woff,.woff2,.ttf"
                buttonLabel="Upload asset"
                disabled={structuralLocked || assetPath.trim() === ""}
                isUploading={uploadAsset.isPending}
                onFile={(file) =>
                  uploadAsset.mutate(
                    { file, relativePath: assetPath.trim() },
                    {
                      onSuccess: () => { toast.success("Asset uploaded"); setAssetPath(""); },
                      onError: (err) => toast.error("Could not upload asset", { description: describeApiError(err) }),
                    },
                  )
                }
                extra={
                  <input
                    className="input"
                    style={{ marginTop: 10, height: 32, fontFamily: "var(--font-mono)", fontSize: 12 }}
                    placeholder="assets/styles.css — the path used inside your HTML"
                    value={assetPath}
                    disabled={structuralLocked}
                    onChange={(e) => setAssetPath(e.target.value)}
                  />
                }
              />
            </div>
          </div>

          {/* ── Sections ───────────────────────────────────────────────────── */}
          <div className="card">
            <div className="card__header">
              <div style={{ font: "500 15px var(--font-sans)" }}>Sections</div>
              <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 3 }}>
                Pick which sections this template supports. Required sections cannot be turned off by users.
              </div>
            </div>
            <div style={{ padding: "0 20px" }}>
              {SECTION_KEYS.map((key) => {
                const existing = template.sections.find((s) => s.sectionKey === key);
                const included = Boolean(existing);
                const required = existing?.isRequired ?? false;

                function commit(nextIncluded: boolean, nextRequired: boolean) {
                  const others = template!.sections.filter((s) => s.sectionKey !== key);
                  const next = [
                    ...others.map((s) => ({ section_key: s.sectionKey, is_required: s.isRequired })),
                    ...(nextIncluded ? [{ section_key: key, is_required: nextRequired }] : []),
                  ];
                  setSections.mutate(next, {
                    onError: (err) => toast.error("Could not update sections", { description: describeApiError(err) }),
                  });
                }

                return (
                  <div
                    key={key}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid var(--border-default)" }}
                  >
                    <button
                      type="button"
                      disabled={structuralLocked || setSections.isPending}
                      onClick={() => commit(!included, required)}
                      style={{
                        width: 18, height: 18, flex: "none", borderRadius: 5, padding: 0,
                        border: `1px solid ${included ? "var(--accent-primary)" : "var(--border-strong)"}`,
                        background: included ? "var(--accent-primary)" : "transparent",
                        color: "var(--text-on-accent)", cursor: structuralLocked ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {included && <Check size={12} strokeWidth={3} />}
                    </button>

                    <span
                      className="ds-code"
                      style={{ flex: 1, fontSize: 12, color: included ? "var(--text-primary)" : "var(--text-tertiary)" }}
                    >
                      {key}
                    </span>

                    {included && (
                      <label
                        style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: structuralLocked ? "not-allowed" : "pointer" }}
                      >
                        <span className="ds-caption" style={{ color: "var(--text-tertiary)" }}>Required</span>
                        <input
                          type="checkbox"
                          checked={required}
                          disabled={structuralLocked || setSections.isPending}
                          onChange={(e) => commit(true, e.target.checked)}
                          style={{ width: 15, height: 15, accentColor: "var(--accent-primary)" }}
                        />
                      </label>
                    )}
                    {structuralLocked && <Lock size={13} style={{ color: "var(--text-tertiary)" }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Placeholders found ─────────────────────────────────────────── */}
          {template.placeholders.length > 0 && (
            <div className="card">
              <div className="card__header">
                <div style={{ font: "500 15px var(--font-sans)" }}>Placeholders used</div>
                <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 3 }}>
                  Detected automatically when the page was validated.
                </div>
              </div>
              <div className="card__body" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {template.placeholders.map((p) => (
                  <span key={p} className="badge badge--neutral" style={{ fontFamily: "var(--font-mono)" }}>{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {previewOpen && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="card__header"><div style={{ font: "500 15px var(--font-sans)" }}>Preview with sample data</div></div>
          <div style={{ padding: 16, background: "var(--bg-surface)" }}>
            {previewFailed ? (
              <div style={{ padding: 20, color: "var(--status-error)", font: "400 13px var(--font-sans)" }}>
                {describeApiError(previewError)}
              </div>
            ) : (
              <iframe
                title="Template preview"
                srcDoc={previewHtml ?? ""}
                sandbox="allow-scripts"
                style={{ width: "100%", height: 620, border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-card)", background: "#fff" }}
              />
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        config={
          confirmArchive
            ? ({
                title: "Archive this template?",
                body: "Archived templates disappear from the user gallery so nobody can start a new portfolio with them. Portfolios already using it keep working.",
                confirmLabel: "Archive template",
                tone: "warning",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setConfirmArchive(false)}
        onConfirm={() => {
          archiveTemplate.mutate(undefined, {
            onSuccess: () => toast.success("Template archived"),
            onError: (err) => toast.error("Could not archive", { description: describeApiError(err) }),
          });
          setConfirmArchive(false);
        }}
      />
    </Page>
  );
}
