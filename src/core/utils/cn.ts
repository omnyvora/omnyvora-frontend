import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for conditional Tailwind class merging — used by all shadcn/ui components.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
