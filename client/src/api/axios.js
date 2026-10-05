import axios from "axios";

export const TOKEN_KEY = "jobmatch_token";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthAttempt = url.startsWith("/auth/login") || url.startsWith("/auth/signup");

    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export default api;
