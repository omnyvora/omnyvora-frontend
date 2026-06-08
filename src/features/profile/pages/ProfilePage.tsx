"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Star, Folder, GraduationCap, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Page, PageHead, SubNav, Tabs, EmptyState } from "@/shared/workspace/components/ui";
import { useMyProfile, useUpdateProfile } from "../hooks";
import { UpdateProfileFormSchema, type UpdateProfileFormValues } from "../types";

// ── Public Profile form ───────────────────────────────────────────────────────

function PublicProfileForm() {
  const { data: profile, isLoading } = useMyProfile();
  const update = useUpdateProfile();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: { first_name: "", last_name: "", phone: "", dob: "", bio: "" },
  });

  // Populate form once profile data arrives from the server
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

  async function onSubmit(values: UpdateProfileFormValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Profile saved", { description: "Your changes are live." });
    } catch (err) {
      toast.error("Failed to save", { description: err instanceof Error ? err.message : "Unknown error" });
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="card" style={{ maxWidth: 760 }}>
        <div className="card__header">
          <div className="ds-display-sm">Public profile</div>
        </div>
        <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
        <div className="card__footer">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={update.isPending}
          >
            {update.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Identity panel ────────────────────────────────────────────────────────────

function IdentityPanel() {
  const [tab, setTab] = useState("projects");

  const tabs = [
    { id: "projects",   label: "Projects",   icon: Folder,       count: 0 },
    { id: "education",  label: "Education",  icon: GraduationCap, count: 0 },
    { id: "experience", label: "Experience", icon: Briefcase,     count: 0 },
    { id: "skills",     label: "Skills",     icon: Star,          count: 0 },
  ];

  const emptyProps: Record<string, { icon: typeof Folder; title: string; desc: string }> = {
    projects:   { icon: Folder,        title: "No projects added yet",   desc: "Add your projects here. Shared across all Omnyvora services." },
    education:  { icon: GraduationCap, title: "No education added yet",  desc: "Add your education here. Shared across all Omnyvora services." },
    experience: { icon: Briefcase,     title: "No experience added yet", desc: "Add your experience here. Shared across all Omnyvora services." },
    skills:     { icon: Star,          title: "No skills added yet",     desc: "Add your skills here. Shared across all Omnyvora services." },
  };

  const current = emptyProps[tab];

  return (
    <div className="card" style={{ maxWidth: 820 }}>
      <div style={{ padding: "6px 20px 0" }}>
        <Tabs items={tabs} value={tab} onChange={setTab} />
      </div>
      <div style={{ padding: 24 }}>
        {current && (
          <EmptyState
            icon={current.icon}
            title={current.title}
            desc={current.desc}
            actionLabel={`Add ${tab}`}
            onAction={() => toast.info(`Add ${tab}`, { description: "This flow is coming soon." })}
          />
        )}
      </div>
    </div>
  );
}

// ── ProfilePage ───────────────────────────────────────────────────────────────

const SUB_NAV = [
  { id: "public",   label: "Public profile", icon: User },
  { id: "identity", label: "Identity",       icon: Star },
];

export function ProfilePage() {
  const [sub, setSub] = useState("public");

  return (
    <Page>
      <PageHead title="Profile" subtitle="Manage how you appear across Omnyvora." />
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
        <SubNav width={200} value={sub} onChange={setSub} items={SUB_NAV} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {sub === "public"   && <PublicProfileForm />}
          {sub === "identity" && <IdentityPanel />}
        </div>
      </div>
    </Page>
  );
}
