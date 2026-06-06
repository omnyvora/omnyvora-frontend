"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/context";

// Wraps workspace routes. Redirects unauthenticated users to login.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null; // workspace layout handles the loading UI
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
