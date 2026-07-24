"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyServerErrors } from "@/core/utils/applyServerErrors";
import { FieldError } from "@/shared/components/FieldError";
import { EducationFormSchema, type EducationFormValues } from "../types";
import type { EducationUI } from "../transformers";
import { useCertificationOptions } from "../hooks";
import { SidePanel } from "./SidePanel";
import { FormSelect } from "./FormSelect";

interface EducationPanelProps {
  open:      boolean;
  education: EducationUI | null;
  onClose:   () => void;
  onSave:    (values: EducationFormValues) => void;
  isSaving:  boolean;
  saveError?: unknown;
}

const BLANK: EducationFormValues = {
  degree: "", institution: "", department: "", gpa: null, gpa_scale: "4.00",
  certification_id: null, start_date: "", end_date: null,
};

function toFormValues(education: EducationUI): EducationFormValues {
  return {
    degree: education.degree,
    institution: education.institution,
    department: education.department,
    gpa: education.gpa,
    gpa_scale: education.gpaScale,
    certification_id: education.certificationId,
    start_date: education.startDate,
    end_date: education.endDate,
  };
}

export function EducationPanel({ open, education, onClose, onSave, isSaving, saveError }: EducationPanelProps) {
  const form = useForm<EducationFormValues>({ resolver: zodResolver(EducationFormSchema), defaultValues: BLANK });
  const { data: certificationOptions } = useCertificationOptions();

  useEffect(() => {
    form.reset(education ? toFormValues(education) : BLANK);
  }, [education, open, form]);

  useEffect(() => {
    if (saveError) applyServerErrors(form, saveError);
  }, [saveError, form]);

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={education ? "Edit education" : "Add education"}
      subtitle="Shared across every Omnyvora tool."
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn--primary" disabled={isSaving} onClick={form.handleSubmit(onSave)}>
            {isSaving ? "Saving…" : "Save education"}
          </button>
        </>
      }
    >
      <div className="field">
        <label className="label">Degree</label>
        <input className="input" placeholder="B.S. Computer Science" {...form.register("degree")} />
        {form.formState.errors.degree && <div className="field-error">{form.formState.errors.degree.message}</div>}
      </div>

      <div className="field">
        <label className="label">Institution</label>
        <input className="input" placeholder="University name" {...form.register("institution")} />
        {form.formState.errors.institution && <div className="field-error">{form.formState.errors.institution.message}</div>}
      </div>

      <div className="field">
        <label className="label">Department</label>
        <input className="input" placeholder="Optional" {...form.register("department")} />
        <FieldError error={form.formState.errors.department} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="field">
          <label className="label">Start date</label>
          <input className="input" type="date" {...form.register("start_date")} />
          {form.formState.errors.start_date && <div className="field-error">{form.formState.errors.start_date.message}</div>}
        </div>
        <div className="field">
          <label className="label">End date</label>
          <input className="input" type="date" {...form.register("end_date")} value={form.watch("end_date") ?? ""} />
          <FieldError error={form.formState.errors.end_date} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="field">
          <label className="label">GPA</label>
          <input className="input" placeholder="3.59" {...form.register("gpa")} value={form.watch("gpa") ?? ""} />
          <FieldError error={form.formState.errors.gpa} />
        </div>
        <div className="field">
          <label className="label">GPA scale</label>
          <input className="input" placeholder="4.00" {...form.register("gpa_scale")} value={form.watch("gpa_scale") ?? ""} />
          <FieldError error={form.formState.errors.gpa_scale} />
        </div>
      </div>

      <Controller
        control={form.control}
        name="certification_id"
        render={({ field }) => (
          <FormSelect
            label="Linked certification"
            placeholder="None"
            value={field.value ? String(field.value) : ""}
            onChange={(v) => field.onChange(v ? Number(v) : null)}
            options={(certificationOptions ?? []).map((c) => ({ value: String(c.id), label: c.title }))}
            hint="Optional — link a certification earned through this program."
          />
        )}
      />
      <FieldError error={form.formState.errors.certification_id} />
    </SidePanel>
  );
}
