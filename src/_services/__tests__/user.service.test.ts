import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/_lib/api-client";
import type { UserRole, UserStatus, UserType } from "@/_types/user";

import { UserService } from "../user.service";

vi.mock("@/_lib/api-client");

describe("UserService.getAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar endpoint com includeInactive=true", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll();

    expect(apiClient).toHaveBeenCalledWith(
      "/lunch-reservation/users?includeInactive=true",
    );
  });

  it("deve filtrar usuários por status no lado do cliente", async () => {
    const mockUsers = [
      {
        id: "1",
        cpf: "12345678900",
        name: "User Ativo",
        role: "USER" as UserRole,
        userType: "FIXO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "2",
        cpf: "12345678901",
        name: "User Inativo",
        role: "USER" as UserRole,
        userType: "FIXO" as UserType,
        status: "INATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    vi.mocked(apiClient).mockResolvedValue(mockUsers);

    const result = await UserService.getAll({ status: "ATIVO" as UserStatus });

    expect(apiClient).toHaveBeenCalledWith(
      "/lunch-reservation/users?includeInactive=true",
    );
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("ATIVO");
  });

  it("deve filtrar usuários por role no lado do cliente", async () => {
    const mockUsers = [
      {
        id: "1",
        cpf: "12345678900",
        name: "Admin User",
        role: "ADMIN" as UserRole,
        userType: "FIXO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "2",
        cpf: "12345678901",
        name: "Regular User",
        role: "USER" as UserRole,
        userType: "FIXO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    vi.mocked(apiClient).mockResolvedValue(mockUsers);

    const result = await UserService.getAll({ role: "ADMIN" as UserRole });

    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("ADMIN");
  });

  it("deve filtrar usuários por userType no lado do cliente", async () => {
    const mockUsers = [
      {
        id: "1",
        cpf: "12345678900",
        name: "User Fixo",
        role: "USER" as UserRole,
        userType: "FIXO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "2",
        cpf: "12345678901",
        name: "User Temporario",
        role: "USER" as UserRole,
        userType: "TEMPORARIO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    vi.mocked(apiClient).mockResolvedValue(mockUsers);

    const result = await UserService.getAll({ userType: "FIXO" as UserType });

    expect(result).toHaveLength(1);
    expect(result[0].userType).toBe("FIXO");
  });

  it("deve filtrar usuários com múltiplos filtros no lado do cliente", async () => {
    const mockUsers = [
      {
        id: "1",
        cpf: "12345678900",
        name: "Admin Fixo Ativo",
        role: "ADMIN" as UserRole,
        userType: "FIXO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "2",
        cpf: "12345678901",
        name: "User Fixo Ativo",
        role: "USER" as UserRole,
        userType: "FIXO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "3",
        cpf: "12345678902",
        name: "Admin Temporario Ativo",
        role: "ADMIN" as UserRole,
        userType: "TEMPORARIO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    vi.mocked(apiClient).mockResolvedValue(mockUsers);

    const result = await UserService.getAll({
      status: "ATIVO" as UserStatus,
      role: "ADMIN" as UserRole,
      userType: "FIXO" as UserType,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("deve retornar todos os usuários quando nenhum filtro corresponde", async () => {
    const mockUsers = [
      {
        id: "1",
        cpf: "12345678900",
        name: "User 1",
        role: "USER" as UserRole,
        userType: "FIXO" as UserType,
        status: "ATIVO" as UserStatus,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    vi.mocked(apiClient).mockResolvedValue(mockUsers);

    const result = await UserService.getAll({ role: "ADMIN" as UserRole });

    expect(result).toHaveLength(0);
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

    vi.mocked(apiClient).mockResolvedValue(mockUsers);

    const result = await UserService.getAll();

    expect(result).toEqual(mockUsers);
  });

  it("deve propagar erros do apiClient", async () => {
    const error = new Error("Network error");
    vi.mocked(apiClient).mockRejectedValue(error);

    await expect(UserService.getAll()).rejects.toThrow("Network error");
  });
});
