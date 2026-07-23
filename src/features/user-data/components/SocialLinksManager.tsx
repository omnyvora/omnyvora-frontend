"use client";

import { useState } from "react";
import { Link as LinkIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { useCreateSocialLink, useDeleteSocialLink, useReorderSocialLinks, useSocialLinks, useUpdateSocialLink } from "../hooks";
import { SOCIAL_PLATFORM_LABELS, type SocialLinkFormValues } from "../types";
import type { SocialLinkUI } from "../transformers";
import { useDragReorder } from "../useDragReorder";
import { RowActions } from "./RowActions";
import { RowShell } from "./RowShell";
import { SocialLinkPanel } from "./SocialLinkPanel";

export function SocialLinksManager() {
  const { data: links, isLoading } = useSocialLinks();
  const createLink = useCreateSocialLink();
  const updateLink  = useUpdateSocialLink();
  const deleteLink  = useDeleteSocialLink();
  const reorder      = useReorderSocialLinks();

  const [panelItem, setPanelItem] = useState<SocialLinkUI | null | "new">(null);
  const [pendingDelete, setPendingDelete] = useState<SocialLinkUI | null>(null);

  const list = links ?? [];
  const orderedIds = list.map((l) => l.id);
  const drag = useDragReorder(orderedIds, (ids) => reorder.mutate(ids, {
    onError: () => toast.error("Couldn't save the new order", { description: "Reverted — try again." }),
  }));

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2].map((i) => <div key={i} className="skel" style={{ height: 64 }} />)}
      </div>
    );
  }

  const isSaving = createLink.isPending || updateLink.isPending;

  function handleSave(values: SocialLinkFormValues) {
    if (panelItem && panelItem !== "new") {
      updateLink.mutate({ socialLinkId: panelItem.id, values }, {
        onSuccess: () => { toast.success("Link updated"); setPanelItem(null); },
        onError: (err) => toast.error("Failed to save", { description: err instanceof Error ? err.message : "Unknown error" }),
      });
    } else {
      createLink.mutate(values, {
        onSuccess: () => { toast.success("Link added"); setPanelItem(null); },
        onError: (err) => toast.error("Failed to save", { description: err instanceof Error ? err.message : "Unknown error" }),
      });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn--secondary btn--sm" onClick={() => setPanelItem("new")}>
          <Plus size={14} /> Add link
        </button>
      </div>

      {!list.length ? (
        <EmptyState
          icon={LinkIcon}
          title="No social links added yet"
          desc="Add links to your profiles here. Shared across all Omnyvora services."
          actionLabel="Add link"
          onAction={() => setPanelItem("new")}
        />
      ) : (
        list.map((x, i) => (
          <div key={x.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
            <RowShell
              dragProps={{ onDragStart: drag.onDragStart(i) }}
              icon={LinkIcon}
              title={x.label || SOCIAL_PLATFORM_LABELS[x.platform]}
              meta={<span className="badge badge--neutral">{SOCIAL_PLATFORM_LABELS[x.platform]}</span>}
              extra={
                <div className="ds-body-sm" style={{ color: "var(--accent-text)", font: "400 12px var(--font-mono)", marginTop: 2 }}>
                  {x.url.replace("https://", "")}
                </div>
              }
              actions={<RowActions onEdit={() => setPanelItem(x)} onDelete={() => setPendingDelete(x)} />}
            />
          </div>
        ))
      )}

      <SocialLinkPanel
        open={panelItem !== null}
        socialLink={panelItem === "new" ? null : panelItem}
        onClose={() => setPanelItem(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <ConfirmModal
        config={
          pendingDelete
            ? ({
                title: "Delete this link?",
                body: `Your ${SOCIAL_PLATFORM_LABELS[pendingDelete.platform]} link will be removed from your profile.`,
                confirmLabel: "Delete link",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteLink.mutate(pendingDelete.id, { onSuccess: () => toast.error("Link removed") });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
