/**
 * AuthContext
 * Stores authenticated user/session state and exposes login/logout actions.
 */
import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { isTokenExpired } from "../utils/authToken";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "auth_user";
const AUTH_LOGOUT_EVENT = "echelon-auth-logout";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    // Bootstrap token from localStorage to persist sessions on refresh.
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      return null;
    }

    if (isTokenExpired(storedToken)) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }

    return storedToken;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });

  const login = (nextUser: AuthUser, nextToken: string) => {
    if (isTokenExpired(nextToken)) {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      return;
    }

    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  useEffect(() => {
    // Listen for global logout events fired by axios interceptor on 401s.
    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
