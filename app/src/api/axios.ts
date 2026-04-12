/**
 * axios
 * Shared axios instance with auth token injection and global 401 handling.
 */
import axios, { AxiosHeaders } from "axios";
import { isTokenExpired } from "../utils/authToken";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const AUTH_LOGOUT_EVENT = "echelon-auth-logout";

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
      return config;
    }

    // Attach bearer token to every authenticated API request.
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Force local sign-out when the backend rejects an expired/invalid token.
    if (error?.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
    }

    return Promise.reject(error);
  }
);

export default api;
