import { clearTokens } from "./setToken";

export const getToken = () => {
  try {
    const rawToken = localStorage.getItem("accessToken");
    const rawExpiry = localStorage.getItem("tokenExpiry");
    let token;
    let expiry;
    try {
      token = rawToken ? JSON.parse(rawToken) : rawToken;
    } catch {
      token = rawToken;
    }
    try {
      expiry = rawExpiry ? JSON.parse(rawExpiry) : rawExpiry;
    } catch {
      expiry = rawExpiry;
    }

    if (!token) return "";
    if (expiry && Date.now() > Number(expiry)) {
      clearTokens();
      return "";
    }
    return token;
  } catch (error) {
    console.error("Error retrieving the token:", error);
    return "";
  }
};
