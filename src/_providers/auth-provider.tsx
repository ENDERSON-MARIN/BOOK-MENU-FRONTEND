"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { isTokenExpired } from "@/_lib/jwt-utils";
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
        const userDataStr = localStorage.getItem("auth_user");

        if (!token || !userDataStr) {
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Parse and set user data
        const userData = JSON.parse(userDataStr);
        setUser(userData);
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await AuthService.login(credentials);

      // Store token and user data in localStorage
      localStorage.setItem("auth_token", response.token);

      // Convert User to AuthUser format
      const authUser: AuthUser = {
        id: response.user.id,
        cpf: response.user.cpf,
        name: response.user.name,
        role: response.user.role,
        userType: response.user.userType,
        status: response.user.status,
      };

      localStorage.setItem("auth_user", JSON.stringify(authUser));
      setUser(authUser);
      toast.success(toastMessages.auth.loginSuccess);
    } catch (error) {
      // Clear any existing token on login failure
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setUser(null);
      // Error toast is handled by the mutation hook or component
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
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
