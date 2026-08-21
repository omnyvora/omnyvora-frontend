"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, ExternalLink, Globe, LayoutGrid, Plus, Settings2, Trash2 } from "lucide-react";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { usePortfolios, useDeletePortfolio } from "../hooks";
import { PORTFOLIO_BASE_PATH } from "../constants";
import type { PortfolioListItemUI } from "../transformers";

function publicUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${base}/p/${slug}/`;
}

function PortfolioCard({
  portfolio,
  onEdit,
  onPublishSettings,
  onDelete,
}: {
  portfolio:         PortfolioListItemUI;
  onEdit:            () => void;
  onPublishSettings: () => void;
  onDelete:          () => void;
}) {
  const url = portfolio.customDomain ? `https://${portfolio.customDomain}` : publicUrl(portfolio.slug);

  return (
    <div className="card card--raised" style={{ display: "flex", overflow: "hidden" }}>
      <div
        style={{
          flex: "none", width: 220, background: "var(--bg-surface)",
          borderRight: "0.5px solid var(--border-default)", padding: 18,
          display: "flex", flexDirection: "column", gap: 10,
        }}
      >
        {portfolio.templateThumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portfolio.templateThumb}
            alt=""
            style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: "var(--radius-icon)", border: "0.5px solid var(--border-default)" }}
          />
        ) : (
          <div
            style={{
              height: 110, borderRadius: "var(--radius-icon)", border: "0.5px solid var(--border-default)",
              background: "var(--bg-surface-raised)", display: "flex", alignItems: "center",
              justifyContent: "center", color: "var(--text-tertiary)",
            }}
          >
            <LayoutGrid size={22} strokeWidth={1.6} />
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span className="label" style={{ color: "var(--text-tertiary)" }}>Template</span>
          <span className="ds-body-sm" style={{ color: "var(--text-primary)" }}>{portfolio.templateName}</span>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "20px 22px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="ds-display-sm" style={{ color: "var(--text-primary)" }}>{portfolio.title}</span>
          <span className={`badge ${portfolio.statusBadge}`}>{portfolio.statusLabel}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <span className="ds-code" style={{ color: "var(--accent-text)", fontSize: 12 }}>{url}</span>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            style={{ height: 26, padding: "0 8px" }}
            onClick={() => {
              void navigator.clipboard.writeText(url);
              toast.success("Link copied");
            }}
          >
            <Copy size={13} style={{ marginRight: 6 }} />Copy link
          </button>
        </div>

        <div style={{ display: "flex", gap: 28, marginTop: 18, flexWrap: "wrap" }}>
          <div>
            <div className="label" style={{ color: "var(--text-tertiary)" }}>Published</div>
            <div className="ds-body-sm" style={{ color: "var(--text-primary)", marginTop: 3 }}>
              {portfolio.publishedAt ? new Date(portfolio.publishedAt).toLocaleDateString() : "Not yet"}
            </div>
          </div>
          <div>
            <div className="label" style={{ color: "var(--text-tertiary)" }}>Last updated</div>
            <div className="ds-body-sm" style={{ color: "var(--text-primary)", marginTop: 3 }}>
              {new Date(portfolio.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 16 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn--primary btn--sm" onClick={onEdit}>Edit portfolio</button>
          <button type="button" className="btn btn--secondary btn--sm" onClick={onPublishSettings}>
            <Settings2 size={14} style={{ marginRight: 6 }} />Publish settings
          </button>
          {portfolio.status === "published" && (
            <a className="btn btn--secondary btn--sm" href={url} target="_blank" rel="noreferrer">
              <ExternalLink size={14} style={{ marginRight: 6 }} />Open live
            </a>
          )}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            style={{ color: "var(--status-error)" }}
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function PortfolioHomePage() {
  const router = useRouter();
  const { data: portfolios = [], isLoading, isError, error } = usePortfolios();
  const deletePortfolio = useDeletePortfolio();
  const [pendingDelete, setPendingDelete] = useState<PortfolioListItemUI | null>(null);

  return (
    <Page>
      <PageHead
        eyebrow="Portfolio"
        title="My portfolios"
        subtitle="Publish a portfolio site from the projects, experience and skills already in your data."
        action={
          <button
            type="button"
            className="btn btn--accent"
            onClick={() => router.push(`${PORTFOLIO_BASE_PATH}/templates`)}
          >
            <Plus size={15} style={{ marginRight: 6 }} />New portfolio
          </button>
        }
      />

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="skel" style={{ height: 190 }} />
          <div className="skel" style={{ height: 190 }} />
        </div>
      ) : isError ? (
        <div className="card" style={{ padding: 20, borderColor: "var(--status-error)" }}>
          <div style={{ font: "500 14px var(--font-sans)", color: "var(--text-primary)" }}>
            Could not load your portfolios
          </div>
          <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {describeApiError(error)}
          </div>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="card" style={{ padding: 16 }}>
          <EmptyState
            icon={Globe}
            title="No portfolios yet"
            desc="Pick a template and Omnyvora builds a portfolio site from the data you have already entered."
            actionLabel="Browse templates"
            onAction={() => router.push(`${PORTFOLIO_BASE_PATH}/templates`)}
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {portfolios.map((p) => (
            <PortfolioCard
              key={p.id}
              portfolio={p}
              onEdit={() => router.push(`${PORTFOLIO_BASE_PATH}/${p.id}/builder`)}
              onPublishSettings={() => router.push(`${PORTFOLIO_BASE_PATH}/${p.id}/publish`)}
              onDelete={() => setPendingDelete(p)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        config={
          pendingDelete
            ? ({
                title: "Delete this portfolio?",
                body: `"${pendingDelete.title}" and its section setup and services will be removed, and its public address will stop working. The projects, experience and skills in My Data are not affected.`,
                confirmLabel: "Delete portfolio",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deletePortfolio.mutate(pendingDelete.id, {
            onSuccess: () => toast.success("Portfolio deleted"),
            onError: (err) => toast.error("Could not delete portfolio", { description: describeApiError(err) }),
          });
          setPendingDelete(null);
        }}
      />
    </Page>
  );
}
