import axios from "axios";

import { getToken } from "./getToken";
import { API_URL } from "../configs";
import i18n from "../i18n/i18n";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = getToken();

  // Set content-type if not FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["accept-language"] = i18n?.language || "en";

  return config;
});

export default axiosInstance;
