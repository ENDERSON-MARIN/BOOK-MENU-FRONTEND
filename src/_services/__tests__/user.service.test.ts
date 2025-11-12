import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/_lib/api-client";
import type { UserRole, UserStatus, UserType } from "@/_types/user";

import { UserService } from "../user.service";

vi.mock("@/_lib/api-client");

describe("UserService.getAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar endpoint sem parâmetros quando nenhum filtro é fornecido", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll();

    expect(apiClient).toHaveBeenCalledWith("/lunch-reservation/users");
  });

  it("deve construir query string corretamente para filtro de status", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll({ status: "ATIVO" as UserStatus });

    expect(apiClient).toHaveBeenCalledWith(
      "/lunch-reservation/users?status=ATIVO",
    );
  });

  it("deve construir query string corretamente para filtro de role", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll({ role: "ADMIN" as UserRole });

    expect(apiClient).toHaveBeenCalledWith(
      "/lunch-reservation/users?role=ADMIN",
    );
  });

  it("deve construir query string corretamente para filtro de userType", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll({ userType: "FIXO" as UserType });

    expect(apiClient).toHaveBeenCalledWith(
      "/lunch-reservation/users?userType=FIXO",
    );
  });

  it("deve construir query string com múltiplos filtros", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll({
      status: "ATIVO" as UserStatus,
      role: "ADMIN" as UserRole,
      userType: "FIXO" as UserType,
    });

    const call = vi.mocked(apiClient).mock.calls[0][0];
    expect(call).toContain("/lunch-reservation/users?");
    expect(call).toContain("status=ATIVO");
    expect(call).toContain("role=ADMIN");
    expect(call).toContain("userType=FIXO");
  });

  it("deve construir query string com status e role", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll({
      status: "INATIVO" as UserStatus,
      role: "USER" as UserRole,
    });

    const call = vi.mocked(apiClient).mock.calls[0][0];
    expect(call).toContain("/lunch-reservation/users?");
    expect(call).toContain("status=INATIVO");
    expect(call).toContain("role=USER");
  });

  it("deve construir query string com status e userType", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll({
      status: "ATIVO" as UserStatus,
      userType: "TEMPORARIO" as UserType,
    });

    const call = vi.mocked(apiClient).mock.calls[0][0];
    expect(call).toContain("/lunch-reservation/users?");
    expect(call).toContain("status=ATIVO");
    expect(call).toContain("userType=TEMPORARIO");
  });

  it("deve construir query string com role e userType", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll({
      role: "ADMIN" as UserRole,
      userType: "FIXO" as UserType,
    });

    const call = vi.mocked(apiClient).mock.calls[0][0];
    expect(call).toContain("/lunch-reservation/users?");
    expect(call).toContain("role=ADMIN");
    expect(call).toContain("userType=FIXO");
  });

  it("não deve incluir parâmetros undefined na URL", async () => {
    vi.mocked(apiClient).mockResolvedValue([]);

    await UserService.getAll({
      status: "ATIVO" as UserStatus,
      role: undefined,
      userType: undefined,
    });

    const call = vi.mocked(apiClient).mock.calls[0][0];
    expect(call).toBe("/lunch-reservation/users?status=ATIVO");
    expect(call).not.toContain("role");
    expect(call).not.toContain("userType");
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
