"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { decodeJWT, isTokenExpired } from "@/_lib/jwt-utils";
import { toastMessages } from "@/_lib/toast-messages";
import { AuthService } from "@/_services/auth.service";
import type { AuthUser, LoginRequest } from "@/_types/auth";
import type { UserRole } from "@/_types/user";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  getUser: () => AuthUser | null;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          localStorage.removeItem("auth_token");
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Decode token and set user
        const decodedUser = decodeJWT(token);
        if (decodedUser) {
          setUser(decodedUser);
        } else {
          localStorage.removeItem("auth_token");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await AuthService.login(credentials);

      // Store token in localStorage
      localStorage.setItem("auth_token", response.token);

      // Decode token and set user
      const decodedUser = decodeJWT(response.token);
      if (decodedUser) {
        setUser(decodedUser);
        toast.success(toastMessages.auth.loginSuccess);
      } else {
        throw new Error("Failed to decode token");
      }
    } catch (error) {
      // Clear any existing token on login failure
      localStorage.removeItem("auth_token");
      setUser(null);
      // Error toast is handled by the mutation hook or component
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    AuthService.logout();
    toast.success(toastMessages.auth.logoutSuccess);
  };

  const getUser = (): AuthUser | null => {
    return user;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
