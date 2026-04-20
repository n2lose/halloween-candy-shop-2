/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { clearTokens } from "./tokenStorage";
import { getMe } from "../api/auth";
import type { UserProfile, AuthResponse } from "../types/index";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (res: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Re-hydrate user from access_token on page load (runs once)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // Always resolve via promise so setState is called in callback, not synchronously
    const hydrate = token
      ? getMe().then(r => setUser(r.data)).catch(() => clearTokens())
      : Promise.resolve();
    hydrate.finally(() => setLoading(false));
  }, []);

  const login = (res: AuthResponse) => {
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("refresh_token", res.refresh_token);
    setUser(res.user);
  };

  const logout = () => {
    if (user) localStorage.removeItem(`cart_${user.id}`);
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
