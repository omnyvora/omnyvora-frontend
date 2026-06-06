"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft, RefreshCw, CheckCircle, Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input }  from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useRequestOtp, useResetPassword } from "../hooks";
import {
  PasswordResetFormSchema,
  type PasswordResetFormValues,
} from "../types";
import {
  STRINGS,
  AUTH_ROUTES,
  OTP_PURPOSE,
  OTP_CHANNEL,
  OTP_RESEND_COOLDOWN_SECS,
} from "../constants";
import { AuthLayout } from "./AuthLayout";
import { OtpInput } from "./OtpInput";

// ── Step indicator ────────────────────────────────────────────────────────────

const STEP_LABELS = ["Request OTP", "Verify OTP", "New password"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-start w-full">
      {STEP_LABELS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-start flex-1">
            <div className="flex flex-col items-center gap-2 flex-none w-24">
              <div
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px] font-medium border-[1.5px] transition-all duration-[var(--duration-base)]"
                style={{
                  background:   done || active ? "var(--accent-primary)" : "var(--bg-surface)",
                  borderColor:  done || active ? "var(--accent-primary)" : "var(--border-strong)",
                  color:        done || active ? "var(--text-on-accent)"  : "var(--text-tertiary)",
                }}
              >
                {done ? <CheckCircle size={15} strokeWidth={2.4} /> : i + 1}
              </div>
              <span
                className="text-[11px] font-medium tracking-[0.04em] text-center leading-[1.3]"
                style={{ color: active ? "var(--text-primary)" : "var(--text-tertiary)" }}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className="flex-1 h-0.5 mt-[14px] rounded-full transition-colors duration-[var(--duration-base)]"
                style={{ background: i < current ? "var(--accent-primary)" : "var(--border-default)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Countdown hook ────────────────────────────────────────────────────────────

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

// ── Password strength ─────────────────────────────────────────────────────────

function scorePassword(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return (Math.min(s, 4) || (pw.length ? 1 : 0)) as 0 | 1 | 2 | 3 | 4;
}

const STRENGTH_META = [
  { label: "",            color: "var(--border-default)" },
  { label: "Weak",        color: "var(--status-error)"   },
  { label: "Fair",        color: "var(--status-warning)"  },
  { label: "Strong",      color: "var(--status-info)"    },
  { label: "Very strong", color: "var(--status-success)" },
] as const;

// ── Orchestrator ──────────────────────────────────────────────────────────────

export function PasswordResetForm() {
  const [step, setStep]       = useState<0 | 1 | 2>(0);
  const [success, setSuccess] = useState(false);
  const [sharedEmail, setSharedEmail] = useState("");
  const [sharedOtp, setSharedOtp]     = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwScore, setPwScore]         = useState<0 | 1 | 2 | 3 | 4>(0);

  const { secs, canResend, startCountdown } = useCountdown(OTP_RESEND_COOLDOWN_SECS);
  const requestOtp  = useRequestOtp();
  const resetPw     = useResetPassword();

  const form = useForm<PasswordResetFormValues>({
    resolver:      zodResolver(PasswordResetFormSchema),
    defaultValues: { email: "", otp: "", new_password: "", confirm_new_password: "" },
  });

  // ── Step 1: send OTP ──
  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    const valid = await form.trigger("email");
    if (!valid) return;

    const email = form.getValues("email");
    requestOtp.mutate(
      {
        purpose:         OTP_PURPOSE.passwordReset,
        user_identifier: email,
        otp_channel:     OTP_CHANNEL.email,
      },
      {
        onSuccess: () => {
          setSharedEmail(email);
          startCountdown();
          setStep(1);
        },
      },
    );
  }

  // ── Step 2: advance to password step ──
  function handleStep2() {
    if (sharedOtp.length < 6) {
      form.setError("otp", { message: "Please enter the 6-digit code" });
      return;
    }
    setSharedOtp(form.getValues("otp"));
    setStep(2);
  }

  function handleResend() {
    requestOtp.mutate(
      {
        purpose:         OTP_PURPOSE.passwordReset,
        user_identifier: sharedEmail,
        otp_channel:     OTP_CHANNEL.email,
      },
      { onSuccess: startCountdown },
    );
  }

  // ── Step 3: reset password ──
  function handleStep3(values: PasswordResetFormValues) {
    resetPw.mutate(
      { email: sharedEmail, otp: sharedOtp, new_password: values.new_password },
      { onSuccess: () => setSuccess(true) },
    );
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center gap-[var(--space-6)] py-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "var(--status-success-bg)",
              color:      "var(--status-success)",
            }}
          >
            <CheckCircle size={30} strokeWidth={1.9} />
          </div>
          <div>
            <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.4px] text-[var(--text-primary)] m-0">
              {STRINGS.resetPassword.successTitle}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-[320px] leading-relaxed">
              {STRINGS.resetPassword.successBody}
            </p>
          </div>
          <Button className="w-full" asChild>
            <a href={AUTH_ROUTES.login}>{STRINGS.resetPassword.successCta}</a>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout maxWidth={520}>
      <div className="px-1 py-1">
        <StepIndicator current={step} />
      </div>

      <Form {...form}>
        <form noValidate>
          {/* ── Step 1 ── */}
          {step === 0 && (
            <div className="flex flex-col gap-[var(--space-5)]">
              <div className="text-center">
                <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.4px] text-[var(--text-primary)] m-0">
                  {STRINGS.resetPassword.step1Title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                  {STRINGS.resetPassword.step1Subtitle}
                </p>
              </div>

              {requestOtp.isError && (
                <p role="alert" className="text-[13px] text-[var(--status-error)] bg-[var(--status-error-bg)] rounded-[var(--radius-input)] px-3 py-2">
                  {requestOtp.error.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                        <Input {...field} type="email" placeholder="you@example.com" autoComplete="email" className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="w-full"
                onClick={handleStep1}
                disabled={requestOtp.isPending}
              >
                {requestOtp.isPending ? <Loader2 size={16} className="animate-spin" /> : STRINGS.resetPassword.step1Submit}
              </Button>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 1 && (
            <div className="flex flex-col gap-[var(--space-5)]">
              <div className="text-center">
                <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.4px] text-[var(--text-primary)] m-0">
                  {STRINGS.resetPassword.step2Title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                  We sent a 6-digit code to{" "}
                  <span className="text-[var(--text-primary)] font-medium">{sharedEmail}</span>
                </p>
              </div>

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-[var(--space-3)]">
                        <OtpInput
                          value={sharedOtp}
                          onChange={(v) => {
                            setSharedOtp(v);
                            field.onChange(v);
                          }}
                          hasError={!!form.formState.errors.otp}
                          autoFocus
                        />
                        {form.formState.errors.otp && (
                          <p className="text-[13px] text-[var(--status-error)]">
                            {form.formState.errors.otp.message}
                          </p>
                        )}
                        <div className="text-center mt-0.5">
                          {canResend ? (
                            <button
                              type="button"
                              onClick={handleResend}
                              className="text-[13px] text-[var(--accent-text)] font-medium hover:underline inline-flex items-center gap-1"
                            >
                              <RefreshCw size={13} /> {STRINGS.resetPassword.resend}
                            </button>
                          ) : (
                            <span className="text-[13px] text-[var(--text-disabled)]">Resend in {secs}s</span>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" className="w-full" onClick={handleStep2}>
                {STRINGS.resetPassword.step2Submit}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="text-[13px] text-[var(--accent-text)] hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> {STRINGS.resetPassword.changeEmail}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-[var(--space-5)]">
              <div className="text-center">
                <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.4px] text-[var(--text-primary)] m-0">
                  {STRINGS.resetPassword.step3Title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                  {STRINGS.resetPassword.step3Subtitle}
                </p>
              </div>

              {resetPw.isError && (
                <p role="alert" className="text-[13px] text-[var(--status-error)] bg-[var(--status-error-bg)] rounded-[var(--radius-input)] px-3 py-2">
                  {resetPw.error.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      New password <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-[var(--space-3)]">
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                          <Input
                            {...field}
                            type={showPw ? "text" : "password"}
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
                            className="pl-9 pr-10"
                            onChange={(e) => {
                              field.onChange(e);
                              setPwScore(scorePassword(e.target.value));
                            }}
                          />
                          <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide" : "Show"} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-[var(--text-tertiary)] rounded-[var(--radius-input)]">
                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {pwScore > 0 && (
                          <div className="flex flex-col gap-[var(--space-2)]">
                            <div className="flex gap-1.5">
                              {([1, 2, 3, 4] as const).map((seg) => (
                                <div key={seg} className="flex-1 h-1 rounded-full transition-colors duration-[var(--duration-base)]" style={{ background: seg <= pwScore ? STRENGTH_META[pwScore].color : "var(--border-default)" }} />
                              ))}
                            </div>
                            <span className="text-[11px] font-medium" style={{ color: STRENGTH_META[pwScore].color }}>
                              {STRENGTH_META[pwScore].label}
                            </span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_new_password"
                render={({ field }) => {
                  const pw      = form.watch("new_password");
                  const match   = field.value ? pw === field.value : null;
                  return (
                    <FormItem>
                      <FormLabel>
                        Confirm password <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-[var(--space-2)]">
                          <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                            <Input
                              {...field}
                              type={showConfirm ? "text" : "password"}
                              placeholder="Re-enter password"
                              autoComplete="new-password"
                              className="pl-9 pr-10"
                            />
                            <button type="button" onClick={() => setShowConfirm((s) => !s)} aria-label={showConfirm ? "Hide" : "Show"} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-[var(--text-tertiary)] rounded-[var(--radius-input)]">
                              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {match !== null && (
                            <span
                              className="text-[11px] font-medium flex items-center gap-1"
                              style={{ color: match ? "var(--status-success)" : "var(--status-error)" }}
                            >
                              {match ? <CheckCircle size={13} strokeWidth={2.4} /> : "✕"}
                              {match ? "Passwords match" : "Passwords do not match"}
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button
                type="button"
                className="w-full"
                onClick={() => form.handleSubmit(handleStep3)()}
                disabled={resetPw.isPending}
              >
                {resetPw.isPending ? <Loader2 size={16} className="animate-spin" /> : STRINGS.resetPassword.step3Submit}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </AuthLayout>
  );
}
