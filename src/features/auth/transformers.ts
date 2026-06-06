import type { VerifyUserResponse } from "./types";
import type { User } from "@/shared/auth/types";

// Converts the /v1/auth/verify/ response to the shared User shape.
// id comes back as a number from the backend; User expects a string.
export function verifyResponseToUser(data: VerifyUserResponse): User {
  return {
    id:         String(data.id),
    email:      data.email,
    first_name: data.first_name,
    last_name:  data.last_name,
  };
}

// Derives a display name from a User object.
export function toDisplayName(user: User): string {
  const full = `${user.first_name} ${user.last_name}`.trim();
  return full || user.email;
}

// Maps backend field-level error keys to React Hook Form field names.
// Returns a record of { fieldName: firstErrorMessage }.
export function mapApiErrors(
  errors: Record<string, string[]>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(errors).map(([key, messages]) => [key, messages[0] ?? "Invalid value"]),
  );
}
