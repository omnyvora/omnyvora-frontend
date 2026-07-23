"use client";

import { useState } from "react";
import { Award, Plus } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { useCertifications, useCreateCertification, useDeleteCertification, useReorderCertifications, useUpdateCertification } from "../hooks";
import type { CertificationFormValues } from "../types";
import type { CertificationUI } from "../transformers";
import { useDragReorder } from "../useDragReorder";
import { fmtMonthYear } from "../utils";
import { CertificationPanel } from "./CertificationPanel";
import { RowActions } from "./RowActions";
import { RowShell } from "./RowShell";

export function CertificationsManager() {
  const { data: certifications, isLoading } = useCertifications();
  const createCertification = useCreateCertification();
  const updateCertification  = useUpdateCertification();
  const deleteCertification  = useDeleteCertification();
  const reorder               = useReorderCertifications();

  const [panelItem, setPanelItem] = useState<CertificationUI | null | "new">(null);
  const [pendingDelete, setPendingDelete] = useState<CertificationUI | null>(null);

  const list = certifications ?? [];
  const orderedIds = list.map((c) => c.id);
  const drag = useDragReorder(orderedIds, (ids) => reorder.mutate(ids, {
    onError: () => toast.error("Couldn't save the new order", { description: "Reverted — try again." }),
  }));

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2].map((i) => <div key={i} className="skel" style={{ height: 72 }} />)}
      </div>
    );
  }

  const isSaving = createCertification.isPending || updateCertification.isPending;

  function handleSave(values: CertificationFormValues, image: File | null) {
    if (panelItem && panelItem !== "new") {
      updateCertification.mutate({ certificationId: panelItem.id, values: { ...values, image } }, {
        onSuccess: () => { toast.success("Certification updated"); setPanelItem(null); },
        onError: (err) => toast.error("Failed to save", { description: err instanceof Error ? err.message : "Unknown error" }),
      });
    } else {
      createCertification.mutate({ ...values, image }, {
        onSuccess: () => { toast.success("Certification added"); setPanelItem(null); },
        onError: (err) => toast.error("Failed to save", { description: err instanceof Error ? err.message : "Unknown error" }),
      });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn--secondary btn--sm" onClick={() => setPanelItem("new")}>
          <Plus size={14} /> Add certification
        </button>
      </div>

      {!list.length ? (
        <EmptyState
          icon={Award}
          title="No certifications added yet"
          desc="Add your certifications here. Shared across all Omnyvora services."
          actionLabel="Add certification"
          onAction={() => setPanelItem("new")}
        />
      ) : (
        list.map((x, i) => (
          <div key={x.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
            <RowShell
              dragProps={{ onDragStart: drag.onDragStart(i) }}
              icon={Award}
              thumb={
                x.image ? (
                  <img
                    src={x.image}
                    alt=""
                    style={{ width: 40, height: 40, flex: "none", objectFit: "cover", borderRadius: "var(--radius-icon)", border: "0.5px solid var(--border-default)" }}
                  />
                ) : undefined
              }
              title={x.title}
              extra={
                <>
                  <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
                    {x.issuer}{x.issueDate ? ` · Issued ${fmtMonthYear(x.issueDate)}` : ""}
                  </div>
                  {x.credentialUrl && (
                    <div className="ds-body-sm" style={{ color: "var(--accent-text)", font: "400 12px var(--font-mono)", marginTop: 4 }}>
                      {x.credentialUrl.replace("https://", "")}
                    </div>
                  )}
                </>
              }
              actions={<RowActions onEdit={() => setPanelItem(x)} onDelete={() => setPendingDelete(x)} />}
            />
          </div>
        ))
      )}

      <CertificationPanel
        open={panelItem !== null}
        certification={panelItem === "new" ? null : panelItem}
        onClose={() => setPanelItem(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <ConfirmModal
        config={
          pendingDelete
            ? ({
                title: "Delete this certification?",
                body: `"${pendingDelete.title}" will be removed from your profile.`,
                confirmLabel: "Delete certification",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteCertification.mutate(pendingDelete.id, { onSuccess: () => toast.error("Certification removed") });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
