"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { useMyProfile, useUpdateProfile, useUploadAvatar } from "../hooks";
import { UpdateProfileFormSchema, type UpdateProfileFormValues } from "../types";
import type { ProfileUI } from "../transformers";

function fmtDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// ── View card ─────────────────────────────────────────────────────────────────

function ViewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span className="label" style={{ marginBottom: 0 }}>{label}</span>
      <span style={{ font: "400 14px var(--font-sans)", color: value ? "var(--text-primary)" : "var(--text-tertiary)" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function ProfileViewCard({ profile, onEdit }: { profile: ProfileUI; onEdit: () => void }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => { setImgError(false); }, [profile.avatar]);

  const initials = [profile.firstName[0], profile.lastName[0]]
    .filter(Boolean).join("").toUpperCase() || "?";

  return (
    <div className="card" style={{ maxWidth: 760 }}>
      <div className="card__header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="ds-display-sm">Public profile</div>
        <button
          type="button"
          onClick={onEdit}
          className="btn btn--secondary btn--sm"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Pencil size={13} />
          Edit profile
        </button>
      </div>

      <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Avatar + full name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--accent-primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "600 20px var(--font-sans)",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {profile.avatar && !imgError
              ? <img src={profile.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgError(true)} />
              : initials
            }
          </div>
          <div style={{ font: "600 16px var(--font-sans)", color: "var(--text-primary)" }}>
            {profile.fullName || "—"}
          </div>
        </div>

        {/* Field grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <ViewRow label="First name"    value={profile.firstName} />
          <ViewRow label="Last name"     value={profile.lastName} />
          <ViewRow label="Phone"         value={profile.phone} />
          <ViewRow label="Date of birth" value={fmtDate(profile.dob)} />
        </div>

        {/* Bio */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="label" style={{ marginBottom: 0 }}>Bio</span>
          <span
            style={{
              font: "400 14px var(--font-sans)",
              color: profile.bio ? "var(--text-primary)" : "var(--text-tertiary)",
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
            }}
          >
            {profile.bio || "—"}
          </span>
          <span className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
            Shared across all Omnyvora services.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Public profile section (view + edit) ──────────────────────────────────────

export function PublicProfileSection() {
  const [isEditing,     setIsEditing]     = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imgError, setImgError] = useState(false);

  const { data: profile, isLoading } = useMyProfile();
  const update       = useUpdateProfile();
  const avatarUpload = useUploadAvatar();

  useEffect(() => { setImgError(false); }, [profile?.avatar]);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: { first_name: "", last_name: "", phone: "", dob: "", bio: "" },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.firstName,
        last_name:  profile.lastName,
        phone:      profile.phone,
        dob:        profile.dob,
        bio:        profile.bio,
      });
    }
  }, [profile, form]);

  function handleCancel() {
    if (profile) {
      form.reset({
        first_name: profile.firstName,
        last_name:  profile.lastName,
        phone:      profile.phone,
        dob:        profile.dob,
        bio:        profile.bio,
      });
    }
    setIsEditing(false);
  }

  function handleAvatarChange(file: File) {
    avatarUpload.mutate(file, {
      onError: (err) => {
        toast.error("Photo upload failed", {
          description: describeApiError(err),
        });
      },
    });
  }

  async function onSubmit(values: UpdateProfileFormValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Profile saved", { description: "Your changes are live." });
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save", { description: describeApiError(err) });
    }
  }

  if (isLoading) {
    return (
      <div className="card" style={{ maxWidth: 760 }}>
        <div className="card__header"><div className="skel" style={{ height: 24, width: 160 }} /></div>
        <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 38 }} />)}
        </div>
      </div>
    );
  }

  if (!isEditing && profile) {
    return <ProfileViewCard profile={profile} onEdit={() => setIsEditing(true)} />;
  }

  const initials = [profile?.firstName[0], profile?.lastName[0]]
    .filter(Boolean).join("").toUpperCase() || "?";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="card" style={{ maxWidth: 760 }}>
        <div className="card__header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="ds-display-sm">Public profile</div>
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Cancel editing"
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-icon)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-tertiary)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Avatar upload */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{ position: "relative", width: 64, height: 64, flexShrink: 0, cursor: "pointer" }}
              onClick={() => !avatarUpload.isPending && fileInputRef.current?.click()}
              onMouseEnter={() => setAvatarHovered(true)}
              onMouseLeave={() => setAvatarHovered(false)}
              title="Change photo"
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--accent-primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  font: "600 22px var(--font-sans)",
                  overflow: "hidden",
                }}
              >
                {profile?.avatar && !imgError
                  ? <img src={profile.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgError(true)} />
                  : initials
                }
              </div>
              {(avatarHovered || avatarUpload.isPending) && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {avatarUpload.isPending
                    ? <Loader2 size={20} style={{ color: "#fff" }} className="animate-spin" />
                    : <Camera size={20} style={{ color: "#fff" }} />
                  }
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarChange(file);
                  e.target.value = "";
                }}
              />
            </div>
            <div>
              <div style={{ font: "500 14px var(--font-sans)", color: "var(--text-primary)" }}>
                Profile photo
              </div>
              <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
                {avatarUpload.isPending ? "Uploading…" : "Click photo to change · JPG, PNG, WebP"}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div className="field">
              <label className="label">First name</label>
              <div className="input-wrap">
                <input className={`input${form.formState.errors.first_name ? " input--error" : ""}`} {...form.register("first_name")} />
              </div>
              {form.formState.errors.first_name && (
                <div className="field-error">{form.formState.errors.first_name.message}</div>
              )}
            </div>
            <div className="field">
              <label className="label">Last name</label>
              <div className="input-wrap">
                <input className={`input${form.formState.errors.last_name ? " input--error" : ""}`} {...form.register("last_name")} />
              </div>
              {form.formState.errors.last_name && (
                <div className="field-error">{form.formState.errors.last_name.message}</div>
              )}
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <div className="input-wrap">
                <input className="input" type="tel" {...form.register("phone")} />
              </div>
            </div>
            <div className="field">
              <label className="label">Date of birth</label>
              <div className="input-wrap">
                <input className="input" type="date" {...form.register("dob")} />
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Bio</label>
            <textarea className="input textarea" style={{ minHeight: 104 }} {...form.register("bio")} />
            <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
              Shared across all Omnyvora services.
            </div>
          </div>
        </div>

        <div className="card__footer" style={{ display: "flex", gap: 10 }}>
          <button type="button" className="btn btn--secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

