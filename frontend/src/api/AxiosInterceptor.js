import { useEffect } from "react";

import axiosInstance from "./axios";
import { clearTokens } from "./setToken";

export function AxiosInterceptor() {
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        console.error(error, "error from Main axios file");
        console.error(status);
        if (status === 403 || status === 401) {
          clearTokens();
          // Save current URL for redirect after login
          localStorage.setItem(
            "redirectAfterLogin",
            window.location.pathname + window.location.search
          );
          // Prevent infinite loops if already on auth pages
          const isOnAuth = window.location.pathname.startsWith("/auth");
          if (!isOnAuth) {
            window.location.href = "/auth/login";
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  return null;
}
