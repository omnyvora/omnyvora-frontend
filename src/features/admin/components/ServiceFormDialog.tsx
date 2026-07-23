"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import type { PlatformService } from "@/features/catalog/types";
import { PlatformServiceFormSchema, type PlatformServiceFormValues } from "../types";

interface ServiceFormDialogProps {
  open:     boolean;
  service:  PlatformService | null; // null = create mode
  onClose:  () => void;
  onSave:   (values: PlatformServiceFormValues) => void;
  isSaving: boolean;
}

const BLANK: PlatformServiceFormValues = {
  slug: "", name: "", description: "", icon: "", category: "",
  user_path: "", admin_path: "",
  accent_primary: "", accent_subtle: "", accent_subtle_dark: "", accent_text: "",
  is_active: true, sort_order: 0,
};

function toFormValues(service: PlatformService): PlatformServiceFormValues {
  return {
    slug:        service.slug,
    name:        service.name,
    description: service.description,
    icon:        service.icon,
    category:    service.category,
    user_path:   service.user_path,
    admin_path:  service.admin_path,
    accent_primary:     service.accent_primary,
    accent_subtle:      service.accent_subtle,
    accent_subtle_dark: service.accent_subtle_dark,
    accent_text:        service.accent_text,
    is_active:  service.is_active,
    sort_order: service.sort_order,
  };
}

function ColorField({ label, name, form }: {
  label: string;
  name: keyof Pick<PlatformServiceFormValues, "accent_primary" | "accent_subtle" | "accent_subtle_dark" | "accent_text">;
  form: ReturnType<typeof useForm<PlatformServiceFormValues>>;
}) {
  const value = form.watch(name);
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          aria-hidden
          style={{
            width: 30, height: 30, flex: "none", borderRadius: "var(--radius-icon)",
            border: "0.5px solid var(--border-default)",
            background: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : "transparent",
          }}
        />
        <input className="input" placeholder="#2563EB" {...form.register(name)} />
      </div>
      {form.formState.errors[name] && (
        <div className="field-error">{form.formState.errors[name]?.message}</div>
      )}
    </div>
  );
}

export function ServiceFormDialog({ open, service, onClose, onSave, isSaving }: ServiceFormDialogProps) {
  const form = useForm<PlatformServiceFormValues>({
    resolver: zodResolver(PlatformServiceFormSchema),
    defaultValues: BLANK,
  });

  useEffect(() => {
    form.reset(service ? toFormValues(service) : BLANK);
  }, [service, open, form]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        background: "rgba(17,17,17,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "omFade .18s ease",
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-overlay)",
          borderRadius: "var(--radius-modal)",
          boxShadow: "var(--shadow-3)",
          animation: "omPop .18s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div
          className="card__header"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div className="ds-display-sm">{service ? "Edit service" : "Add service"}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "var(--radius-icon)", border: "none", background: "transparent",
              cursor: "pointer", color: "var(--text-tertiary)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSave)} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div
            className="card__body"
            style={{ display: "flex", flexDirection: "column", gap: 18, overflowY: "auto" }}
          >
            <div className="field">
              <label className="label">Slug</label>
              <input
                className="input"
                placeholder="cv-builder"
                disabled={!!service}
                {...form.register("slug")}
              />
              {form.formState.errors.slug && (
                <div className="field-error">{form.formState.errors.slug.message}</div>
              )}
            </div>

            <div className="field">
              <label className="label">Name</label>
              <input className="input" placeholder="CV Builder" {...form.register("name")} />
              {form.formState.errors.name && (
                <div className="field-error">{form.formState.errors.name.message}</div>
              )}
            </div>

            <div className="field">
              <label className="label">Description</label>
              <textarea
                className="input textarea"
                style={{ minHeight: 80 }}
                placeholder="Shown on the Applications card and dashboard grid."
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <div className="field-error">{form.formState.errors.description.message}</div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div className="field">
                <label className="label">Icon (Lucide, kebab-case)</label>
                <input className="input" placeholder="file-text" {...form.register("icon")} />
                {form.formState.errors.icon && (
                  <div className="field-error">{form.formState.errors.icon.message}</div>
                )}
              </div>
              <div className="field">
                <label className="label">Category</label>
                <input className="input" placeholder="Career" {...form.register("category")} />
                {form.formState.errors.category && (
                  <div className="field-error">{form.formState.errors.category.message}</div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div className="field">
                <label className="label">User path</label>
                <input className="input" placeholder="/cv-builder" {...form.register("user_path")} />
                {form.formState.errors.user_path && (
                  <div className="field-error">{form.formState.errors.user_path.message}</div>
                )}
              </div>
              <div className="field">
                <label className="label">Admin path</label>
                <input className="input" placeholder="/admin/services" {...form.register("admin_path")} />
                {form.formState.errors.admin_path && (
                  <div className="field-error">{form.formState.errors.admin_path.message}</div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <ColorField label="Accent primary" name="accent_primary" form={form} />
              <ColorField label="Accent text" name="accent_text" form={form} />
              <ColorField label="Accent subtle (light)" name="accent_subtle" form={form} />
              <ColorField label="Accent subtle (dark)" name="accent_subtle_dark" form={form} />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18 }}>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                <label className="label">Sort order</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  {...form.register("sort_order", { valueAsNumber: true })}
                />
                {form.formState.errors.sort_order && (
                  <div className="field-error">{form.formState.errors.sort_order.message}</div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 8 }}>
                <span style={{ font: "400 13px var(--font-sans)", color: "var(--text-secondary)" }}>
                  Active
                </span>
                <label className="switch">
                  <input type="checkbox" {...form.register("is_active")} />
                  <span className="track" />
                  <span className="thumb" />
                </label>
              </div>
            </div>
          </div>

          <div
            className="card__footer"
            style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
          >
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSaving} aria-busy={isSaving}>
              {isSaving ? "Saving…" : "Save service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
