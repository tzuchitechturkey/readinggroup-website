import { useEffect } from "react";

import axiosInstance from "./axios";

export function AxiosInterceptor() {
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error(error, "error from Main axios File");
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  return null;
}
