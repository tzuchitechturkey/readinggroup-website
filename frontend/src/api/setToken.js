import { EXPIRATION_TIME } from "../configs";

export function setTokens({ access, refresh }) {
  try {
    const expiry = Date.now() + EXPIRATION_TIME;
    localStorage.setItem("accessToken", JSON.stringify(access || ""));
    localStorage.setItem("refreshToken", JSON.stringify(refresh || ""));
    localStorage.setItem("tokenExpiry", JSON.stringify(expiry));
  } catch (error) {
    console.error("Error saving tokens:", error);
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
}
