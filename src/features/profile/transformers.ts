import type { Profile, UpdateProfileFormValues } from "./types";

export interface ProfileUI {
  firstName: string;
  lastName:  string;
  fullName:  string;
  phone:     string;
  dob:       string;
  bio:       string;
  avatar:    string | null;
}

export function toProfileUI(p: Profile): ProfileUI {
  return {
    firstName: p.first_name,
    lastName:  p.last_name,
    fullName:  `${p.first_name} ${p.last_name}`.trim(),
    phone:     p.phone ?? "",
    dob:       p.date_of_birth ?? "",
    bio:       p.bio ?? "",
    avatar:    p.avatar,
  };
}

export function toUpdateRequest(values: UpdateProfileFormValues) {
  return {
    first_name: values.first_name,
    last_name:  values.last_name,
    phone:      values.phone ?? "",
    date_of_birth: values.dob ?? "",
    bio:        values.bio ?? "",
  };
}
