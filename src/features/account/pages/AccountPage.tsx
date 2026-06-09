"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Lock, AlertTriangle, Eye, EyeOff, Mail, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/shared/auth/context";
import { useChangePassword } from "@/features/auth/hooks";
import { PasswordChangeFormSchema, type PasswordChangeFormValues } from "@/features/auth/types";
import { Page, PageHead, SubNav } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { ChangeEmailModal } from "../components/ChangeEmailModal";

// ── AccountGeneral ────────────────────────────────────────────────────────────

function AccountGeneral() {
  const { user } = useAuth();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <>
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card__header">
          <div className="ds-display-sm">General</div>
        </div>
        <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Email */}
          <div className="field">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label className="label" style={{ marginBottom: 0 }}>Email</label>
              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  font: "500 12px var(--font-sans)",
                  color: "var(--accent-text)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <Pencil size={13} />
                Edit
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 38, padding: "0 12px", background: "var(--bg-surface)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-input)" }}>
              <Mail size={16} style={{ color: "var(--text-tertiary)", flex: "none" }} />
              <span style={{ flex: 1, color: "var(--text-secondary)", font: "400 14px var(--font-sans)" }}>{user?.email}</span>
            </div>
          </div>

          {/* Account status */}
          <div className="field">
            <label className="label">Account status</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 38 }}>
              <span className="badge badge--success badge--md">Active</span>
              <span className="ds-body-sm" style={{ color: "var(--text-secondary)" }}>
                Your account is in good standing.
              </span>
            </div>
          </div>
        </div>
      </div>

      {emailModalOpen && (
        <ChangeEmailModal onClose={() => setEmailModalOpen(false)} />
      )}
    </>
  );
}

// ── AccountSecurity ───────────────────────────────────────────────────────────

