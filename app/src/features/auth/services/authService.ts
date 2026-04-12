/**
 * authService
 * Auth feature service: handles login, register, JWT parsing, and error handling.
 */
import axios from "axios";
import api from "../../../api/axios";

export interface JwtPayload {
  id: number;
  role: string;
}

export interface User {
  id: number;
  role: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) {
      return null;
    }

    const normalizedPayload = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedPayload)) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
};

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as {
    response?: {
      status?: number;
      data?: ApiErrorResponse;
    };
    message?: string;
  };

  if (!axios.isAxiosError(error)) {
    return "Unable to complete authentication. Please try again.";
  }

  if (!apiError.response) {
    return "Cannot reach the server. Please check your connection and try again.";
  }

  const status = apiError.response.status;

  if (status === 401) {
    return "Invalid email or password";
  }

  return (
    apiError.response.data?.message || apiError.response.data?.error || fallbackMessage
  );
};

export const login = (credentials: LoginCredentials): Promise<AuthResponse> => {
  return api.post<{ token: string }>("/auth/login", credentials)
    .then((response) => {
      const token = response.data.token;
      const payload = parseJwtPayload(token);

      if (!payload) {
        throw new Error("Invalid authentication token");
      }

      return {
        token,
        user: {
          id: payload.id,
          role: payload.role,
          name: "",
          email: credentials.email,
        },
      };
    })
    .catch((error) => {
      throw new Error(getApiErrorMessage(error, "Login failed. Please try again."));
    });
};

export const register = (data: RegisterData): Promise<AuthResponse> => {
  return api.post("/auth/register", data)
    .then(() => {
      return api.post<{ token: string }>("/auth/login", {
        email: data.email,
        password: data.password,
      });
    })
    .then((loginResponse) => {
      const token = loginResponse.data.token;
      const payload = parseJwtPayload(token);

      if (!payload) {
        throw new Error("Invalid authentication token");
      }

      return {
        token,
        user: {
          id: payload.id,
          role: payload.role,
          name: data.name,
          email: data.email,
        },
      };
    })
    .catch((error) => {
      if (error instanceof Error && error.message === "Invalid authentication token") {
        throw error;
      }
      throw new Error(getApiErrorMessage(error, "Registration failed. Please try again."));
    });
};
