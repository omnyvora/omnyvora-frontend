"use client";

import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { toast } from "sonner";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { useCreateExperience, useDeleteExperience, useExperiences, useReorderExperiences, useUpdateExperience } from "../hooks";
import { toExperienceRequest } from "../transformers";
import type { ExperienceFormValues } from "../types";
import type { ExperienceUI } from "../transformers";
import { useDragReorder } from "@/core/hooks/useDragReorder";
import { fmtMonthYear } from "../utils";
import { ExperiencePanel } from "./ExperiencePanel";
import { RowActions } from "@/shared/components/RowActions";
import { RowShell } from "@/shared/components/RowShell";

export function ExperienceManager() {
  const { data: experiences, isLoading } = useExperiences();
  const createExperience = useCreateExperience();
  const updateExperience  = useUpdateExperience();
  const deleteExperience  = useDeleteExperience();
  const reorder           = useReorderExperiences();

  const [panelItem, setPanelItem] = useState<ExperienceUI | null | "new">(null);
  const [pendingDelete, setPendingDelete] = useState<ExperienceUI | null>(null);

  const list = experiences ?? [];
  const orderedIds = list.map((e) => e.id);
  const drag = useDragReorder(orderedIds, (ids) => reorder.mutate(ids, {
    onError: () => toast.error("Couldn't save the new order", { description: "Reverted — try again." }),
  }));

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2].map((i) => <div key={i} className="skel" style={{ height: 90 }} />)}
      </div>
    );
  }

  const isSaving = createExperience.isPending || updateExperience.isPending;

  function handleSave(values: ExperienceFormValues, isCurrent: boolean) {
    const request = toExperienceRequest(values, isCurrent);
    if (panelItem && panelItem !== "new") {
      updateExperience.mutate({ experienceId: panelItem.id, values: request }, {
        onSuccess: () => { toast.success("Experience updated"); setPanelItem(null); },
        onError: (err) => toast.error("Failed to save", { description: describeApiError(err) }),
      });
    } else {
      createExperience.mutate(request, {
        onSuccess: () => { toast.success("Experience added"); setPanelItem(null); },
        onError: (err) => toast.error("Failed to save", { description: describeApiError(err) }),
      });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn--secondary btn--sm" onClick={() => setPanelItem("new")}>
          <Plus size={14} /> Add experience
        </button>
      </div>

      {!list.length ? (
        <EmptyState
          icon={Briefcase}
          title="No experience added yet"
          desc="Add your work experience here. Shared across all Omnyvora services."
          actionLabel="Add experience"
          onAction={() => setPanelItem("new")}
        />
      ) : (
        list.map((x, i) => (
          <div key={x.id} onDragOver={drag.onDragOver()} onDrop={drag.onDrop(i)}>
            <RowShell
              dragProps={{ onDragStart: drag.onDragStart(i) }}
              icon={Briefcase}
              title={`${x.jobTitle} @ ${x.companyName}`}
              meta={x.isCurrent && <span className="badge badge--success">Current</span>}
              extra={
                <>
                  <div className="ds-body-sm" style={{ color: "var(--text-tertiary)", marginTop: 2 }}>
                    {fmtMonthYear(x.startDate)} — {x.isCurrent ? "Present" : fmtMonthYear(x.endDate)}{x.location ? ` · ${x.location}` : ""}
                  </div>
                  <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 8 }}>{x.description}</div>
                  {(x.skills.length > 0 || x.technologies.length > 0) && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                      {x.skills.map((s) => <span key={`skill-${s}`} className="badge badge--accent">{s}</span>)}
                      {x.technologies.map((t) => <span key={`tech-${t}`} className="badge badge--neutral">{t}</span>)}
                    </div>
                  )}
                </>
              }
              actions={<RowActions onEdit={() => setPanelItem(x)} onDelete={() => setPendingDelete(x)} />}
            />
          </div>
        ))
      )}

      <ExperiencePanel
        open={panelItem !== null}
        experience={panelItem === "new" ? null : panelItem}
        onClose={() => setPanelItem(null)}
        onSave={handleSave}
        isSaving={isSaving}
        saveError={createExperience.error ?? updateExperience.error}
      />

      <ConfirmModal
        config={
          pendingDelete
            ? ({
                title: "Delete this experience?",
                body: `"${pendingDelete.jobTitle} @ ${pendingDelete.companyName}" will be removed from your profile.`,
                confirmLabel: "Delete experience",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteExperience.mutate(pendingDelete.id, { onSuccess: () => toast.success("Experience removed") });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
