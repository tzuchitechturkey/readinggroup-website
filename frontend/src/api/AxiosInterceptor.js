import { useEffect } from "react";

import axiosInstance from "./axios";
import { clearTokens } from "./setToken";

export function AxiosInterceptor() {
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        console.log(error,"error from Mian axios file");
        console.log(status);
        if (status === 401 || status === 403) {
          // Token invalid/expired or forbidden. Clear and redirect to login.
          clearTokens();
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
