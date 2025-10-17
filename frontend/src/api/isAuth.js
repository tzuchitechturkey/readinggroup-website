export function isUserAuthenticated() {
  const userInfo = localStorage.getItem("accessToken");
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null;
}

export function removeAuthInfo() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userType");
  localStorage.removeItem("user_info");
}
