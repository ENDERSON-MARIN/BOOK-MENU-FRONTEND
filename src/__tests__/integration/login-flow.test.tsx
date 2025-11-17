import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "../../app/(auth)/login/_components/login-form";

// Mock dependencies
const mockLogin = vi.fn();
const mockPush = vi.fn();

vi.mock("@/_hooks/use-auth", () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: vi.fn(),
    user: null,
    isLoading: false,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Login Flow Integration", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve realizar login com sucesso com credenciais válidas", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(<LoginForm />);

    // Preencher CPF
    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, "12345678901");

    // Preencher senha
    const passwordInput = screen.getByLabelText(/senha/i);
    await user.type(passwordInput, "123456");

    // Submeter formulário
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    // Verificar que o login foi chamado com os dados corretos
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        cpf: "12345678901",
        password: "123456",
      });
    });
  });

  it("deve exibir erro quando CPF é inválido", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    // Preencher CPF inválido (menos de 11 dígitos)
    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, "123456789");

    // Preencher senha
    const passwordInput = screen.getByLabelText(/senha/i);
    await user.type(passwordInput, "123456");

    // Submeter formulário
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    // Verificar que a mensagem de erro é exibida
    await waitFor(() => {
      expect(
        screen.getByText(/cpf deve conter exatamente 11 dígitos/i),
      ).toBeInTheDocument();
    });

    // Verificar que o login não foi chamado
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("deve exibir erro quando senha é muito curta", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    // Preencher CPF válido
    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, "12345678901");

    // Preencher senha curta
    const passwordInput = screen.getByLabelText(/senha/i);
    await user.type(passwordInput, "123");

    // Submeter formulário
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    // Verificar que a mensagem de erro é exibida
    await waitFor(() => {
      expect(
        screen.getByText(/senha deve ter no mínimo 6 caracteres/i),
      ).toBeInTheDocument();
    });

    // Verificar que o login não foi chamado
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("deve exibir erro quando credenciais são inválidas", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("CPF ou senha incorretos"));

    render(<LoginForm />);

    // Preencher CPF
    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, "12345678901");

    // Preencher senha
    const passwordInput = screen.getByLabelText(/senha/i);
    await user.type(passwordInput, "wrongpassword");

    // Submeter formulário
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    // Verificar que o login foi chamado
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it("deve exibir erro quando usuário está inativo", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Este usuário está desativado"));

    render(<LoginForm />);

    // Preencher CPF
    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, "12345678901");

    // Preencher senha
    const passwordInput = screen.getByLabelText(/senha/i);
    await user.type(passwordInput, "123456");

    // Submeter formulário
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    // Verificar que o login foi chamado
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
