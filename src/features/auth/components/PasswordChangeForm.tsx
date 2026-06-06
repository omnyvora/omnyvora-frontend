"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
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
import { useChangePassword } from "../hooks";
import { PasswordChangeFormSchema, type PasswordChangeFormValues } from "../types";
import { STRINGS } from "../constants";

export function PasswordChangeForm() {
  const [showOld, setShowOld]         = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const changePw = useChangePassword();

  const form = useForm<PasswordChangeFormValues>({
    resolver:      zodResolver(PasswordChangeFormSchema),
    defaultValues: { old_password: "", new_password: "", confirm_new_password: "" },
  });

  function onSubmit(values: PasswordChangeFormValues) {
    changePw.mutate(
      { old_password: values.old_password, new_password: values.new_password },
      { onSuccess: () => form.reset() },
    );
  }

  function PasswordInput({
    fieldName,
    label,
    show,
    onToggle,
    autoComplete,
    placeholder,
  }: {
    fieldName:    "old_password" | "new_password" | "confirm_new_password";
    label:        string;
    show:         boolean;
    onToggle:     () => void;
    autoComplete: string;
    placeholder:  string;
  }) {
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label}{" "}
              <span className="text-[var(--status-error)]" aria-hidden="true">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
                />
                <Input
                  {...field}
                  type={show ? "text" : "password"}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={onToggle}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] rounded-[var(--radius-input)]"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (changePw.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-[var(--space-5)] py-4 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "var(--status-success-bg)", color: "var(--status-success)" }}
        >
          <CheckCircle size={24} strokeWidth={1.9} />
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Password changed successfully.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => { form.reset(); changePw.reset(); }}
        >
          Change again
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-[var(--space-5)]"
        noValidate
      >
        {changePw.isError && (
          <p
            role="alert"
            className="text-[13px] text-[var(--status-error)] bg-[var(--status-error-bg)] rounded-[var(--radius-input)] px-3 py-2"
          >
            {changePw.error.message}
          </p>
        )}

        <PasswordInput
          fieldName="old_password"
          label="Current password"
          show={showOld}
          onToggle={() => setShowOld((s) => !s)}
          autoComplete="current-password"
          placeholder="Your current password"
        />
        <PasswordInput
          fieldName="new_password"
          label="New password"
          show={showNew}
          onToggle={() => setShowNew((s) => !s)}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <PasswordInput
          fieldName="confirm_new_password"
          label="Confirm new password"
          show={showConfirm}
          onToggle={() => setShowConfirm((s) => !s)}
          autoComplete="new-password"
          placeholder="Re-enter new password"
        />

        <Button
          type="submit"
          disabled={changePw.isPending}
          aria-busy={changePw.isPending}
        >
          {changePw.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            STRINGS.changePassword.submit
          )}
        </Button>
      </form>
    </Form>
  );
}
