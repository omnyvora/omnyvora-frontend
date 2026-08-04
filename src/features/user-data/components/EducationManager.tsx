"use client";

import { useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import { toast } from "sonner";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { useCreateEducation, useDeleteEducation, useEducations, useReorderEducations, useUpdateEducation } from "../hooks";
import type { EducationFormValues } from "../types";
import { toEducationRequest, type EducationUI } from "../transformers";
import { useDragReorder } from "../useDragReorder";
import { fmtMonthYear } from "../utils";
import { EducationPanel } from "./EducationPanel";
import { RowActions } from "./RowActions";
import { RowShell } from "./RowShell";

export function EducationManager() {
  const { data: educations, isLoading } = useEducations();
  const createEducation = useCreateEducation();
  const updateEducation  = useUpdateEducation();
  const deleteEducation  = useDeleteEducation();
  const reorder           = useReorderEducations();

  const [panelItem, setPanelItem] = useState<EducationUI | null | "new">(null);
  const [pendingDelete, setPendingDelete] = useState<EducationUI | null>(null);

  const list = educations ?? [];
  const orderedIds = list.map((e) => e.id);
  const drag = useDragReorder(orderedIds, (ids) => reorder.mutate(ids, {
    onError: () => toast.error("Couldn't save the new order", { description: "Reverted — try again." }),
  }));

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2].map((i) => <div key={i} className="skel" style={{ height: 80 }} />)}
      </div>
    );
  }

  const isSaving = createEducation.isPending || updateEducation.isPending;

  function handleSave(values: EducationFormValues) {
    const request = toEducationRequest(values);
    if (panelItem && panelItem !== "new") {
      updateEducation.mutate({ educationId: panelItem.id, values: request }, {
        onSuccess: () => { toast.success("Education updated"); setPanelItem(null); },
        onError: (err) => toast.error("Failed to save", { description: describeApiError(err) }),
      });
    } else {
      createEducation.mutate(request, {
        onSuccess: () => { toast.success("Education added"); setPanelItem(null); },
        onError: (err) => toast.error("Failed to save", { description: describeApiError(err) }),
      });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn--secondary btn--sm" onClick={() => setPanelItem("new")}>
          <Plus size={14} /> Add education
        </button>
      </div>

      {!list.length ? (
        <EmptyState
          icon={GraduationCap}
          title="No education added yet"
          desc="Add your education here. Shared across all Omnyvora services."
          actionLabel="Add education"
          onAction={() => setPanelItem("new")}
        />
      ) : (
        list.map((x, i) => (
          <div key={x.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
            <RowShell
              dragProps={{ onDragStart: drag.onDragStart(i) }}
              icon={GraduationCap}
              title={x.degree}
              meta={x.gpa && <span className="badge badge--neutral">GPA {x.gpa}/{x.gpaScale}</span>}
              extra={
                <>
                  <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
                    {x.institution}{x.department ? ` · ${x.department}` : ""}
                  </div>
                  <div className="ds-body-sm" style={{ color: "var(--text-tertiary)", marginTop: 2 }}>
                    {fmtMonthYear(x.startDate)} — {fmtMonthYear(x.endDate) || "Present"}
                  </div>
                </>
              }
              actions={<RowActions onEdit={() => setPanelItem(x)} onDelete={() => setPendingDelete(x)} />}
            />
          </div>
        ))
      )}

      <EducationPanel
        open={panelItem !== null}
        education={panelItem === "new" ? null : panelItem}
        onClose={() => setPanelItem(null)}
        onSave={handleSave}
        isSaving={isSaving}
        saveError={createEducation.error ?? updateEducation.error}
      />

      <ConfirmModal
        config={
          pendingDelete
            ? ({
                title: "Delete this education entry?",
                body: `"${pendingDelete.degree}" will be removed from your profile.`,
                confirmLabel: "Delete entry",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteEducation.mutate(pendingDelete.id, { onSuccess: () => toast.success("Education removed") });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
