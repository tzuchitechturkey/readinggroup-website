import { clearTokens } from "./setToken";

export const getToken = () => {
  try {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const expiry = JSON.parse(localStorage.getItem("tokenExpiry"));

    if (!token) return "";
    if (expiry && Date.now() > Number(expiry)) {
      // expired
      clearTokens();
      return "";
    }
    return token;
  } catch (error) {
    console.error("Error retrieving the token:", error);
    return "";
  }
};
