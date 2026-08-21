"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, Plus } from "lucide-react";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { useDragReorder } from "@/core/hooks/useDragReorder";
import { RowShell } from "@/shared/components/RowShell";
import { RowActions } from "@/shared/components/RowActions";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import {
  useCreatePortfolioService,
  useDeletePortfolioService,
  useReorderPortfolioServices,
  useUpdatePortfolioService,
} from "../hooks";
import { ServiceFormPanel } from "./ServiceFormPanel";
import type { PortfolioServiceUI } from "../transformers";

interface ServicesPanelProps {
  instanceId: number;
  services:   PortfolioServiceUI[];
}

export function ServicesPanel({ instanceId, services }: ServicesPanelProps) {
  const createService = useCreatePortfolioService(instanceId);
  const updateService = useUpdatePortfolioService(instanceId);
  const deleteService = useDeletePortfolioService(instanceId);
  const reorderServices = useReorderPortfolioServices(instanceId);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioServiceUI | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PortfolioServiceUI | null>(null);

  const drag = useDragReorder(services.map((s) => s.id), (orderedIds) => {
    reorderServices.mutate(orderedIds, {
      onError: (err) => toast.error("Could not reorder services", { description: describeApiError(err) }),
    });
  });

  const saveError = editing ? updateService.error : createService.error;
  const isSaving = createService.isPending || updateService.isPending;

  function handleSave(values: Parameters<typeof createService.mutate>[0]) {
    const onError = (err: unknown) =>
      toast.error("Could not save service", { description: describeApiError(err) });

    if (editing) {
      updateService.mutate(
        { serviceId: editing.id, values },
        {
          onSuccess: () => { toast.success("Service updated"); setPanelOpen(false); setEditing(null); },
          onError,
        },
      );
    } else {
      createService.mutate(values, {
        onSuccess: () => { toast.success("Service added"); setPanelOpen(false); },
        onError,
      });
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span className="ds-caption" style={{ color: "var(--text-secondary)" }}>
          Services are written for this portfolio only — they are not pulled from My Data.
        </span>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={() => { setEditing(null); setPanelOpen(true); }}
        >
          <Plus size={14} style={{ marginRight: 6 }} />Add service
        </button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No services yet"
          desc="Describe what you offer — each service appears as a card in the services section of your portfolio."
          actionLabel="Add your first service"
          onAction={() => { setEditing(null); setPanelOpen(true); }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {services.map((service, i) => (
            <div key={service.id} onDragOver={drag.onDragOver()} onDrop={drag.onDrop(i)}>
              <RowShell
                dragProps={{ onDragStart: drag.onDragStart(i) }}
                icon={Briefcase}
                title={service.title}
                extra={
                  <>
                    {service.description && (
                      <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 5 }}>
                        {service.description}
                      </div>
                    )}
                    {service.bullets.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                        {service.bullets.map((b, bi) => (
                          <span key={bi} className="badge badge--neutral">{b}</span>
                        ))}
                      </div>
                    )}
                  </>
                }
                actions={
                  <RowActions
                    onEdit={() => { setEditing(service); setPanelOpen(true); }}
                    onDelete={() => setPendingDelete(service)}
                  />
                }
              />
            </div>
          ))}
        </div>
      )}

      <ServiceFormPanel
        open={panelOpen}
        service={editing}
        onClose={() => { setPanelOpen(false); setEditing(null); }}
        onSave={handleSave}
        isSaving={isSaving}
        saveError={saveError}
      />

      <ConfirmModal
        config={
          pendingDelete
            ? ({
                title: "Remove this service?",
                body: `"${pendingDelete.title}" will be removed from this portfolio's services section.`,
                confirmLabel: "Remove service",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteService.mutate(pendingDelete.id, {
            onSuccess: () => toast.success("Service removed"),
            onError: (err) => toast.error("Could not remove service", { description: describeApiError(err) }),
          });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
