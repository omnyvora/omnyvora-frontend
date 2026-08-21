"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Pencil, Server, Trash2 } from "lucide-react";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import {
  useAdminServices,
  usePlatformServiceDetail,
  useToggleService,
  useUpdatePlatformService,
  useDeletePlatformService,
} from "../hooks";
import { ServiceFormDialog } from "../components/ServiceFormDialog";

interface AdminServiceDetailPageProps {
  slug: string;
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label" style={{ color: "var(--text-tertiary)", marginBottom: 4 }}>
        {label}
      </div>
      <div className="ds-body-md" style={{ color: "var(--text-primary)" }}>
        {value || "—"}
      </div>
    </div>
  );
}

export function AdminServiceDetailPage({ slug }: AdminServiceDetailPageProps) {
  const router = useRouter();
  const { data: service, isLoading, isError, error } = usePlatformServiceDetail(slug);
  const { data: services = [] } = useAdminServices();
  const toggleService = useToggleService();
  const updateService = useUpdatePlatformService();
  const deleteService = useDeletePlatformService();

  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const userCount = services.find((s) => s.slug === slug)?.userCount;

  if (isLoading) {
    return (
      <Page>
        <div className="skel" style={{ height: 56, width: 280 }} />
        <div className="skel" style={{ height: 260 }} />
      </Page>
    );
  }

  if (isError || !service) {
    return (
      <Page>
        <EmptyState
          icon={Server}
          title="Service not found"
          desc={describeApiError(error)}
          actionLabel="Back to services"
          onAction={() => router.push("/admin/services")}
        />
      </Page>
    );
  }

  return (
    <Page>
      <button
        type="button"
        className="link-accent ds-body-sm"
        onClick={() => router.push("/admin/services")}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <ArrowLeft size={14} /> Services
      </button>

      <PageHead
        title={service.name}
        subtitle={service.description}
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className={`badge ${service.is_active ? "badge--success" : "badge--neutral"}`}>
              {service.is_active ? "Active" : "Inactive"}
            </span>
            <a
              className="btn btn--secondary btn--sm"
              href={service.user_path}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} style={{ marginRight: 6 }} />
              Open app
            </a>
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => setFormOpen(true)}>
              <Pencil size={14} style={{ marginRight: 6 }} />
              Edit
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              style={{ color: "var(--status-error)" }}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={14} style={{ marginRight: 6 }} />
              Delete
            </button>
          </div>
        }
      />

      <div className="card card--raised" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="ds-display-sm" style={{ color: "var(--text-primary)" }}>
            Availability
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={service.is_active}
              disabled={toggleService.isPending}
              onChange={(e) => {
                toggleService.mutate(
                  { slug, isActive: e.target.checked },
                  {
                    onError: (err) =>
                      toast.error("Failed to update service", { description: describeApiError(err) }),
                  },
                );
              }}
            />
            <span className="track" />
            <span className="thumb" />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <InfoField label="Slug" value={service.slug} />
          <InfoField label="Category" value={service.category} />
          <InfoField label="Users" value={userCount !== undefined ? userCount.toLocaleString() : "—"} />
          <InfoField label="User path" value={service.user_path} />
          <InfoField label="Admin path" value={service.admin_path} />
          <InfoField label="Sort order" value={String(service.sort_order)} />
          <InfoField label="Created" value={new Date(service.created_at).toLocaleString()} />
          <InfoField label="Updated" value={new Date(service.updated_at).toLocaleString()} />
        </div>

        <div>
          <div className="label" style={{ color: "var(--text-tertiary)", marginBottom: 8 }}>
            Accent colours
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Primary", value: service.accent_primary },
              { label: "Text", value: service.accent_text },
              { label: "Subtle", value: service.accent_subtle },
              { label: "Subtle (dark)", value: service.accent_subtle_dark },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  aria-hidden
                  style={{
                    width: 22, height: 22, borderRadius: "var(--radius-icon)",
                    border: "0.5px solid var(--border-default)", background: value,
                  }}
                />
                <span className="ds-body-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ServiceFormDialog
        open={formOpen}
        service={service}
        onClose={() => setFormOpen(false)}
        onSave={(values) => {
          const { slug: _slug, ...data } = values;
          updateService.mutate(
            { slug, data },
            {
              onSuccess: () => { toast.success("Service updated"); setFormOpen(false); },
              onError: (err) => toast.error("Failed to update service", { description: describeApiError(err) }),
            },
          );
        }}
        isSaving={updateService.isPending}
      />

      <ConfirmModal
        config={
          confirmDelete
            ? ({
                title: "Delete this service?",
                body: `"${service.name}" will be removed from the catalog and hidden from every workspace grid.`,
                confirmLabel: "Delete service",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteService.mutate(slug, {
            onSuccess: () => {
              toast.success("Service deleted");
              router.push("/admin/services");
            },
            onError: (err) => toast.error("Failed to delete service", { description: describeApiError(err) }),
          });
          setConfirmDelete(false);
        }}
      />
    </Page>
  );
}
