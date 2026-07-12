import type { UserActivity } from "./types";

export interface ActivityItemUI {
  id:         number;
  action:     string;
  title:      string;
  subtitle:   string;
  occurredAt: string;
}

export function toActivityItemUI(a: UserActivity): ActivityItemUI {
  return {
    id:         a.id,
    action:     a.action,
    title:      a.action_label,
    subtitle:   a.service_label,
    occurredAt: a.occurred_at,
  };
}

export function toActivityListUI(items: UserActivity[]): ActivityItemUI[] {
  return items.map(toActivityItemUI);
}
