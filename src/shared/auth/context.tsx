"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import apiClient, { tokenStore } from "@/core/api/axios";
import { isApiSuccess } from "@/core/api/response";
import { UserSchema, type User } from "./types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setTokenAndUser: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/v1/auth/logout/");
    } finally {
      tokenStore.clear();
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  // Bootstrap: verify existing session on hard refresh.
  useEffect(() => {
    async function bootstrap() {
      try {
        const res = await apiClient.get("/v1/auth/verify/");
        if (isApiSuccess(res.data)) {
          const parsed = UserSchema.safeParse(res.data.data);
          if (parsed.success) setUser(parsed.data);
        }
      } catch {
        // No valid session — stay unauthenticated.
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();

    // Axios interceptor fires this when refresh fails.
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const setTokenAndUser = useCallback((accessToken: string, user: User) => {
    tokenStore.set(accessToken);
    setUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        setTokenAndUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
