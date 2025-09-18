
export const getToken =  () => {
  try {
    const token =  JSON.parse(localStorage.getItem("accessToken"));

    return token ? token : "";
  } catch (error) {
    console.error("Error retrieving the token:", error);
    return null;
  }
};
