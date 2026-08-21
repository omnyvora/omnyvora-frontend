"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, LayoutGrid, X } from "lucide-react";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { useDebounce } from "@/core/hooks/useDebounce";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { useCreatePortfolio, useTemplateGallery, useTemplatePreview } from "../hooks";
import { usePortfolioStore } from "../store";
import { uniqueTemplateCategories, type TemplateCardUI } from "../transformers";
import { PORTFOLIO_BASE_PATH } from "../constants";
import { PreviewFrame } from "../components/PreviewFrame";

function TemplateCard({
  template,
  onUse,
  onPreview,
  isCreating,
}: {
  template:   TemplateCardUI;
  onUse:      () => void;
  onPreview:  () => void;
  isCreating: boolean;
}) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          height: 180, background: "var(--bg-surface)",
          borderBottom: "0.5px solid var(--border-default)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-tertiary)",
        }}
      >
        {template.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={template.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <LayoutGrid size={26} strokeWidth={1.5} />
        )}
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ font: "500 15px var(--font-sans)", color: "var(--text-primary)" }}>{template.name}</span>
          {template.category && <span className="badge badge--neutral">{template.category}</span>}
        </div>
        <p className="ds-body-sm" style={{ margin: "7px 0 0", color: "var(--text-secondary)" }}>
          {template.description}
        </p>
        <div style={{ flex: 1, minHeight: 14 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
          <button type="button" className="btn btn--accent btn--sm" onClick={onUse} disabled={isCreating}>
            {isCreating ? "Creating…" : "Use this template"}
          </button>
          <button type="button" className="btn btn--secondary btn--sm" onClick={onPreview}>Preview</button>
          <div style={{ flex: 1 }} />
          <span className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
            {template.sectionsCount} sections
          </span>
        </div>
      </div>
    </div>
  );
}

function PreviewOverlay({ slug, name, onClose }: { slug: string; name: string; onClose: () => void }) {
  const { data: html, isLoading, isError, error } = useTemplatePreview(slug);

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 88, background: "rgba(17,17,17,0.55)" }}
      />
      <div
        style={{
          position: "fixed", inset: "4vh 6vw", zIndex: 89, background: "var(--bg-overlay)",
          borderRadius: "var(--radius-modal)", border: "0.5px solid var(--border-default)",
          boxShadow: "var(--shadow-3)", display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
            borderBottom: "0.5px solid var(--border-default)",
          }}
        >
          <div>
            <div className="label" style={{ color: "var(--text-tertiary)" }}>Preview with sample data</div>
            <div style={{ font: "500 15px var(--font-sans)", color: "var(--text-primary)" }}>{name}</div>
          </div>
          <div style={{ flex: 1 }} />
          <button type="button" className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div style={{ flex: 1, padding: 16, background: "var(--bg-surface)", minHeight: 0 }}>
          <PreviewFrame
            html={html}
            loading={isLoading}
            error={isError ? describeApiError(error) : null}
          />
        </div>
      </div>
    </>
  );
}

export function TemplateGalleryPage() {
  const router = useRouter();
  const category = usePortfolioStore((s) => s.galleryCategory);
  const setCategory = usePortfolioStore((s) => s.setGalleryCategory);

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 300);
  const [previewing, setPreviewing] = useState<TemplateCardUI | null>(null);

  const { data: templates = [], isLoading, isError, error } = useTemplateGallery(category, search);
  const createPortfolio = useCreatePortfolio();

  // Categories come from the unfiltered result, so switching category never
  // empties the filter bar itself.
  const { data: allTemplates = [] } = useTemplateGallery("All", "");
  const categories = ["All", ...uniqueTemplateCategories(allTemplates)];

  function handleUse(template: TemplateCardUI) {
    createPortfolio.mutate(
      { template_id: template.id, title: `${template.name} portfolio` },
      {
        onSuccess: (detail) => {
          toast.success("Portfolio created");
          router.push(`${PORTFOLIO_BASE_PATH}/${detail.id}/builder`);
        },
        onError: (err) => toast.error("Could not create portfolio", { description: describeApiError(err) }),
      },
    );
  }

  return (
    <Page>
      <button
        type="button"
        className="link-accent ds-body-sm"
        onClick={() => router.push(PORTFOLIO_BASE_PATH)}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <ArrowLeft size={14} /> My portfolios
      </button>

      <PageHead
        eyebrow="Portfolio"
        title="Choose a template"
        subtitle="Your content stays the same in every template. You can switch later."
      />

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {categories.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              style={{
                height: 32, padding: "0 14px", borderRadius: "var(--radius-pill)", cursor: "pointer",
                border: `0.5px solid ${active ? "var(--accent-primary)" : "var(--border-default)"}`,
                background: active ? "var(--accent-subtle)" : "var(--bg-surface-raised)",
                color: active ? "var(--accent-text)" : "var(--text-secondary)",
                font: `${active ? 500 : 400} 13px var(--font-sans)`,
              }}
            >
              {c}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <input
          className="input"
          style={{ width: 240, height: 34 }}
          placeholder="Search templates"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skel" style={{ height: 300 }} />)}
        </div>
      ) : isError ? (
        <div className="card" style={{ padding: 20, borderColor: "var(--status-error)" }}>
          <div style={{ font: "500 14px var(--font-sans)" }}>Template catalog unavailable</div>
          <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {describeApiError(error)}
          </div>
        </div>
      ) : templates.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={LayoutGrid}
            title="No templates here yet"
            desc={
              category === "All" && !search
                ? "No portfolio templates have been published yet. Check back soon."
                : "Nothing matches this filter. Try another category or clear your search."
            }
            {...(category !== "All" || search
              ? { actionLabel: "Show all templates", onAction: () => { setCategory("All"); setSearchInput(""); } }
              : {})}
          />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              isCreating={createPortfolio.isPending}
              onUse={() => handleUse(t)}
              onPreview={() => setPreviewing(t)}
            />
          ))}
        </div>
      )}

      {previewing && (
        <PreviewOverlay slug={previewing.slug} name={previewing.name} onClose={() => setPreviewing(null)} />
      )}
    </Page>
  );
}
