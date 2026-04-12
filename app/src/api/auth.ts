/**
 * auth
 * Authentication API helpers for login and registration endpoints.
 */
import api from "./axios";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const register = async (userData: RegisterData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials: LoginData): Promise<string> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data.token;
};
