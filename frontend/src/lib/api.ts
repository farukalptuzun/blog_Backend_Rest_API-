import axios from "axios";

/**
 * Tarayıcıda `/api` (Next.js rewrite → Express). Sunucuda doğrudan backend adresi.
 * Eski kullanım: NEXT_PUBLIC_API_BASE_URL ile tam URL (rewrite kullanılmıyorsa).
 */
export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return "/api";
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  const backend = process.env.BACKEND_URL || "http://127.0.0.1:3000";
  return `${backend.replace(/\/$/, "")}/api`;
}

/** Kapak görselleri: tarayıcıda aynı origin (/uploads → rewrite); SSR için backend kökü */
export function getBackendOrigin() {
  if (typeof window !== "undefined") {
    return "";
  }
  const backend = process.env.BACKEND_URL || "http://127.0.0.1:3000";
  return backend.replace(/\/$/, "");
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
