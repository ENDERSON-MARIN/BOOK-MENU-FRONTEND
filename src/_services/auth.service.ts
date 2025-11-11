import { apiClient } from "@/_lib/api-client";
import type { LoginRequest, LoginResponse } from "@/_types/auth";

export const AuthService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
  },
};
