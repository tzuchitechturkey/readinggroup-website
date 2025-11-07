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
        // Only clear tokens on 401 (Unauthorized). Don't clear on 403 (Forbidden)
        // because 403 may indicate lack of permission for the action while the
        // token itself is still valid. Clearing on 403 causes accidental logout.
        if (status === 401) {
          // Token invalid/expired. Clear and redirect to login.
          clearTokens();
          // Prevent infinite loops if already on auth pages
          const isOnAuth = window.location.pathname.startsWith("/auth");
          if (!isOnAuth) {
            // window.location.href = "/auth/login";
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
