"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { applyServerErrors } from "@/core/utils/applyServerErrors";
import { FieldError } from "@/shared/components/FieldError";
import { ProjectFormSchema, type ProjectFormValues } from "../types";
import type { ProjectUI } from "../transformers";
import { SidePanel } from "@/shared/components/SidePanel";
import { TagInput } from "./TagInput";
import { FormCheckbox } from "@/shared/components/FormCheckbox";
import { GalleryField } from "./GalleryField";

interface ProjectPanelProps {
  open:     boolean;
  project:  ProjectUI | null; // null = create mode
  onClose:  () => void;
  onSave:   (values: ProjectFormValues) => void;
  isSaving: boolean;
  saveError?: unknown; // last failed create/update mutation — mapped onto form fields below
}

const BLANK: ProjectFormValues = {
  title: "", short_description: "", description: "", achievements: [],
  technology_names: [], skill_names: [], github_url: "", live_url: "", is_featured: false,
};

function toFormValues(project: ProjectUI): ProjectFormValues {
  return {
    title: project.title,
    short_description: project.shortDescription,
    description: project.description,
    achievements: project.achievements,
    technology_names: project.technologies,
    skill_names: project.skills,
    github_url: project.githubUrl,
    live_url: project.liveUrl,
    is_featured: project.isFeatured,
  };
}

export function ProjectPanel({ open, project, onClose, onSave, isSaving, saveError }: ProjectPanelProps) {
  const form = useForm<ProjectFormValues>({ resolver: zodResolver(ProjectFormSchema), defaultValues: BLANK });

  useEffect(() => {
    form.reset(project ? toFormValues(project) : BLANK);
  }, [project, open, form]);

  // Backend validation the Zod schema can't replicate (e.g. malformed URLs) still
  // needs to land on the right field, not just a generic toast.
  useEffect(() => {
    if (saveError) applyServerErrors(form, saveError);
  }, [saveError, form]);

  const shortDescription = form.watch("short_description") ?? "";

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={project ? "Edit project" : "Add project"}
      subtitle="Shared across every Omnyvora tool."
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn--primary" disabled={isSaving} onClick={form.handleSubmit(onSave)}>
            {isSaving ? "Saving…" : "Save project"}
          </button>
        </>
      }
    >
      <div className="field">
        <label className="label">Title</label>
        <input className="input" placeholder="Project title" {...form.register("title")} />
        {form.formState.errors.title && <div className="field-error">{form.formState.errors.title.message}</div>}
      </div>

      <div className="field">
        <label className="label">Short description</label>
        <input
          className="input"
          placeholder="One line, shown on the project card"
          {...form.register("short_description")}
          maxLength={300}
        />
        <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>{shortDescription.length}/300</div>
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea className="input textarea" style={{ minHeight: 96 }} placeholder="Full write-up" {...form.register("description")} />
      </div>

      <Controller
        control={form.control}
        name="achievements"
        render={({ field }) => (
          <div className="field">
            <label className="label">Achievements</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(field.value ?? []).map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <input
                    className="input"
                    style={{ flex: 1 }}
                    value={a}
                    placeholder="Shipped a feature that…"
                    onChange={(e) => {
                      const next = [...(field.value ?? [])];
                      next[i] = e.target.value;
                      field.onChange(next);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    style={{ width: 36, padding: 0, flex: "none" }}
                    onClick={() => field.onChange((field.value ?? []).filter((_, idx) => idx !== i))}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                style={{ alignSelf: "flex-start" }}
                onClick={() => field.onChange([...(field.value ?? []), ""])}
              >
                Add achievement
              </button>
            </div>
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="skill_names"
        render={({ field }) => (
          <TagInput kind="skill" label="Skills" value={field.value ?? []} onChange={field.onChange} placeholder="Add a skill and press Enter" />
        )}
      />

      <Controller
        control={form.control}
        name="technology_names"
        render={({ field }) => (
          <TagInput kind="technology" label="Technologies" value={field.value ?? []} onChange={field.onChange} placeholder="Add a technology and press Enter" />
        )}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="field">
          <label className="label">GitHub URL</label>
          <input className="input" placeholder="https://github.com/..." {...form.register("github_url")} />
          <FieldError error={form.formState.errors.github_url} />
        </div>
        <div className="field">
          <label className="label">Live URL</label>
          <input className="input" placeholder="https://..." {...form.register("live_url")} />
          <FieldError error={form.formState.errors.live_url} />
        </div>
      </div>

      <GalleryField projectId={project?.id ?? null} images={project?.images ?? []} />

      <Controller
        control={form.control}
        name="is_featured"
        render={({ field }) => (
          <FormCheckbox label="Feature this project on my public profile" checked={!!field.value} onChange={field.onChange} />
        )}
      />
    </SidePanel>
  );
}
