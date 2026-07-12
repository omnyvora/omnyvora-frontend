"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/context";

// Wraps admin routes. Redirects unauthenticated users to login (preserving ?next=),
// and authenticated non-superadmins to the regular workspace dashboard.
export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const current = window.location.pathname + window.location.search;
      router.replace(`/login?next=${encodeURIComponent(current)}`);
    } else if (user?.role !== "superadmin") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) return null; // admin layout handles the loading UI
  if (!isAuthenticated || user?.role !== "superadmin") return null;

  return <>{children}</>;
}
