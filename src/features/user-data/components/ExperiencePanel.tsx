"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyServerErrors } from "@/core/utils/applyServerErrors";
import { FieldError } from "@/shared/components/FieldError";
import { ExperienceFormSchema, type ExperienceFormValues } from "../types";
import type { ExperienceUI } from "../transformers";
import { SidePanel } from "./SidePanel";
import { TagInput } from "./TagInput";
import { FormCheckbox } from "./FormCheckbox";

interface ExperiencePanelProps {
  open:       boolean;
  experience: ExperienceUI | null;
  onClose:    () => void;
  onSave:     (values: ExperienceFormValues, isCurrent: boolean) => void;
  isSaving:   boolean;
  saveError?: unknown;
}

const BLANK: ExperienceFormValues = {
  job_title: "", company_name: "", company_url: "", location: "", description: "",
  technology_names: [], start_date: "", end_date: null,
};

function toFormValues(experience: ExperienceUI): ExperienceFormValues {
  return {
    job_title: experience.jobTitle,
    company_name: experience.companyName,
    company_url: experience.companyUrl,
    location: experience.location,
    description: experience.description,
    technology_names: experience.technologies,
    start_date: experience.startDate,
    end_date: experience.endDate,
  };
}

export function ExperiencePanel({ open, experience, onClose, onSave, isSaving, saveError }: ExperiencePanelProps) {
  const form = useForm<ExperienceFormValues>({ resolver: zodResolver(ExperienceFormSchema), defaultValues: BLANK });
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    form.reset(experience ? toFormValues(experience) : BLANK);
    setIsCurrent(experience ? experience.isCurrent : false);
  }, [experience, open, form]);

  useEffect(() => {
    if (saveError) applyServerErrors(form, saveError);
  }, [saveError, form]);

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={experience ? "Edit experience" : "Add experience"}
      subtitle="Shared across every Omnyvora tool."
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn--primary" disabled={isSaving} onClick={form.handleSubmit((v) => onSave(v, isCurrent))}>
            {isSaving ? "Saving…" : "Save experience"}
          </button>
        </>
      }
    >
      <div className="field">
        <label className="label">Job title</label>
        <input className="input" placeholder="Senior Product Designer" {...form.register("job_title")} />
        {form.formState.errors.job_title && <div className="field-error">{form.formState.errors.job_title.message}</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="field">
          <label className="label">Company</label>
          <input className="input" placeholder="Company name" {...form.register("company_name")} />
          {form.formState.errors.company_name && <div className="field-error">{form.formState.errors.company_name.message}</div>}
        </div>
        <div className="field">
          <label className="label">Company URL</label>
          <input className="input" placeholder="https://..." {...form.register("company_url")} />
          <FieldError error={form.formState.errors.company_url} />
        </div>
      </div>

      <div className="field">
        <label className="label">Location</label>
        <input className="input" placeholder="City, Country / Remote" {...form.register("location")} />
        <FieldError error={form.formState.errors.location} />
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea className="input textarea" style={{ minHeight: 88 }} placeholder="What you worked on" {...form.register("description")} />
      </div>

      <Controller
        control={form.control}
        name="technology_names"
        render={({ field }) => (
          <TagInput label="Technologies" value={field.value ?? []} onChange={field.onChange} placeholder="Add a technology and press Enter" />
        )}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="field">
          <label className="label">Start date</label>
          <input className="input" type="date" {...form.register("start_date")} />
          {form.formState.errors.start_date && <div className="field-error">{form.formState.errors.start_date.message}</div>}
        </div>
        <div className="field">
          <label className="label">End date</label>
          <input className="input" type="date" disabled={isCurrent} {...form.register("end_date")} value={form.watch("end_date") ?? ""} />
          <FieldError error={form.formState.errors.end_date} />
        </div>
      </div>

      <FormCheckbox
        label="I currently work here"
        checked={isCurrent}
        onChange={(checked) => { setIsCurrent(checked); if (checked) form.setValue("end_date", null); }}
      />
    </SidePanel>
  );
}
