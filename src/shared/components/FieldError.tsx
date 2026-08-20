import type { FieldError as RHFFieldError } from "react-hook-form";

interface FieldErrorProps {
  // exactOptionalPropertyTypes needs "| undefined" explicitly — every caller
  // passes RHFFormState.errors.<field>, which is typed as FieldError | undefined,
  // not just "possibly absent".
  error?: RHFFieldError | undefined;
}

// Renders both Zod (client) and applyServerErrors (backend) field errors the same
// way — a form field never needs to know which side rejected the value.
export function FieldError({ error }: FieldErrorProps) {
  if (!error?.message) return null;
  return <div className="field-error">{error.message}</div>;
}
