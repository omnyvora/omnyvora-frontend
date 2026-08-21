"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Copy, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { usePortfolio, usePortfolioPreview } from "../hooks";
import { usePortfolioStore } from "../store";
import { PORTFOLIO_BASE_PATH } from "../constants";
import { PreviewFrame } from "../components/PreviewFrame";

interface PortfolioPreviewPageProps {
  instanceId: number;
}

export function PortfolioPreviewPage({ instanceId }: PortfolioPreviewPageProps) {
  const router = useRouter();
  const { data: detail } = usePortfolio(instanceId);
  const { data: html, isLoading, isError, error } = usePortfolioPreview(instanceId);

  const device = usePortfolioStore((s) => s.previewDevice);
  const setDevice = usePortfolioStore((s) => s.setPreviewDevice);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const url = detail ? `${base}/p/${detail.slug}/` : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-surface)" }}>
      <div
        style={{
          flex: "none", display: "flex", alignItems: "center", gap: 12, padding: "14px 24px",
          background: "var(--bg-page)", borderBottom: "0.5px solid var(--border-default)", flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => router.push(`${PORTFOLIO_BASE_PATH}/${instanceId}/builder`)}
        >
          <ArrowLeft size={14} style={{ marginRight: 6 }} />Back to builder
        </button>

        <div style={{ width: "0.5px", height: 20, background: "var(--border-default)" }} />

        <div
          style={{
            display: "flex", alignItems: "center", gap: 2, padding: 3,
            background: "var(--bg-surface)", borderRadius: "var(--radius-pill)",
            border: "0.5px solid var(--border-default)",
          }}
        >
          {([["desktop", Monitor, "Desktop"], ["mobile", Smartphone, "Mobile"]] as const).map(([id, Icon, label]) => {
            const active = device === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 12px",
                  borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer",
                  background: active ? "var(--bg-surface-raised)" : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  font: "500 12px var(--font-sans)",
                }}
              >
                <Icon size={13} />{label}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        {detail && (
          <>
            <span className="ds-code" style={{ fontSize: 12, color: "var(--text-secondary)" }}>{url}</span>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => { void navigator.clipboard.writeText(url); toast.success("Link copied"); }}
            >
              <Copy size={13} style={{ marginRight: 6 }} />Copy link
            </button>
            {detail.status === "published" && (
              <a className="btn btn--secondary btn--sm" href={url} target="_blank" rel="noreferrer">
                <ExternalLink size={13} style={{ marginRight: 6 }} />Open live
              </a>
            )}
          </>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 28, display: "flex", justifyContent: "center", minHeight: 0 }}>
        <div
          style={{
            width: device === "mobile" ? 390 : "100%",
            maxWidth: device === "mobile" ? 390 : 1100,
            transition: "width var(--duration-base) var(--ease)",
            minHeight: 600,
          }}
        >
          <PreviewFrame
            html={html}
            loading={isLoading}
            error={isError ? describeApiError(error) : null}
            height={760}
          />
        </div>
      </div>
    </div>
  );
}
