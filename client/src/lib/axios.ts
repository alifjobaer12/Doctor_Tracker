import axios, { AxiosError } from "axios";
import { getQueryClient } from "./queryClient";

export const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (!pathname.startsWith("/login")) {
          const queryClient = getQueryClient();
          queryClient.clear();
          const next = encodeURIComponent(pathname + window.location.search);
          window.location.href = `/login?next=${next}`;
        }
      }
    }
    return Promise.reject(error);
  }
);
