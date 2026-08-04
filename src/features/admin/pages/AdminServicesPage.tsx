"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { Plus, Server } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import {
  useAdminServices,
  useToggleService,
  usePlatformServiceDetail,
  useCreatePlatformService,
  useUpdatePlatformService,
  useDeletePlatformService,
} from "../hooks";
import { ServiceAdminCard } from "../components/ServiceAdminCard";
import { ServiceFormDialog } from "../components/ServiceFormDialog";
import type { AdminServiceUI } from "../transformers";
import type { PlatformServiceFormValues } from "../types";

export function AdminServicesPage() {
  const router = useRouter();
  const { data: services = [], isLoading } = useAdminServices();
  const toggleService = useToggleService();
  const createService  = useCreatePlatformService();
  const updateService  = useUpdatePlatformService();
  const deleteService  = useDeletePlatformService();

  const [formOpen,   setFormOpen]   = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminServiceUI | null>(null);

  const { data: editingService } = usePlatformServiceDetail(editingSlug);

  function handleToggle(slug: string, isActive: boolean) {
    toggleService.mutate(
      { slug, isActive },
      {
        onError: (err) => {
          toast.error("Failed to update service", {
            description: describeApiError(err),
          });
        },
      },
    );
  }

  function openCreate() {
    setEditingSlug(null);
    setFormOpen(true);
  }

  function openEdit(slug: string) {
    setEditingSlug(slug);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingSlug(null);
  }

  function handleSave(values: PlatformServiceFormValues) {
    if (editingSlug) {
      const { slug: _slug, ...data } = values;
      updateService.mutate(
        { slug: editingSlug, data },
        {
          onSuccess: () => { toast.success("Service updated"); closeForm(); },
          onError: (err) => toast.error("Failed to update service", {
            description: describeApiError(err),
          }),
        },
      );
    } else {
      createService.mutate(values, {
        onSuccess: () => { toast.success("Service created"); closeForm(); },
        onError: (err) => toast.error("Failed to create service", {
          description: describeApiError(err),
        }),
      });
    }
  }

  return (
    <Page>
      <PageHead
        title="Services"
        subtitle={`${services.length} services · manage availability across the platform.`}
        action={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            <Plus size={16} style={{ marginRight: 6 }} />
            Add service
          </button>
        }
      />

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skel" style={{ height: 150 }} />)}
        </div>
      ) : services.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {services.map((service) => (
            <ServiceAdminCard
              key={service.id}
              service={service}
              disabled={toggleService.isPending}
              onToggle={(isActive) => handleToggle(service.slug, isActive)}
              onOpen={() => router.push(service.adminPath)}
              onEdit={() => openEdit(service.slug)}
              onDelete={() => setPendingDelete(service)}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={Server} title="No services yet" desc="Services will appear here once added to the catalog." />
      )}

      <ServiceFormDialog
        open={formOpen}
        service={editingSlug ? (editingService ?? null) : null}
        onClose={closeForm}
        onSave={handleSave}
        isSaving={createService.isPending || updateService.isPending}
      />

      <ConfirmModal
        config={
          pendingDelete
            ? ({
                title: "Delete this service?",
                body: `"${pendingDelete.name}" will be removed from the catalog and hidden from every workspace grid.`,
                confirmLabel: "Delete service",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteService.mutate(pendingDelete.slug, {
              onSuccess: () => toast.success("Service deleted"),
              onError: (err) => toast.error("Failed to delete service", {
                description: describeApiError(err),
              }),
            });
          }
          setPendingDelete(null);
        }}
      />
    </Page>
  );
}
