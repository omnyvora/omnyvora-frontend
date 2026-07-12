import type { ProfileUI } from "@/features/profile/transformers";

const FIELD_LABELS: Record<NonNullable<ProfileUI["nextIncompleteField"]>, string> = {
  avatar: "a profile photo",
  phone: "your phone number",
  date_of_birth: "your date of birth",
  bio: "a short bio",
};

export function getProfileCompletionHint(profile: ProfileUI): string {
  if (!profile.nextIncompleteField) return "Your profile is complete.";
  return `Add ${FIELD_LABELS[profile.nextIncompleteField]} to reach 100%.`;
}
