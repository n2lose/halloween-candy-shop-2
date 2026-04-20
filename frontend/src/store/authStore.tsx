/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from "react";
import { clearTokens } from "./tokenStorage";
import type { UserProfile, TokenPair } from "../types/index";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (tokens: TokenPair, user: UserProfile) => void;
  logout: () => void;
  setUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);

  const login = (tokens: TokenPair, profile: UserProfile) => {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    setUserState(profile);
  };

  const logout = () => {
    if (user) localStorage.removeItem(`cart_${user.id}`);
    clearTokens();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      setUser: setUserState,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
