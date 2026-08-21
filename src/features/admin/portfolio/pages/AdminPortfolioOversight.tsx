"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ExternalLink, Globe, Star, X } from "lucide-react";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { EmptyState } from "@/shared/workspace/components/ui";
import { FieldError } from "@/shared/components/FieldError";
import {
  useAdminPortfolio,
  useAdminPortfolios,
  useAdminToggleFeatured,
  useAdminUnpublishPortfolio,
} from "../hooks";
import { useAdminPortfolioStore } from "../store";
import { FilterBar } from "../components/FilterBar";
import { UnpublishReasonFormSchema, type UnpublishReasonFormValues } from "../types";
import type { AdminPortfolioRowUI } from "../transformers";

function publicUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${base}/p/${slug}/`;
}

function UnpublishDialog({
  portfolio,
  onClose,
  onConfirm,
  isSaving,
}: {
  portfolio: AdminPortfolioRowUI;
  onClose:   () => void;
  onConfirm: (reason: string) => void;
  isSaving:  boolean;
}) {
  const form = useForm<UnpublishReasonFormValues>({
    resolver: zodResolver(UnpublishReasonFormSchema),
    defaultValues: { reason: "" },
  });

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 88, background: "rgba(17,17,17,0.45)" }} />
      <div
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 89,
          width: 480, maxWidth: "92vw", background: "var(--bg-overlay)",
          borderRadius: "var(--radius-modal)", border: "0.5px solid var(--border-default)",
          boxShadow: "var(--shadow-3)",
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "0.5px solid var(--border-default)" }}>
          <div className="ds-display-sm">Unpublish this portfolio?</div>
          <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 6 }}>
            {`"${portfolio.title}" by ${portfolio.ownerEmail} will stop resolving publicly. The owner keeps all of their content and can republish unless you act further.`}
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div className="field">
            <label className="label">Reason (recorded in the audit log)</label>
            <textarea
              className="input textarea"
              rows={3}
              placeholder="Reported for policy violation — contains third-party copyrighted work."
              {...form.register("reason")}
            />
            <FieldError error={form.formState.errors.reason} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "0.5px solid var(--border-default)" }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={isSaving}
            onClick={form.handleSubmit((values) => onConfirm(values.reason))}
          >
            {isSaving ? "Unpublishing…" : "Unpublish"}
          </button>
        </div>
      </div>
    </>
  );
}

function DetailPane({ instanceId, onClose }: { instanceId: number; onClose: () => void }) {
  const { data: detail, isLoading } = useAdminPortfolio(instanceId);
  const toggleFeatured = useAdminToggleFeatured();

  if (isLoading || !detail) {
    return <div className="skel" style={{ height: 420 }} />;
  }

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "Owner", value: detail.ownerEmail },
    { label: "Template", value: detail.templateName },
    { label: "Status", value: detail.statusLabel },
    { label: "Address", value: detail.address, mono: true },
    { label: "Published", value: detail.publishedAt ? new Date(detail.publishedAt).toLocaleString() : "—" },
    { label: "Created", value: new Date(detail.createdAt).toLocaleDateString() },
    { label: "Services", value: String(detail.services.length) },
  ];

  return (
    <div className="card card--raised" style={{ position: "sticky", top: 24, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "18px 20px", borderBottom: "0.5px solid var(--border-default)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "500 15px var(--font-sans)", color: "var(--text-primary)" }}>{detail.title}</div>
          <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 3 }}>{detail.ownerEmail}</div>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" style={{ width: 30, padding: 0 }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div style={{ padding: "4px 20px" }}>
        {rows.map((r) => (
          <div
            key={r.label}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "0.5px solid var(--border-default)" }}
          >
            <span className="label" style={{ color: "var(--text-tertiary)", width: 110, flex: "none" }}>{r.label}</span>
            <span
              className={r.mono ? "ds-code" : "ds-body-sm"}
              style={{ flex: 1, minWidth: 0, color: "var(--text-primary)", fontSize: r.mono ? 12 : undefined, wordBreak: "break-all" }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 20px" }}>
        <div className="label" style={{ color: "var(--text-tertiary)", marginBottom: 10 }}>Sections</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {detail.sections.map((s) => (
            <span key={s.sectionKey} className={`badge ${s.isEnabled ? "badge--accent" : "badge--neutral"}`}>
              {s.sectionKey}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <a
          className="btn btn--secondary"
          style={{ width: "100%", justifyContent: "flex-start" }}
          href={publicUrl(detail.slug)}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={15} style={{ marginRight: 8 }} />View live page
        </a>
        <button
          type="button"
          className="btn btn--secondary"
          style={{ width: "100%", justifyContent: "flex-start" }}
          disabled={toggleFeatured.isPending}
          onClick={() =>
            toggleFeatured.mutate(detail.id, {
              onSuccess: () => toast.success(detail.isFeatured ? "Removed from featured" : "Marked as featured"),
              onError: (err) => toast.error("Could not update", { description: describeApiError(err) }),
            })
          }
        >
          <Star size={15} style={{ marginRight: 8 }} fill={detail.isFeatured ? "currentColor" : "none"} />
          {detail.isFeatured ? "Remove from featured" : "Feature this portfolio"}
        </button>
      </div>
    </div>
  );
}

export function AdminPortfolioOversight() {
  const status = useAdminPortfolioStore((s) => s.portfolioStatusFilter);
  const setStatus = useAdminPortfolioStore((s) => s.setPortfolioStatusFilter);
  const search = useAdminPortfolioStore((s) => s.portfolioSearch);
  const setSearch = useAdminPortfolioStore((s) => s.setPortfolioSearch);
  const selectedId = useAdminPortfolioStore((s) => s.selectedPortfolioId);
  const setSelectedId = useAdminPortfolioStore((s) => s.setSelectedPortfolioId);

  const { data: portfolios = [], isLoading, isError, error } = useAdminPortfolios(status, search);
  const unpublish = useAdminUnpublishPortfolio();
  const [unpublishing, setUnpublishing] = useState<AdminPortfolioRowUI | null>(null);

  // Keep the detail pane pointed at a row that still exists in the current filter.
  useEffect(() => {
    if (selectedId && !portfolios.some((p) => p.id === selectedId)) setSelectedId(null);
  }, [portfolios, selectedId, setSelectedId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <FilterBar
        options={["All", "Published", "Draft", "Unpublished"]}
        value={status}
        onChange={setStatus}
        search={search}
        onSearch={setSearch}
        placeholder="Owner email, title or slug"
        trailing={
          <span className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
            {portfolios.length} portfolio{portfolios.length === 1 ? "" : "s"}
          </span>
        }
      />

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 60 }} />)}
        </div>
      ) : isError ? (
        <div className="card" style={{ padding: 20, borderColor: "var(--status-error)" }}>
          <div style={{ font: "500 14px var(--font-sans)" }}>Could not load portfolios</div>
          <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {describeApiError(error)}
          </div>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Globe}
            title="No portfolios match"
            desc="No user has created a portfolio with these filters yet."
            {...(status !== "All" || search
              ? { actionLabel: "Clear filters", onAction: () => { setStatus("All"); setSearch(""); } }
              : {})}
          />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selectedId ? "1fr 380px" : "1fr", gap: 20, alignItems: "start" }}>
          <div className="card" style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "grid", gridTemplateColumns: "1.4fr 1fr 0.8fr 1fr 0.8fr",
                padding: "10px 20px", background: "var(--bg-surface)",
                borderBottom: "0.5px solid var(--border-default)",
              }}
            >
              <span className="label" style={{ color: "var(--text-tertiary)" }}>Owner</span>
              <span className="label" style={{ color: "var(--text-tertiary)" }}>Template</span>
              <span className="label" style={{ color: "var(--text-tertiary)" }}>Status</span>
              <span className="label" style={{ color: "var(--text-tertiary)" }}>Address</span>
              <span className="label" style={{ color: "var(--text-tertiary)", textAlign: "right" }}>Actions</span>
            </div>

            {portfolios.map((p) => (
              <div
                key={p.id}
                className="row-hover"
                onClick={() => setSelectedId(p.id)}
                style={{
                  display: "grid", gridTemplateColumns: "1.4fr 1fr 0.8fr 1fr 0.8fr",
                  alignItems: "center", padding: "12px 20px", cursor: "pointer",
                  borderBottom: "0.5px solid var(--border-default)",
                  background: selectedId === p.id ? "var(--accent-subtle)" : "transparent",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        font: "500 13px var(--font-sans)", color: "var(--text-primary)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}
                    >
                      {p.title}
                    </span>
                    {p.isFeatured && <Star size={12} fill="currentColor" style={{ color: "var(--accent-text)", flex: "none" }} />}
                  </div>
                  <div className="ds-caption" style={{ color: "var(--text-tertiary)", marginTop: 2 }}>{p.ownerEmail}</div>
                </div>
                <span className="ds-body-sm" style={{ color: "var(--text-secondary)" }}>{p.templateName}</span>
                <span><span className={`badge ${p.statusBadge}`}>{p.statusLabel}</span></span>
                <span
                  className="ds-code"
                  style={{ fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 8 }}
                >
                  {p.address}
                </span>
                <span style={{ display: "flex", justifyContent: "flex-end" }}>
                  {p.status === "published" && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      style={{ color: "var(--status-error)" }}
                      onClick={(e) => { e.stopPropagation(); setUnpublishing(p); }}
                    >
                      Unpublish
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>

          {selectedId && <DetailPane instanceId={selectedId} onClose={() => setSelectedId(null)} />}
        </div>
      )}

      {unpublishing && (
        <UnpublishDialog
          portfolio={unpublishing}
          isSaving={unpublish.isPending}
          onClose={() => setUnpublishing(null)}
          onConfirm={(reason) => {
            unpublish.mutate(
              { instanceId: unpublishing.id, reason },
              {
                onSuccess: () => { toast.success("Portfolio unpublished"); setUnpublishing(null); },
                onError: (err) => toast.error("Could not unpublish", { description: describeApiError(err) }),
              },
            );
          }}
        />
      )}
    </div>
  );
}
