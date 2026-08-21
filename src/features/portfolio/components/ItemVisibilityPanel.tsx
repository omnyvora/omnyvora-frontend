"use client";

import { useRouter } from "next/navigation";
import { Check, Database } from "lucide-react";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ITEM_TYPE_LABELS, MY_DATA_PATH } from "../constants";
import { isItemVisible } from "../transformers";
import type { PortfolioItemType } from "../types";
import type { SelectableItem } from "../types";
import type { z } from "zod";
import type { ItemVisibilitySchema } from "../types";

type ItemVisibility = z.infer<typeof ItemVisibilitySchema>;

interface ItemVisibilityPanelProps {
  itemType:   PortfolioItemType;
  items:      SelectableItem[];
  visibility: ItemVisibility[];
  isLoading:  boolean;
  isSaving:   boolean;
  onChange:   (items: { item_id: string; is_visible: boolean }[]) => void;
}

export function ItemVisibilityPanel({
  itemType, items, visibility, isLoading, isSaving, onChange,
}: ItemVisibilityPanelProps) {
  const router = useRouter();
  const label = ITEM_TYPE_LABELS[itemType];

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 56 }} />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Database}
        title={`No ${label.toLowerCase()} yet`}
        desc={`Add ${label.toLowerCase()} in My Data and they will show up here, ready to place on your portfolio.`}
        actionLabel="Go to My Data"
        onAction={() => router.push(MY_DATA_PATH)}
      />
    );
  }

  const currentRows = items.map((item) => ({
    item_id:    String(item.id),
    is_visible: isItemVisible(visibility, itemType, item.id),
  }));
  const visibleCount = currentRows.filter((r) => r.is_visible).length;

  function setAll(visible: boolean) {
    onChange(items.map((item) => ({ item_id: String(item.id), is_visible: visible })));
  }

  function toggleOne(itemId: number) {
    onChange(
      currentRows.map((row) =>
        row.item_id === String(itemId) ? { ...row, is_visible: !row.is_visible } : row,
      ),
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <span className="ds-caption" style={{ color: "var(--text-secondary)" }}>
          {visibleCount} of {items.length} shown on this portfolio
        </span>
        <div style={{ flex: 1 }} />
        <button type="button" className="btn btn--ghost btn--sm" disabled={isSaving} onClick={() => setAll(true)}>
          Select all
        </button>
        <button type="button" className="btn btn--ghost btn--sm" disabled={isSaving} onClick={() => setAll(false)}>
          Clear all
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => {
          const visible = isItemVisible(visibility, itemType, item.id);
          return (
            <div
              key={item.id}
              onClick={() => !isSaving && toggleOne(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                border: `0.5px solid ${visible ? "var(--accent-primary)" : "var(--border-default)"}`,
                borderRadius: "var(--radius-card)",
                background: visible ? "var(--accent-subtle)" : "var(--bg-surface-raised)",
                cursor: isSaving ? "default" : "pointer",
                opacity: isSaving ? 0.7 : 1,
                transition: "border-color var(--duration-fast) var(--ease), background var(--duration-fast) var(--ease)",
              }}
            >
              <div
                aria-hidden
                style={{
                  width: 18, height: 18, flex: "none", borderRadius: 5,
                  border: `1px solid ${visible ? "var(--accent-primary)" : "var(--border-strong)"}`,
                  background: visible ? "var(--accent-primary)" : "transparent",
                  color: "var(--text-on-accent)", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {visible && <Check size={13} strokeWidth={3} />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    font: "500 13px var(--font-sans)",
                    color: visible ? "var(--text-primary)" : "var(--text-tertiary)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                >
                  {item.label}
                </div>
                {item.meta && (
                  <div className="ds-caption" style={{ color: "var(--text-tertiary)", marginTop: 3 }}>
                    {item.meta}
                  </div>
                )}
              </div>

              <span className="ds-caption" style={{ flex: "none", color: "var(--text-tertiary)" }}>
                {visible ? "Shown" : "Hidden"}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
        <span className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
          Content itself is edited in My Data — this only controls what appears on this portfolio.
        </span>
        <div style={{ flex: 1 }} />
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => router.push(MY_DATA_PATH)}>
          Manage in My Data
        </button>
      </div>
    </div>
  );
}
