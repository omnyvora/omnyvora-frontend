import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// In-memory token store — intentionally not persisted to localStorage (XSS risk).
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => { accessToken = token; },
  clear: () => { accessToken = null; },
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  withCredentials: true, // sends httpOnly refresh token cookie on every request
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

// On 401: attempt silent token refresh, then replay the original request.
// If refresh fails, clear token and redirect to login.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(error);
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
        {},
        { withCredentials: true }
      );

      const newToken: string = data.data.access;
      tokenStore.set(newToken);
      refreshQueue.forEach((cb) => cb(newToken));
      refreshQueue = [];

      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch {
      tokenStore.clear();
      refreshQueue = [];
      // Redirect handled by the auth context, not here.
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
