"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, RefreshCw, Clock, Loader2, CheckCircle } from "lucide-react";
import { Button }   from "@/shared/components/ui/button";
import { Input }    from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useRegister, useRequestOtp } from "../hooks";
import { RegisterFormSchema, type RegisterFormValues } from "../types";
import { STRINGS, AUTH_ROUTES, OTP_PURPOSE, OTP_CHANNEL, OTP_RESEND_COOLDOWN_SECS } from "../constants";
import { AuthLayout, AuthHeader, OrDivider, FooterLink, GoogleButton } from "./AuthLayout";
import { OtpInput } from "./OtpInput";
import { safeRedirectPath } from "@/core/utils/redirect";

function useCountdown(start: number) {
  const [secs, setSecs] = useState(start);
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
  { label: "",            color: "var(--border-default)"  },
  { label: "Weak",        color: "var(--status-error)"    },
  { label: "Fair",        color: "var(--status-warning)"  },
  { label: "Strong",      color: "var(--status-info)"     },
  { label: "Very strong", color: "var(--status-success)"  },
] as const;

export function RegisterForm() {
  const [showPw, setShowPw]     = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [pwScore, setPwScore]   = useState<0 | 1 | 2 | 3 | 4>(0);

  const searchParams = useSearchParams();
  const nextParam  = searchParams.get("next");
  const redirectTo = safeRedirectPath(nextParam);

  // Preserve ?next= when the user navigates back to the login page.
  const loginHref = nextParam
    ? `${AUTH_ROUTES.login}?next=${encodeURIComponent(nextParam)}`
    : AUTH_ROUTES.login;

  const { secs, canResend, startCountdown } = useCountdown(OTP_RESEND_COOLDOWN_SECS);
  const register   = useRegister(redirectTo);
  const requestOtp = useRequestOtp();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      first_name:       "",
      last_name:        "",
      email:            "",
      password:         "",
      confirm_password: "",
      otp:              "",
    },
  });

  const email = form.watch("email");

  async function handleSendOtp() {
    const emailValid = await form.trigger("email");
    if (!emailValid) return;

    requestOtp.mutate(
      {
        purpose:         OTP_PURPOSE.registration,
        user_identifier: email,
        otp_channel:     OTP_CHANNEL.email,
      },
      {
        onSuccess: () => {
          setOtpSent(true);
          setOtpValue("");
          startCountdown();
        },
      },
    );
  }

  function onSubmit({ confirm_password: _, ...apiPayload }: RegisterFormValues) {
    register.mutate(apiPayload);
  }

  const strength = STRENGTH_META[pwScore];

  return (
    <AuthLayout
      maxWidth={460}
      footer={
        <FooterLink
          prompt={STRINGS.register.footer}
          label={STRINGS.register.signIn}
          href={loginHref}
        />
      }
    >
      <AuthHeader
        title={STRINGS.register.title}
        subtitle={STRINGS.register.subtitle}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[var(--space-5)]"
          noValidate
        >
          {/* Form-level server error */}
          {register.isError && (
            <p
              role="alert"
              className="text-[13px] text-[var(--status-error)] bg-[var(--status-error-bg)] rounded-[var(--radius-input)] px-3 py-2"
            >
              {register.error.message}
            </p>
          )}

          {/* Name row — grid on md+, stacked on mobile */}
          <div className="grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First name <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jordan" autoComplete="given-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last name <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Avery" autoComplete="family-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email + Send OTP button */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Email <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                  </FormLabel>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={requestOtp.isPending}
                    className="text-[11px] font-medium tracking-[0.04em] uppercase text-[var(--accent-text)] hover:underline disabled:opacity-50"
                  >
                    {requestOtp.isPending ? (
                      <Loader2 size={12} className="animate-spin inline" />
                    ) : (
                      STRINGS.register.sendOtp
                    )}
                  </button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
                    />
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="pl-9"
                    />
                  </div>
                </FormControl>
                {requestOtp.isError && (
                  <p className="text-[13px] text-[var(--status-error)]">
                    {requestOtp.error.message}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password + strength */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-[var(--space-3)]">
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
                      />
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
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        aria-label={showPw ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] rounded-[var(--radius-input)]"
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {pwScore > 0 && (
                      <div className="flex flex-col gap-[var(--space-2)]">
                        <div className="flex gap-1.5">
                          {([1, 2, 3, 4] as const).map((seg) => (
                            <div
                              key={seg}
                              className="flex-1 h-1 rounded-full transition-colors duration-[var(--duration-base)]"
                              style={{
                                background: seg <= pwScore ? strength.color : "var(--border-default)",
                              }}
                            />
                          ))}
                        </div>
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: strength.color }}
                        >
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm password */}
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm password <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
                    />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className="pl-9"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* OTP block — visible once OTP sent */}
          {otpSent && (
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enter OTP <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-[var(--space-3)]">
                      <OtpInput
                        value={otpValue}
                        onChange={(v) => {
                          setOtpValue(v);
                          field.onChange(v);
                        }}
                        hasError={!!form.formState.errors.otp}
                        autoFocus
                      />
                      <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]">
                        <Clock size={12} />
                        {STRINGS.register.otpHint}
                      </div>
                      <div>
                        {canResend ? (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-[13px] text-[var(--accent-text)] font-medium hover:underline inline-flex items-center gap-1"
                          >
                            <RefreshCw size={13} />
                            {STRINGS.register.resend}
                          </button>
                        ) : (
                          <span className="text-[13px] text-[var(--text-disabled)]">
                            Resend in {secs}s
                          </span>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={register.isPending || !otpSent}
            aria-busy={register.isPending}
          >
            {register.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              STRINGS.register.submit
            )}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col gap-[var(--space-5)]">
        <OrDivider />
        <GoogleButton label={STRINGS.register.google} disabled />
      </div>
    </AuthLayout>
  );
}
