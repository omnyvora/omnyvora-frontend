"use client";

import { useState } from "react";
import { Folder, Plus } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { useCreateProject, useDeleteProject, useProjects, useReorderProjects, useUpdateProject } from "../hooks";
import type { ProjectFormValues } from "../types";
import type { ProjectUI } from "../transformers";
import { useDragReorder } from "../useDragReorder";
import { ProjectPanel } from "./ProjectPanel";
import { RowActions } from "./RowActions";
import { RowShell } from "./RowShell";

export function ProjectsManager() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject  = useUpdateProject();
  const deleteProject  = useDeleteProject();
  const reorder        = useReorderProjects();

  const [panelProject, setPanelProject] = useState<ProjectUI | null | "new">(null);
  const [pendingDelete, setPendingDelete] = useState<ProjectUI | null>(null);

  const list = projects ?? [];
  const orderedIds = list.map((p) => p.id);
  const drag = useDragReorder(orderedIds, (ids) => reorder.mutate(ids, {
    onError: () => toast.error("Couldn't save the new order", { description: "Reverted — try again." }),
  }));

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 90 }} />)}
      </div>
    );
  }

  const isSaving = createProject.isPending || updateProject.isPending;

  function handleSave(values: ProjectFormValues) {
    if (panelProject && panelProject !== "new") {
      updateProject.mutate({ projectId: panelProject.id, values }, {
        onSuccess: () => { toast.success("Project updated"); setPanelProject(null); },
        onError: (err) => toast.error("Failed to save", { description: err instanceof Error ? err.message : "Unknown error" }),
      });
    } else {
      createProject.mutate(values, {
        onSuccess: () => { toast.success("Project added"); setPanelProject(null); },
        onError: (err) => toast.error("Failed to save", { description: err instanceof Error ? err.message : "Unknown error" }),
      });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn--secondary btn--sm" onClick={() => setPanelProject("new")}>
          <Plus size={14} /> Add project
        </button>
      </div>

      {!list.length ? (
        <EmptyState
          icon={Folder}
          title="No projects added yet"
          desc="Add your projects here. Shared across all Omnyvora services."
          actionLabel="Add project"
          onAction={() => setPanelProject("new")}
        />
      ) : (
        list.map((p, i) => (
          <div key={p.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
            <RowShell
              dragProps={{ onDragStart: drag.onDragStart(i) }}
              icon={Folder}
              title={p.title}
              meta={
                <>
                  {p.isFeatured && <span className="badge badge--accent">Featured</span>}
                  {p.images.length > 0 && <span className="badge badge--neutral">{p.images.length} photo{p.images.length > 1 ? "s" : ""}</span>}
                </>
              }
              extra={
                <>
                  <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>{p.shortDescription}</div>
                  {p.technologies.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                      {p.technologies.map((t) => <span key={t} className="badge badge--neutral">{t}</span>)}
                    </div>
                  )}
                </>
              }
              actions={
                <RowActions
                  onEdit={() => setPanelProject(p)}
                  onDelete={() => setPendingDelete(p)}
                />
              }
            />
          </div>
        ))
      )}

      <ProjectPanel
        open={panelProject !== null}
        project={panelProject === "new" ? null : panelProject}
        onClose={() => setPanelProject(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <ConfirmModal
        config={
          pendingDelete
            ? ({
                title: "Delete this project?",
                body: `"${pendingDelete.title}" will be removed from your profile and every tool that references it.`,
                confirmLabel: "Delete project",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteProject.mutate(pendingDelete.id, { onSuccess: () => toast.error("Project removed") });
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
