import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserService } from "@/_services/user.service";
import type { UserRole, UserStatus, UserType } from "@/_types/user";

import { useGetUsers } from "../use-get-users";

vi.mock("@/_services/user.service");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
};

describe("useGetUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar UserService.getAll sem parâmetros quando não fornecidos", async () => {
    vi.mocked(UserService.getAll).mockResolvedValue([]);

    renderHook(() => useGetUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(UserService.getAll).toHaveBeenCalledWith(undefined);
    });
  });

  it("deve chamar UserService.getAll com status quando fornecido", async () => {
    vi.mocked(UserService.getAll).mockResolvedValue([]);

    const params = { status: "ATIVO" as UserStatus };
    renderHook(() => useGetUsers(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(UserService.getAll).toHaveBeenCalledWith(params);
    });
  });

  it("deve chamar UserService.getAll com role quando fornecido", async () => {
    vi.mocked(UserService.getAll).mockResolvedValue([]);

    const params = { role: "ADMIN" as UserRole };
    renderHook(() => useGetUsers(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(UserService.getAll).toHaveBeenCalledWith(params);
    });
  });

  it("deve chamar UserService.getAll com userType quando fornecido", async () => {
    vi.mocked(UserService.getAll).mockResolvedValue([]);

    const params = { userType: "FIXO" as UserType };
    renderHook(() => useGetUsers(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(UserService.getAll).toHaveBeenCalledWith(params);
    });
  });

  it("deve chamar UserService.getAll com múltiplos parâmetros", async () => {
    vi.mocked(UserService.getAll).mockResolvedValue([]);

    const params = {
      status: "ATIVO" as UserStatus,
      role: "ADMIN" as UserRole,
      userType: "FIXO" as UserType,
    };

    renderHook(() => useGetUsers(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(UserService.getAll).toHaveBeenCalledWith(params);
    });
  });

  it("deve retornar dados quando a chamada é bem-sucedida", async () => {
    const mockUsers = [
      {
        id: "1",
        cpf: "12345678900",
        name: "Test User",
        role: "ADMIN" as UserRole,
        userType: "FIXO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    vi.mocked(UserService.getAll).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useGetUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUsers);
  });

  it("deve invalidar cache quando parâmetros mudam", async () => {
    vi.mocked(UserService.getAll).mockResolvedValue([]);

    const { rerender } = renderHook(({ params }) => useGetUsers(params), {
      wrapper: createWrapper(),
      initialProps: { params: { status: "ATIVO" as UserStatus } },
    });

    await waitFor(() => {
      expect(UserService.getAll).toHaveBeenCalledWith({ status: "ATIVO" });
    });

    vi.clearAllMocks();

    rerender({ params: { status: "INATIVO" as UserStatus } });

    await waitFor(() => {
      expect(UserService.getAll).toHaveBeenCalledWith({ status: "INATIVO" });
    });
  });
});
