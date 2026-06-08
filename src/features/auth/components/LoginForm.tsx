"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
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
import { useLogin } from "../hooks";
import { LoginRequestSchema, type LoginRequest } from "../types";
import { STRINGS, AUTH_ROUTES } from "../constants";
import { AuthLayout, AuthHeader, OrDivider, FooterLink, GoogleButton } from "./AuthLayout";
import { safeRedirectPath } from "@/core/utils/redirect";

export function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const searchParams = useSearchParams();
  const nextParam  = searchParams.get("next");
  const redirectTo = safeRedirectPath(nextParam);
  const login = useLogin(redirectTo);

  // Preserve ?next= when the user switches to the register page so that after
  // registration they still land on the page they originally tried to access.
  const registerHref = nextParam
    ? `${AUTH_ROUTES.register}?next=${encodeURIComponent(nextParam)}`
    : AUTH_ROUTES.register;

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginRequest) {
    login.mutate(values);
  }

  return (
    <AuthLayout
      footer={
        <FooterLink
          prompt={STRINGS.login.footer}
          label={STRINGS.login.register}
          href={registerHref}
        />
      }
    >
      <AuthHeader
        title={STRINGS.login.title}
        subtitle={STRINGS.login.subtitle}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[var(--space-5)]"
          noValidate
        >
          {/* Form-level error from backend */}
          {login.isError && (
            <p
              role="alert"
              className="text-[13px] text-[var(--status-error)] bg-[var(--status-error-bg)] rounded-[var(--radius-input)] px-3 py-2"
            >
              {login.error.message}
            </p>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {" "}Email <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                </FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Password <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
                  </FormLabel>
                  <a
                    href={AUTH_ROUTES.forgotPassword}
                    className="text-[13px] text-[var(--accent-text)] hover:underline"
                  >
                    {STRINGS.login.forgot}
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
                    />
                    <Input
                      {...field}
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      aria-pressed={showPw}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] rounded-[var(--radius-input)]"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={login.isPending}
            aria-busy={login.isPending}
          >
            {login.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              STRINGS.login.submit
            )}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col gap-[var(--space-5)]">
        <OrDivider />
        <GoogleButton label={STRINGS.login.google} disabled />
      </div>
    </AuthLayout>
  );
}