function AccountSecurity() {
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCf,  setShowCf]  = useState(false);

  const changePassword = useChangePassword();

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(PasswordChangeFormSchema),
    defaultValues: { old_password: "", new_password: "", confirm_new_password: "" },
  });

  async function onSubmit(values: PasswordChangeFormValues) {
    try {
      await changePassword.mutateAsync({ old_password: values.old_password, new_password: values.new_password });
      form.reset();
      toast.success("Password updated", { description: "Use your new password next time you sign in." });
    } catch (err) {
      toast.error("Failed to update", { description: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card__header">
          <div className="ds-display-sm">Change password</div>
        </div>
        <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Current password */}
          <div className="field">
            <label className="label">Current password</label>
            <div className="input-wrap">
              <span className="input-icon input-icon--lead"><Lock size={16} /></span>
              <input
                className={`input input--has-lead input--has-trail${form.formState.errors.old_password ? " input--error" : ""}`}
                type={showCur ? "text" : "password"}
                placeholder="••••••••"
                {...form.register("old_password")}
              />
              <span className="input-icon input-icon--trail" style={{ pointerEvents: "auto", cursor: "pointer" }} onClick={() => setShowCur((s) => !s)}>
                {showCur ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
            {form.formState.errors.old_password && <div className="field-error">{form.formState.errors.old_password.message}</div>}
          </div>

          {/* New password */}
          <div className="field">
            <label className="label">New password</label>
            <div className="input-wrap">
              <span className="input-icon input-icon--lead"><Lock size={16} /></span>
              <input
                className={`input input--has-lead input--has-trail${form.formState.errors.new_password ? " input--error" : ""}`}
                type={showNew ? "text" : "password"}
                placeholder="At least 8 characters"
                {...form.register("new_password")}
              />
              <span className="input-icon input-icon--trail" style={{ pointerEvents: "auto", cursor: "pointer" }} onClick={() => setShowNew((s) => !s)}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
            {form.formState.errors.new_password && <div className="field-error">{form.formState.errors.new_password.message}</div>}
          </div>

          {/* Confirm password */}
          <div className="field">
            <label className="label">Confirm new password</label>
            <div className="input-wrap">
              <span className="input-icon input-icon--lead"><Lock size={16} /></span>
              <input
                className={`input input--has-lead input--has-trail${form.formState.errors.confirm_new_password ? " input--error" : ""}`}
                type={showCf ? "text" : "password"}
                placeholder="Re-enter new password"
                {...form.register("confirm_new_password")}
              />
              <span className="input-icon input-icon--trail" style={{ pointerEvents: "auto", cursor: "pointer" }} onClick={() => setShowCf((s) => !s)}>
                {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
            {form.formState.errors.confirm_new_password && (
              <div className="field-error">{form.formState.errors.confirm_new_password.message}</div>
            )}
          </div>

          <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
            Other sessions will remain active.
          </div>
        </div>
        <div className="card__footer">
          <button type="submit" className="btn btn--primary" disabled={changePassword.isPending}>
            {changePassword.isPending ? "Saving…" : "Save password"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ── AccountDanger ─────────────────────────────────────────────────────────────

function AccountDanger({ onConfirm }: { onConfirm: (cfg: ConfirmConfig) => void }) {
  return (
    <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="ds-display-sm" style={{ color: "var(--status-error)" }}>
        Danger zone
      </div>
      <div
        style={{
          borderRadius: "var(--radius-card)",
          overflow: "hidden",
          border: "0.5px solid color-mix(in srgb, var(--status-error) 35%, transparent)",
          background: "color-mix(in srgb, var(--status-error) 5%, var(--bg-surface-raised))",
        }}
      >
        {/* Deactivate */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "18px 20px",
            borderBottom: "0.5px solid color-mix(in srgb, var(--status-error) 22%, transparent)",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ font: "500 14px var(--font-sans)", color: "var(--text-primary)" }}>Deactivate account</div>
            <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
              Your account will be disabled. Reactivate by logging in.
            </div>
          </div>
          <button
            onClick={() => onConfirm({
              title: "Deactivate account?",
              body: "Your account will be disabled and hidden across Omnyvora. You can reactivate it any time by logging back in.",
              confirmLabel: "Deactivate",
              tone: "warning",
            })}
            style={{
              flex: "none",
              height: 36,
              padding: "0 16px",
              borderRadius: "var(--radius-button)",
              cursor: "pointer",
              background: "var(--bg-surface-raised)",
              border: "0.5px solid var(--status-warning)",
              color: "#92600c",
              font: "500 13px var(--font-sans)",
            }}
          >
            Deactivate account
          </button>
        </div>

        {/* Delete */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 20px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ font: "500 14px var(--font-sans)", color: "var(--text-primary)" }}>Delete account</div>
            <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 2 }}>
              Permanent. Cannot be undone. All data removed.
            </div>
          </div>
          <button
            className="btn btn--danger btn--sm"
            onClick={() => onConfirm({
              title: "Delete account?",
              body: "This is permanent and cannot be undone. All your data across every Omnyvora service will be removed.",
              confirmLabel: "Delete account",
              tone: "danger",
              requireType: true,
            })}
          >
            <AlertTriangle size={14} />
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AccountPage ───────────────────────────────────────────────────────────────

const SUB_NAV = [
  { id: "general",  label: "General",     icon: ShieldCheck },
  { id: "security", label: "Security",    icon: Lock },
  { id: "danger",   label: "Danger zone", icon: AlertTriangle },
];

export function AccountPage() {
  const [sub, setSub]           = useState("general");
  const [confirmCfg, setConfirmCfg] = useState<ConfirmConfig | null>(null);

  function handleConfirm() {
    toast.success("Action confirmed", { description: "This is a preview — no changes were made." });
    setConfirmCfg(null);
  }

  return (
    <Page>
      <PageHead title="Account" subtitle="Security and account settings." />
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
        <SubNav width={200} value={sub} onChange={setSub} items={SUB_NAV} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {sub === "general"  && <AccountGeneral />}
          {sub === "security" && <AccountSecurity />}
          {sub === "danger"   && <AccountDanger onConfirm={setConfirmCfg} />}
        </div>
      </div>

      <ConfirmModal
        config={confirmCfg}
        onClose={() => setConfirmCfg(null)}
        onConfirm={handleConfirm}
      />
    </Page>
  );
}
