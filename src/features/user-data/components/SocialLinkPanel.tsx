"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SOCIAL_PLATFORM_LABELS, SOCIAL_PLATFORMS, SocialLinkFormSchema, type SocialLinkFormValues } from "../types";
import type { SocialLinkUI } from "../transformers";
import { SidePanel } from "./SidePanel";
import { FormSelect } from "./FormSelect";

interface SocialLinkPanelProps {
  open:       boolean;
  socialLink: SocialLinkUI | null;
  onClose:    () => void;
  onSave:     (values: SocialLinkFormValues) => void;
  isSaving:   boolean;
}

const BLANK: SocialLinkFormValues = { platform: "github", label: "", url: "" };

export function SocialLinkPanel({ open, socialLink, onClose, onSave, isSaving }: SocialLinkPanelProps) {
  const form = useForm<SocialLinkFormValues>({ resolver: zodResolver(SocialLinkFormSchema), defaultValues: BLANK });

  useEffect(() => {
    form.reset(socialLink ? { platform: socialLink.platform, label: socialLink.label, url: socialLink.url } : BLANK);
  }, [socialLink, open, form]);

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={socialLink ? "Edit link" : "Add link"}
      subtitle="Shared across every Omnyvora tool."
      width={440}
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn--primary" disabled={isSaving} onClick={form.handleSubmit(onSave)}>
            {isSaving ? "Saving…" : "Save link"}
          </button>
        </>
      }
    >
      <Controller
        control={form.control}
        name="platform"
        render={({ field }) => (
          <FormSelect
            label="Platform"
            value={field.value}
            onChange={field.onChange}
            options={SOCIAL_PLATFORMS.map((p) => ({ value: p, label: SOCIAL_PLATFORM_LABELS[p] }))}
          />
        )}
      />

      <div className="field">
        <label className="label">Label</label>
        <input className="input" placeholder="Optional display name" {...form.register("label")} />
      </div>

      <div className="field">
        <label className="label">URL</label>
        <input className="input" placeholder="https://..." {...form.register("url")} />
        {form.formState.errors.url && <div className="field-error">{form.formState.errors.url.message}</div>}
      </div>
    </SidePanel>
  );
}
