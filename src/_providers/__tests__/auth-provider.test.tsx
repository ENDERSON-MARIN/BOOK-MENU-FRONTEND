import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthService } from "@/_services/auth.service";
import type { LoginRequest } from "@/_types/auth";

import { AuthProvider, useAuth } from "../auth-provider";

// Mock dependencies
vi.mock("@/_services/auth.service");
vi.mock("@/_lib/jwt-utils", () => ({
  isTokenExpired: vi.fn(() => false),
}));
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with no user when localStorage is empty", async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should initialize with user from localStorage", async () => {
      const mockUser = {
        id: "1",
        cpf: "12345678901",
        name: "Test User",
        role: "USER" as const,
        userType: "FIXO" as const,
        status: "ATIVO" as const,
      };

      localStorage.setItem("auth_token", "mock-token");
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("login", () => {
    it("should login successfully and store user data", async () => {
      const mockUser = {
        id: "1",
        cpf: "12345678901",
        name: "Test User",
        role: "USER" as const,
        userType: "FIXO" as const,
        status: "ATIVO" as const,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      };

      const mockResponse = {
        token: "mock-token",
        user: mockUser,
      };

      vi.mocked(AuthService.login).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const credentials: LoginRequest = {
        cpf: "12345678901",
        password: "123456",
      };

      await result.current.login(credentials);

      expect(localStorage.getItem("auth_token")).toBe("mock-token");
      expect(result.current.user).toMatchObject({
        id: mockUser.id,
        cpf: mockUser.cpf,
        name: mockUser.name,
        role: mockUser.role,
        userType: mockUser.userType,
        status: mockUser.status,
      });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should clear localStorage on login failure", async () => {
      vi.mocked(AuthService.login).mockRejectedValue(
        new Error("Invalid credentials"),
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const credentials: LoginRequest = {
        cpf: "12345678901",
        password: "wrong-password",
      };

      await expect(result.current.login(credentials)).rejects.toThrow();

      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(localStorage.getItem("auth_user")).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("logout", () => {
    it("should clear user data and localStorage", async () => {
      const mockUser = {
        id: "1",
        cpf: "12345678901",
        name: "Test User",
        role: "USER" as const,
        userType: "FIXO" as const,
        status: "ATIVO" as const,
      };

      localStorage.setItem("auth_token", "mock-token");
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);

      result.current.logout();

      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(localStorage.getItem("auth_user")).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("getUser", () => {
    it("should return current user", async () => {
      const mockUser = {
        id: "1",
        cpf: "12345678901",
        name: "Test User",
        role: "USER" as const,
        userType: "FIXO" as const,
        status: "ATIVO" as const,
      };

      localStorage.setItem("auth_token", "mock-token");
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const user = result.current.getUser();

      expect(user).toEqual(mockUser);
    });

    it("should return null when no user is logged in", async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const user = result.current.getUser();

      expect(user).toBeNull();
    });
  });

  describe("hasRole", () => {
    it("should return true when user has the specified role", async () => {
      const mockUser = {
        id: "1",
        cpf: "12345678901",
        name: "Admin User",
        role: "ADMIN" as const,
        userType: "FIXO" as const,
        status: "ATIVO" as const,
      };

      localStorage.setItem("auth_token", "mock-token");
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasRole("ADMIN")).toBe(true);
      expect(result.current.hasRole("USER")).toBe(false);
    });

    it("should return false when no user is logged in", async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasRole("ADMIN")).toBe(false);
      expect(result.current.hasRole("USER")).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should throw error when useAuth is used outside AuthProvider", () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");
    });
  });
});
