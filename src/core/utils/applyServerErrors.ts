import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { ApiRequestError } from "@/core/api/response";

// Maps the backend's per-field `errors` dict onto the matching React Hook Form
// field so it renders through the same inline field-error UI every form already
// uses for client-side (Zod) validation — the backend is the source of truth and
// client validation can never fully mirror it (uniqueness checks, cross-field
// rules, etc.), so every mutation's onError should call this before falling back
// to a toast for the top-level message.
export function applyServerErrors<T extends FieldValues>(form: UseFormReturn<T>, error: unknown): void {
  if (!(error instanceof ApiRequestError) || !error.errors) return;

  for (const [field, messages] of Object.entries(error.errors)) {
    if (messages[0]) {
      form.setError(field as Path<T>, { type: "server", message: messages[0] });
    }
  }
}
