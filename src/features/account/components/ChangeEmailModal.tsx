"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, X, RefreshCw, Clock, Loader2 } from "lucide-react";
import { useRequestEmailChangeOtp, useChangeEmail } from "../hooks";
import { ChangeEmailSchema, type ChangeEmailValues } from "../types";

const RESEND_COOLDOWN_SECS = 60;

function useCountdown(start: number) {
  const [secs, setSecs] = useState(0);
  const running = useRef(false);

  function startCountdown() {
    setSecs(start);
    running.current = true;
  }

  useEffect(() => {
    if (!running.current || secs <= 0) return;
    const t = setTimeout(() => setSecs((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  return { secs, canResend: secs <= 0, startCountdown };
}

interface Props {
  onClose: () => void;
}

export function ChangeEmailModal({ onClose }: Props) {
  const [otpSent,   setOtpSent]   = useState(false);
  const [otpValue,  setOtpValue]  = useState("");

  const { secs, canResend, startCountdown } = useCountdown(RESEND_COOLDOWN_SECS);
  const requestOtp  = useRequestEmailChangeOtp();
  const changeEmail = useChangeEmail();

  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: { new_email: "", otp: "" },
  });

  const newEmail = form.watch("new_email");

  async function handleSendOtp() {
    const valid = await form.trigger("new_email");
    if (!valid) return;

    requestOtp.mutate(newEmail, {
      onSuccess: () => {
        setOtpSent(true);
        setOtpValue("");
        form.setValue("otp", "");
        startCountdown();
      },
    });
  }

  async function onSubmit(values: ChangeEmailValues) {
    try {
      await changeEmail.mutateAsync(values);
      onClose();
    } catch {
      // error surfaced via changeEmail.isError / changeEmail.error
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        background: "rgba(17,17,17,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "omFade .18s ease",
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 440,
          background: "var(--bg-overlay)",
          borderRadius: "var(--radius-modal)",
          boxShadow: "var(--shadow-3)",
          animation: "omPop .18s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Header */}
        <div
          className="card__header"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div className="ds-display-sm">Change email address</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
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

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Server-level error from changeEmail mutation */}
            {changeEmail.isError && (
              <p
                role="alert"
                style={{
                  margin: 0,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-input)",
                  background: "var(--status-error-bg)",
                  color: "var(--status-error)",
                  font: "400 13px var(--font-sans)",
                }}
              >
                {changeEmail.error.message}
              </p>
            )}

            {/* New email field */}
            <div className="field">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <label className="label" style={{ marginBottom: 0 }}>New email address</label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={requestOtp.isPending || (otpSent && !canResend)}
                  style={{
                    font: "500 11px var(--font-sans)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--accent-text)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    opacity: (otpSent && !canResend) ? 0.4 : 1,
                  }}
                >
                  {requestOtp.isPending
                    ? <Loader2 size={12} className="animate-spin" />
                    : otpSent ? "Resend OTP" : "Send OTP"
                  }
                </button>
              </div>
              <div className="input-wrap">
                <span className="input-icon input-icon--lead">
                  <Mail size={16} />
                </span>
                <input
                  className={`input input--has-lead${form.formState.errors.new_email ? " input--error" : ""}`}
                  type="email"
                  placeholder="new@example.com"
                  autoComplete="email"
                  {...form.register("new_email")}
                />
              </div>
              {requestOtp.isError && (
                <div className="field-error">{requestOtp.error.message}</div>
              )}
              {form.formState.errors.new_email && (
                <div className="field-error">{form.formState.errors.new_email.message}</div>
              )}
            </div>

            {/* OTP field — shown after OTP is sent */}
            {otpSent && (
              <div className="field">
                <label className="label">Verification code</label>
                <div className="input-wrap">
                  <input
                    className={`input${form.formState.errors.otp ? " input--error" : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpValue}
                    autoFocus
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtpValue(v);
                      form.setValue("otp", v, { shouldValidate: true });
                    }}
                    style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: 18, fontWeight: 600 }}
                  />
                </div>
                {form.formState.errors.otp && (
                  <div className="field-error">{form.formState.errors.otp.message}</div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                  <Clock size={12} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                  <span style={{ font: "400 11px var(--font-sans)", color: "var(--text-tertiary)" }}>
                    Sent to {newEmail} · Valid for 5 minutes
                  </span>
                </div>
                <div style={{ marginTop: 4 }}>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{
                        font: "500 13px var(--font-sans)",
                        color: "var(--accent-text)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <RefreshCw size={13} />
                      Resend OTP
                    </button>
                  ) : (
                    <span style={{ font: "400 13px var(--font-sans)", color: "var(--text-disabled)" }}>
                      Resend in {secs}s
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="card__footer"
            style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
          >
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={changeEmail.isPending || !otpSent}
              aria-busy={changeEmail.isPending}
            >
              {changeEmail.isPending
                ? <Loader2 size={14} className="animate-spin" style={{ display: "inline" }} />
                : "Change email"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
