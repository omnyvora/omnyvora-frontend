"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { FieldError } from "@/shared/components/FieldError";
import { applyServerErrors } from "@/core/utils/applyServerErrors";
import { TemplateCreateFormSchema, type TemplateCreateFormValues } from "../types";

interface TemplateCreateDialogProps {
  open:      boolean;
  onClose:   () => void;
  onCreate:  (values: TemplateCreateFormValues, thumbnail: File | null) => void;
  isSaving:  boolean;
  saveError: unknown;
}

export function TemplateCreateDialog({ open, onClose, onCreate, isSaving, saveError }: TemplateCreateDialogProps) {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const form = useForm<TemplateCreateFormValues>({
    resolver: zodResolver(TemplateCreateFormSchema),
    defaultValues: { name: "", description: "", category: "" },
  });

  useEffect(() => {
    if (open) { form.reset({ name: "", description: "", category: "" }); setThumbnail(null); }
  }, [open, form]);

  useEffect(() => {
    if (saveError) applyServerErrors(form, saveError);
  }, [saveError, form]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 88, background: "rgba(17,17,17,0.45)" }} />
      <div
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 89,
          width: 520, maxWidth: "92vw", maxHeight: "88vh", overflowY: "auto",
          background: "var(--bg-overlay)", borderRadius: "var(--radius-modal)",
          border: "0.5px solid var(--border-default)", boxShadow: "var(--shadow-3)",
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "0.5px solid var(--border-default)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="ds-display-sm">New template</div>
            <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>
              Create the record first, then upload its HTML and declare its sections.
            </div>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="field">
            <label className="label">Name</label>
            <input className="input" placeholder="Monolith" {...form.register("name")} />
            <FieldError error={form.formState.errors.name} />
          </div>

          <div className="field">
            <label className="label">Category</label>
            <input className="input" placeholder="Minimal" {...form.register("category")} />
            <FieldError error={form.formState.errors.category} />
          </div>

          <div className="field">
            <label className="label">Description</label>
            <textarea
              className="input textarea"
              rows={3}
              placeholder="Single-column, type-led layout. Strong for writing-heavy portfolios."
              {...form.register("description")}
            />
            <FieldError error={form.formState.errors.description} />
          </div>

          <div className="field">
            <label className="label">Thumbnail</label>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: 14,
                borderRadius: "var(--radius-card)", border: "0.5px dashed var(--border-strong)",
                background: "var(--bg-surface)",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ds-body-sm" style={{ color: "var(--text-primary)" }}>
                  {thumbnail ? thumbnail.name : "No image selected"}
                </div>
                <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
                  JPG, PNG or WebP — shown on the template card.
                </div>
              </div>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              />
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => fileInput.current?.click()}>
                <Upload size={14} style={{ marginRight: 6 }} />Choose
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "0.5px solid var(--border-default)" }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={isSaving}
            onClick={form.handleSubmit((values) => onCreate(values, thumbnail))}
          >
            {isSaving ? "Creating…" : "Create template"}
          </button>
        </div>
      </div>
    </>
  );
}
