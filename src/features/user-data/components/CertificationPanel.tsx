"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award } from "lucide-react";
import { CertificationFormSchema, type CertificationFormValues } from "../types";
import type { CertificationUI } from "../transformers";
import { SidePanel } from "./SidePanel";

interface CertificationPanelProps {
  open:           boolean;
  certification:  CertificationUI | null;
  onClose:        () => void;
  onSave:         (values: CertificationFormValues, image: File | null) => void;
  isSaving:       boolean;
}

const BLANK: CertificationFormValues = { title: "", issuer: "", issue_date: "", credential_url: "" };

export function CertificationPanel({ open, certification, onClose, onSave, isSaving }: CertificationPanelProps) {
  const form = useForm<CertificationFormValues>({ resolver: zodResolver(CertificationFormSchema), defaultValues: BLANK });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    form.reset(certification
      ? { title: certification.title, issuer: certification.issuer, issue_date: certification.issueDate, credential_url: certification.credentialUrl }
      : BLANK);
    setImage(null);
    setPreview(certification?.image ?? null);
  }, [certification, open, form]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={certification ? "Edit certification" : "Add certification"}
      subtitle="Shared across every Omnyvora tool."
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn--primary" disabled={isSaving} onClick={form.handleSubmit((v) => onSave(v, image))}>
            {isSaving ? "Saving…" : "Save certification"}
          </button>
        </>
      }
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: 84, height: 84, flex: "none", borderRadius: "var(--radius-card)", border: "0.5px solid var(--border-default)",
            background: "var(--bg-surface)", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
          }}
        >
          {preview
            ? <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Award size={22} style={{ color: "var(--text-tertiary)" }} />}
        </button>
        <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>Click to upload the certificate image.</div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFileChange} />
      </div>

      <div className="field">
        <label className="label">Title</label>
        <input className="input" placeholder="Certified Kubernetes Administrator" {...form.register("title")} />
        {form.formState.errors.title && <div className="field-error">{form.formState.errors.title.message}</div>}
      </div>

      <div className="field">
        <label className="label">Issuer</label>
        <input className="input" placeholder="Issuing organization" {...form.register("issuer")} />
        {form.formState.errors.issuer && <div className="field-error">{form.formState.errors.issuer.message}</div>}
      </div>

      <div className="field">
        <label className="label">Issue date</label>
        <input className="input" type="date" {...form.register("issue_date")} />
        {form.formState.errors.issue_date && <div className="field-error">{form.formState.errors.issue_date.message}</div>}
      </div>

      <div className="field">
        <label className="label">Credential URL</label>
        <input className="input" placeholder="https://..." {...form.register("credential_url")} />
      </div>
    </SidePanel>
  );
}
