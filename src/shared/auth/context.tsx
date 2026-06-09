"use client";

import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import apiClient, { tokenStore, refreshTokenStore } from "@/core/api/axios";
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
      const refresh = refreshTokenStore.get();
      if (refresh) await apiClient.post("/v1/auth/logout/", { refresh });
    } catch {
      // Token may already be invalid — proceed with local cleanup regardless.
    } finally {
      tokenStore.clear();
      refreshTokenStore.clear();
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  // Bootstrap: on hard reload, the access token is gone (memory cleared).
  // Use the stored refresh token to silently get a new access token, then verify the user.
  useEffect(() => {
    async function bootstrap() {
      try {
        const storedRefresh = refreshTokenStore.get();
        if (!storedRefresh) {
          setIsLoading(false);
          return;
        }

        const refreshRes = await apiClient.post("/v1/auth/token/refresh/", {
          refresh: storedRefresh,
        });

        if (!isApiSuccess(refreshRes.data)) {
          refreshTokenStore.clear();
          setIsLoading(false);
          return;
        }

        const { access, refresh: newRefresh } = refreshRes.data.data as {
          access: string;
          refresh?: string;
        };
        tokenStore.set(access);
        if (newRefresh) refreshTokenStore.set(newRefresh);

        const verifyRes = await apiClient.get("/v1/auth/verify/");
        if (isApiSuccess(verifyRes.data)) {
          const parsed = UserSchema.safeParse(verifyRes.data.data);
          if (parsed.success) setUser(parsed.data);
        }
      } catch (err) {
        // Clear stored refresh only if the server explicitly rejected it (401).
        // On network errors, keep it — the user may just be temporarily offline.
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          refreshTokenStore.clear();
        }
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();

    // Axios interceptor fires this when a mid-session refresh fails.
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
