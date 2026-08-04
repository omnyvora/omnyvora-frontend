import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiRequestError } from "@/core/api/response";

// Access token: JS memory — short-lived (~15 min), intentionally lost on reload.
// Refresh token: localStorage — survives reload, used only to obtain new access tokens.
// localStorage is JS-readable (XSS risk), mitigated by: short access lifetime +
// refresh token rotation + blacklisting on the backend (both already configured).
let accessToken: string | null = null;
const REFRESH_KEY = "ov_rt";

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => { accessToken = token; },
  clear: () => { accessToken = null; },
};

export const refreshTokenStore = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_KEY, token);
  },
  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REFRESH_KEY);
  },
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  headers: { "Content-Type": "application/json" },
});

// Inject access token into every outgoing request.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

// Extracts the backend's error envelope from the response body — Django returns
// validation failures as real HTTP 4xx statuses, so Axios rejects here on every
// one of them; this is the one place that sees the raw body before it's lost.
// Preserving `errors` (not just `message`) is what lets applyServerErrors() map
// field-level failures onto the right form input instead of only a generic toast.
function toAppError(err: AxiosError): Error {
  const data = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
  if (typeof data?.message === "string") {
    return new ApiRequestError({ success: false, message: data.message, errors: data.errors });
  }
  return new Error(err.message);
}

// On 401: attempt silent token refresh, then replay the original request.
// Guard: only retry requests that carried an Authorization header — the refresh
// endpoint itself has no auth header, so this prevents infinite retry loops.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(toAppError(error));
    }

    // The refresh endpoint and bootstrap calls have no auth header — reject silently.
    const hadAuthHeader = !!(original.headers?.Authorization);
    if (!hadAuthHeader) {
      return Promise.reject(toAppError(error));
    }

    const storedRefresh = refreshTokenStore.get();
    if (!storedRefresh) {
      // Access token present but refresh gone (e.g. localStorage cleared externally).
      tokenStore.clear();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(toAppError(error));
    }

    original._retried = true;

    if (isRefreshing) {
      // Queue concurrent requests while a refresh is already in flight.
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/v1/auth/token/refresh/`,
        { refresh: storedRefresh },
      );

      const newAccess: string = data.data.access;
      tokenStore.set(newAccess);
      // Store the rotated refresh token — backend always rotates (ROTATE_REFRESH_TOKENS=True).
      if (data.data.refresh) refreshTokenStore.set(data.data.refresh);

      refreshQueue.forEach((cb) => cb(newAccess));
      refreshQueue = [];

      original.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(original);
    } catch {
      tokenStore.clear();
      refreshTokenStore.clear();
      refreshQueue = [];
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(toAppError(error));
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
