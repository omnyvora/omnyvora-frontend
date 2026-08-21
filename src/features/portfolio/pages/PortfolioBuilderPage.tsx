"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Eye, Globe, PanelRightClose, PanelRightOpen, Settings2 } from "lucide-react";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { EmptyState } from "@/shared/workspace/components/ui";
import {
  usePortfolio,
  usePortfolioPreview,
  usePublishPortfolio,
  useSelectableItems,
  useSetItemVisibility,
  useSetSectionStates,
} from "../hooks";
import { usePortfolioStore } from "../store";
import { PORTFOLIO_BASE_PATH, SECTION_ITEM_TYPES } from "../constants";
import { SectionNav } from "../components/SectionNav";
import { ItemVisibilityPanel } from "../components/ItemVisibilityPanel";
import { ServicesPanel } from "../components/ServicesPanel";
import { PreviewFrame } from "../components/PreviewFrame";
import type { SectionStateUI } from "../transformers";

interface PortfolioBuilderPageProps {
  instanceId: number;
}

function SectionBody({
  instanceId,
  section,
  detail,
}: {
  instanceId: number;
  section:    SectionStateUI;
  detail:     NonNullable<ReturnType<typeof usePortfolio>["data"]>;
}) {
  const itemType = SECTION_ITEM_TYPES[section.sectionKey];
  const setVisibility = useSetItemVisibility(instanceId);
  const { data: items = [], isLoading } = useSelectableItems(itemType ?? "project", Boolean(itemType));

  if (section.sectionKey === "services") {
    return <ServicesPanel instanceId={instanceId} services={detail.services} />;
  }

  if (!itemType) {
    // hero / about — filled straight from the profile, nothing to choose here.
    return (
      <div
        style={{
          padding: "18px 20px", borderRadius: "var(--radius-card)",
          background: "var(--bg-surface)", border: "0.5px solid var(--border-default)",
        }}
      >
        <div style={{ font: "500 13px var(--font-sans)", color: "var(--text-primary)" }}>
          Filled automatically from your profile
        </div>
        <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          This section uses your name, bio and avatar. Update them in your profile and they change here too.
        </div>
      </div>
    );
  }

  return (
    <ItemVisibilityPanel
      itemType={itemType}
      items={items}
      visibility={detail.visibility}
      isLoading={isLoading}
      isSaving={setVisibility.isPending}
      onChange={(rows) =>
        setVisibility.mutate(
          { itemType, items: rows },
          { onError: (err) => toast.error("Could not update", { description: describeApiError(err) }) },
        )
      }
    />
  );
}

