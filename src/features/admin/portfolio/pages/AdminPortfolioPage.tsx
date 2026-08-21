"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BarChart3, LayoutGrid, Globe, Plus, Star, Users } from "lucide-react";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { Page, PageHead, Tabs, EmptyState } from "@/shared/workspace/components/ui";
import {
  useAdminTemplates,
  useCreateAdminTemplate,
  usePortfolioDashboard,
} from "../hooks";
import { useAdminPortfolioStore, type AdminPortfolioTab } from "../store";
import { FilterBar } from "../components/FilterBar";
import { TemplateCreateDialog } from "../components/TemplateCreateDialog";
import { AdminPortfolioOversight } from "./AdminPortfolioOversight";
import { ADMIN_PORTFOLIO_BASE_PATH } from "../constants";
import type { TemplateCreateFormValues } from "../types";

const TABS = [
  { id: "overview" as const,   label: "Overview",   icon: BarChart3 },
  { id: "templates" as const,  label: "Templates",  icon: LayoutGrid },
  { id: "portfolios" as const, label: "Portfolios", icon: Globe },
];

function StatTile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="label" style={{ color: "var(--text-tertiary)" }}>{label}</div>
      <div style={{ font: "600 26px var(--font-sans)", color: "var(--text-primary)", marginTop: 6 }}>{value}</div>
      {sub && <div className="ds-caption" style={{ color: "var(--text-tertiary)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function OverviewTab({ onManageTemplates }: { onManageTemplates: () => void }) {
  const { data: stats, isLoading, isError, error } = usePortfolioDashboard();
  const { data: templates = [] } = useAdminTemplates("All", "");

  if (isLoading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[1, 2, 3, 4].map((i) => <div key={i} className="skel" style={{ height: 104 }} />)}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="card" style={{ padding: 20, borderColor: "var(--status-error)" }}>
        <div style={{ font: "500 14px var(--font-sans)" }}>Could not load portfolio stats</div>
        <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          {describeApiError(error)}
        </div>
      </div>
    );
  }

  const publishedTemplates = templates.filter((t) => t.status === "published").length;
  const mostUsed = [...templates].sort((a, b) => b.usageCount - a.usageCount)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatTile label="Templates" value={templates.length} sub={`${publishedTemplates} published`} />
        <StatTile label="Portfolios" value={stats.total} sub="across all users" />
        <StatTile
          label="Published"
          value={stats.published}
          sub={stats.total > 0 ? `${Math.round((stats.published / stats.total) * 100)}% of all` : "—"}
        />
        <StatTile label="Drafts" value={stats.draft} sub={`${stats.unpublished} unpublished`} />
      </div>

      <div className="card">
        <div className="card__header" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ font: "500 15px var(--font-sans)" }}>Most used template</div>
          <div style={{ flex: 1 }} />
          <button type="button" className="btn btn--ghost btn--sm" onClick={onManageTemplates}>
            Manage templates
          </button>
        </div>
        <div className="card__body">
          {mostUsed ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 56, height: 40, flex: "none", borderRadius: "var(--radius-icon)",
                  border: "0.5px solid var(--border-default)", background: "var(--bg-surface)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)",
                  overflow: "hidden",
                }}
              >
                {mostUsed.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mostUsed.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <LayoutGrid size={16} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "500 14px var(--font-sans)", color: "var(--text-primary)" }}>{mostUsed.name}</div>
                <div className="ds-caption" style={{ color: "var(--text-secondary)", marginTop: 3 }}>
                  {mostUsed.usageCount} portfolio{mostUsed.usageCount === 1 ? "" : "s"}
                </div>
              </div>
              <span className={`badge ${mostUsed.statusBadge}`}>{mostUsed.statusLabel}</span>
            </div>
          ) : (
            <div className="ds-body-sm" style={{ color: "var(--text-secondary)" }}>
              No templates yet — create one from the Templates tab.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TemplatesTab() {
  const router = useRouter();
  const status = useAdminPortfolioStore((s) => s.templateStatusFilter);
  const setStatus = useAdminPortfolioStore((s) => s.setTemplateStatusFilter);
  const search = useAdminPortfolioStore((s) => s.templateSearch);
  const setSearch = useAdminPortfolioStore((s) => s.setTemplateSearch);

  const { data: templates = [], isLoading, isError, error } = useAdminTemplates(status, search);
  const createTemplate = useCreateAdminTemplate();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate(values: TemplateCreateFormValues, thumbnail: File | null) {
    createTemplate.mutate(
      { values, thumbnail },
      {
        onSuccess: (detail) => {
          toast.success("Template created");
          setDialogOpen(false);
          router.push(`${ADMIN_PORTFOLIO_BASE_PATH}/templates/${detail.id}`);
        },
        onError: (err) => toast.error("Could not create template", { description: describeApiError(err) }),
      },
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <FilterBar
        options={["All", "Draft", "Published", "Archived"]}
        value={status}
        onChange={setStatus}
        search={search}
        onSearch={setSearch}
        placeholder="Search name or slug"
        trailing={
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setDialogOpen(true)}>
            <Plus size={14} style={{ marginRight: 6 }} />New template
          </button>
        }
      />

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 64 }} />)}
        </div>
      ) : isError ? (
        <div className="card" style={{ padding: 20, borderColor: "var(--status-error)" }}>
          <div style={{ font: "500 14px var(--font-sans)" }}>Could not load templates</div>
          <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {describeApiError(error)}
          </div>
        </div>
      ) : templates.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={LayoutGrid}
            title="No templates yet"
            desc="Upload an HTML portfolio template so users have something to choose from."
            actionLabel="Create your first template"
            onAction={() => setDialogOpen(true)}
          />
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "grid", gridTemplateColumns: "56px 1.6fr 1fr 0.9fr 1.2fr 0.7fr",
              padding: "10px 20px", background: "var(--bg-surface)",
              borderBottom: "0.5px solid var(--border-default)",
            }}
          >
            <span />
            <span className="label" style={{ color: "var(--text-tertiary)" }}>Name</span>
            <span className="label" style={{ color: "var(--text-tertiary)" }}>Category</span>
            <span className="label" style={{ color: "var(--text-tertiary)" }}>Status</span>
            <span className="label" style={{ color: "var(--text-tertiary)" }}>Created by</span>
            <span className="label" style={{ color: "var(--text-tertiary)", textAlign: "right" }}>In use</span>
          </div>

          {templates.map((t) => (
            <div
              key={t.id}
              className="row-hover"
              onClick={() => router.push(`${ADMIN_PORTFOLIO_BASE_PATH}/templates/${t.id}`)}
              style={{
                display: "grid", gridTemplateColumns: "56px 1.6fr 1fr 0.9fr 1.2fr 0.7fr",
                alignItems: "center", padding: "12px 20px", cursor: "pointer",
                borderBottom: "0.5px solid var(--border-default)",
              }}
            >
              <div
                style={{
                  width: 44, height: 32, borderRadius: 5, overflow: "hidden",
                  border: "0.5px solid var(--border-default)", background: "var(--bg-surface)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)",
                }}
              >
                {t.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <LayoutGrid size={14} />
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "500 13px var(--font-sans)", color: "var(--text-primary)" }}>{t.name}</div>
                <div className="ds-code" style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{t.slug}</div>
              </div>
              <span className="ds-body-sm" style={{ color: "var(--text-secondary)" }}>{t.category || "—"}</span>
              <span><span className={`badge ${t.statusBadge}`}>{t.statusLabel}</span></span>
              <span className="ds-code" style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.createdBy}</span>
              <span className="ds-code" style={{ fontSize: 12, color: "var(--text-primary)", textAlign: "right" }}>
                {t.usageCount}
              </span>
            </div>
          ))}
        </div>
      )}

      <TemplateCreateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        isSaving={createTemplate.isPending}
        saveError={createTemplate.error}
      />
    </div>
  );
}

export function AdminPortfolioPage() {
  const tab = useAdminPortfolioStore((s) => s.tab);
  const setTab = useAdminPortfolioStore((s) => s.setTab);

  return (
    <Page>
      <PageHead
        eyebrow="Services · Portfolio"
        title="Portfolio"
        subtitle="Template catalog and published portfolios across the platform."
      />

      <Tabs items={TABS} value={tab} onChange={(id) => setTab(id as AdminPortfolioTab)} />

      {tab === "overview" && <OverviewTab onManageTemplates={() => setTab("templates")} />}
      {tab === "templates" && <TemplatesTab />}
      {tab === "portfolios" && <AdminPortfolioOversight />}
    </Page>
  );
}
