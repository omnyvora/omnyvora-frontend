"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { SidePanel } from "@/shared/components/SidePanel";
import { FieldError } from "@/shared/components/FieldError";
import { applyServerErrors } from "@/core/utils/applyServerErrors";
import { PortfolioServiceFormSchema, type PortfolioServiceFormValues } from "../types";
import type { PortfolioServiceUI } from "../transformers";

interface ServiceFormPanelProps {
  open:      boolean;
  service:   PortfolioServiceUI | null;
  onClose:   () => void;
  onSave:    (values: PortfolioServiceFormValues) => void;
  isSaving:  boolean;
  saveError: unknown;
}

function BulletsField({
  value,
  onChange,
}: {
  value:    string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="field">
      <label className="label">Bullet points</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {value.map((bullet, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              value={bullet}
              placeholder="What this service includes"
              onChange={(e) => onChange(value.map((b, bi) => (bi === i ? e.target.value : b)))}
            />
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              style={{ width: 34, padding: 0, flex: "none" }}
              onClick={() => onChange(value.filter((_, bi) => bi !== i))}
            >
              <X size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          style={{ alignSelf: "flex-start" }}
          onClick={() => onChange([...value, ""])}
        >
          <Plus size={14} style={{ marginRight: 6 }} />Add bullet
        </button>
      </div>
    </div>
  );
}

export function ServiceFormPanel({ open, service, onClose, onSave, isSaving, saveError }: ServiceFormPanelProps) {
  const form = useForm<PortfolioServiceFormValues>({
    resolver: zodResolver(PortfolioServiceFormSchema),
    defaultValues: { title: "", description: "", bullets: [] },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      title:       service?.title ?? "",
      description: service?.description ?? "",
      bullets:     service?.bullets ?? [],
    });
  }, [service, open, form]);

  useEffect(() => {
    if (saveError) applyServerErrors(form, saveError);
  }, [saveError, form]);

  return (
    <SidePanel
      open={open}
      title={service ? "Edit service" : "Add service"}
      subtitle="Written for this portfolio only — not saved to My Data."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn--accent"
            disabled={isSaving}
            onClick={form.handleSubmit((values) =>
              onSave({ ...values, bullets: (values.bullets ?? []).filter((b) => b.trim() !== "") }),
            )}
          >
            {isSaving ? "Saving…" : service ? "Save changes" : "Add service"}
          </button>
        </>
      }
    >
      <div className="field">
        <label className="label">Title</label>
        <input className="input" placeholder="Product design retainer" {...form.register("title")} />
        <FieldError error={form.formState.errors.title} />
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="input textarea"
          rows={4}
          placeholder="Ongoing design partnership for teams shipping weekly."
          {...form.register("description")}
        />
        <FieldError error={form.formState.errors.description} />
      </div>

      <Controller
        control={form.control}
        name="bullets"
        render={({ field }) => (
          <BulletsField value={field.value ?? []} onChange={field.onChange} />
        )}
      />
    </SidePanel>
  );
}
