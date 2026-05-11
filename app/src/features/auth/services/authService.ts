/**
 * authService
 * Auth feature service: handles login, register, JWT parsing, and error handling.
 */
import axios from "axios";
import { graphqlRequest } from "../../../api/graphql";

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

interface LoginMutationData {
  login: {
    id: number;
    email: string;
    role: string;
    token: string | null;
  } | null;
}

interface RegisterMutationData {
  register: {
    id: number;
    email: string;
    role: string;
    token?: string | null;
  };
}

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as {
    response?: {
      status?: number;
      data?: ApiErrorResponse;
    };
    message?: string;
  };

  if (!axios.isAxiosError(error)) {    return "Unable to complete authentication. Please try again.";
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
  return graphqlRequest<LoginMutationData>(
    `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          id
          email
          role
          token
        }
      }
    `,
    credentials
  )
    .then((data) => {
      if (!data.login || !data.login.token) {
        throw new Error("Invalid email or password");
      }

      return {
        token: data.login.token,
        user: {
          id: data.login.id,
          role: data.login.role,
          name: "",
          email: data.login.email,
        },
      };
    })
    .catch((error) => {
      throw new Error(getApiErrorMessage(error, "Login failed. Please try again."));
    });
};

export const register = (data: RegisterData): Promise<AuthResponse> => {
  return graphqlRequest<RegisterMutationData>(
    `
      mutation Register($email: String!, $password: String!, $role: String) {
        register(email: $email, password: $password, role: $role) {
          id
          email
          role
        }
      }
    `,
    {
      email: data.email,
      password: data.password,
      role: "customer",
    }
  )
    .then(() => {
      return graphqlRequest<LoginMutationData>(
        `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              id
              email
              role
              token
            }
          }
        `,
        {
        email: data.email,
        password: data.password,
        }
      );
    })
    .then((loginData) => {
      if (!loginData.login || !loginData.login.token) {
        throw new Error("Invalid authentication token");
      }

      return {
        token: loginData.login.token,
        user: {
          id: loginData.login.id,
          role: loginData.login.role,
          name: data.name,
          email: loginData.login.email,
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
