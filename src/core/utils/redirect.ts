/**
 * Validates that a ?next= redirect target is a safe same-origin relative path.
 * Rejects external URLs and protocol-relative URLs (//) to prevent open-redirect attacks.
 */
export function safeRedirectPath(
  next: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!next) return fallback;
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return fallback;
}
