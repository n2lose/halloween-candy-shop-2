// Plain token helpers — used by axios client (cannot be hooks)
// Kept separate from authStore.tsx to satisfy react-refresh/only-export-components

export const getTokens = () => ({
  access_token:  localStorage.getItem("access_token") ?? "",
  refresh_token: localStorage.getItem("refresh_token") ?? "",
});

export const setAccessToken = (token: string) =>
  localStorage.setItem("access_token", token);

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
