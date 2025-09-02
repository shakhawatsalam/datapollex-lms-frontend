export const storeToken = (accessToken: string) => {
  localStorage.setItem("accessToken", accessToken);
};

export const getStoredToken = () => {
  return localStorage.getItem("accessToken");
};

export const clearToken = () => {
  localStorage.removeItem("accessToken");
};
