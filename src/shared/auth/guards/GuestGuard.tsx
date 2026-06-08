"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/context";
import { safeRedirectPath } from "@/core/utils/redirect";

// Wraps public auth pages (login, register). If the user is already authenticated,
// redirects to ?next= (if present and safe) or to /dashboard.
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      router.replace(safeRedirectPath(params.get("next")));
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null;
  if (isAuthenticated) return null;

  return <>{children}</>;
}