export function PortfolioBuilderPage({ instanceId }: PortfolioBuilderPageProps) {
  const router = useRouter();
  const { data: detail, isLoading, isError, error } = usePortfolio(instanceId);

  const activeKeyRaw = usePortfolioStore((s) => s.activeSectionKey);
  const setActiveKey = usePortfolioStore((s) => s.setActiveSectionKey);
  const previewOpen  = usePortfolioStore((s) => s.previewOpen);
  const togglePreview = usePortfolioStore((s) => s.togglePreview);

  const setSections = useSetSectionStates(instanceId);
  const publish = usePublishPortfolio(instanceId);
  const { data: previewHtml, isLoading: previewLoading, isError: previewError, error: previewErr } =
    usePortfolioPreview(instanceId, previewOpen);

  if (isLoading) {
    return (
      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="skel" style={{ height: 60, width: 420 }} />
        <div style={{ display: "flex", gap: 24 }}>
          <div className="skel" style={{ height: 400, width: 250 }} />
          <div className="skel" style={{ height: 400, flex: 1 }} />
        </div>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div style={{ padding: "48px 32px" }}>
        <EmptyState
          icon={Globe}
          title="Portfolio not found"
          desc={describeApiError(error)}
          actionLabel="Back to my portfolios"
          onAction={() => router.push(PORTFOLIO_BASE_PATH)}
        />
      </div>
    );
  }

  const sections = detail.sections;
  const activeKey = activeKeyRaw && sections.some((s) => s.sectionKey === activeKeyRaw)
    ? activeKeyRaw
    : sections[0]?.sectionKey ?? null;
  const activeSection = sections.find((s) => s.sectionKey === activeKey) ?? null;

  function handleToggleSection(section: SectionStateUI, enabled: boolean) {
    setSections.mutate([{ section_id: section.sectionId, is_enabled: enabled }], {
      onError: (err) => toast.error("Could not update section", { description: describeApiError(err) }),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ padding: "24px 32px 0", display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <button
            type="button"
            className="link-accent ds-body-sm"
            onClick={() => router.push(PORTFOLIO_BASE_PATH)}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 8 }}
          >
            <ArrowLeft size={14} /> My portfolios
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 className="ds-display-md" style={{ margin: 0, color: "var(--text-primary)" }}>{detail.title}</h1>
            <span className={`badge ${detail.statusBadge}`}>{detail.statusLabel}</span>
          </div>
          <div className="ds-caption" style={{ color: "var(--text-tertiary)", marginTop: 6 }}>
            {detail.templateName} · changes save as you make them
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn--secondary btn--sm" onClick={togglePreview}>
            {previewOpen ? <PanelRightClose size={14} style={{ marginRight: 6 }} /> : <PanelRightOpen size={14} style={{ marginRight: 6 }} />}
            {previewOpen ? "Hide preview" : "Show preview"}
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => router.push(`${PORTFOLIO_BASE_PATH}/${instanceId}/preview`)}
          >
            <Eye size={14} style={{ marginRight: 6 }} />Full preview
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => router.push(`${PORTFOLIO_BASE_PATH}/${instanceId}/publish`)}
          >
            <Settings2 size={14} style={{ marginRight: 6 }} />Publish settings
          </button>
          {detail.status !== "published" && (
            <button
              type="button"
              className="btn btn--accent btn--sm"
              disabled={publish.isPending}
              onClick={() =>
                publish.mutate(undefined, {
                  onSuccess: () => toast.success("Portfolio published"),
                  onError: (err) => toast.error("Could not publish", { description: describeApiError(err) }),
                })
              }
            >
              {publish.isPending ? "Publishing…" : "Publish"}
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", gap: 24, padding: "22px 32px 40px", minHeight: 0, alignItems: "flex-start" }}>
        <SectionNav
          sections={sections}
          activeKey={activeKey}
          onSelect={setActiveKey}
          onToggle={handleToggleSection}
          disabled={setSections.isPending}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          {activeSection ? (
            <div className="card card--raised" style={{ padding: 22 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="ds-display-sm" style={{ color: "var(--text-primary)" }}>
                    {activeSection.label}
                  </span>
                  {activeSection.isRequired && <span className="badge badge--neutral">Required</span>}
                  {!activeSection.isEnabled && <span className="badge badge--warning">Section off</span>}
                </div>
              </div>
              <SectionBody instanceId={instanceId} section={activeSection} detail={detail} />
            </div>
          ) : (
            <div className="card" style={{ padding: 16 }}>
              <EmptyState
                icon={Globe}
                title="This template has no sections yet"
                desc="An administrator still needs to declare which sections this template supports."
              />
            </div>
          )}
        </div>

        {previewOpen && (
          <div style={{ flex: "none", width: 340 }}>
            <div className="card card--raised" style={{ position: "sticky", top: 24, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                  borderBottom: "0.5px solid var(--border-default)",
                }}
              >
                <span className="label" style={{ color: "var(--text-tertiary)" }}>Live preview</span>
                <div style={{ flex: 1 }} />
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  style={{ height: 26, padding: "0 8px" }}
                  onClick={() => router.push(`${PORTFOLIO_BASE_PATH}/${instanceId}/preview`)}
                >
                  Open full
                </button>
              </div>
              <div style={{ padding: 12, background: "var(--bg-surface)" }}>
                <PreviewFrame
                  html={previewHtml}
                  loading={previewLoading}
                  error={previewError ? describeApiError(previewErr) : null}
                  height={460}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
