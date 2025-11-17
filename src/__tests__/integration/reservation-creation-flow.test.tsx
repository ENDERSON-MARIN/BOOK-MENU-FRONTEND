import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Dialog } from "@/_components/ui/dialog";

import ReservationFormDialog from "../../app/(dashboard)/cardapios/_components/reservation-form-dialog";

// Mock dependencies
const mockMutate = vi.fn();

vi.mock("@/_hooks/mutations/use-create-reservation", () => ({
  useCreateReservation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

vi.mock("@/_lib/date-utils", () => ({
  isBeforeCutoffTime: () => true,
  formatDateBR: () => "01/12/2025",
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockMenu = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  date: "2025-12-01",
  dayOfWeek: "MONDAY" as const,
  weekNumber: 48,
  observations: "Cardápio especial",
  isActive: true,
  menuCompositions: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      menuItemId: "550e8400-e29b-41d4-a716-446655440002",
      menuItem: {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Frango Grelhado",
        description: "Frango grelhado com temperos",
        categoryId: "550e8400-e29b-41d4-a716-446655440003",
        category: {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Proteína",
          description: "Proteínas",
          displayOrder: 1,
          isActive: true,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-01",
        },
        isActive: true,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      },
      isMainProtein: true,
      isAlternativeProtein: false,
    },
  ],
  variations: [
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      menuId: "550e8400-e29b-41d4-a716-446655440000",
      variationType: "STANDARD" as const,
      proteinItemId: "",
      isDefault: true,
      proteinItem: undefined,
      createdAt: "2025-01-01",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      menuId: "550e8400-e29b-41d4-a716-446655440000",
      variationType: "EGG_SUBSTITUTE" as const,
      proteinItemId: "550e8400-e29b-41d4-a716-446655440006",
      isDefault: false,
      proteinItem: {
        id: "550e8400-e29b-41d4-a716-446655440006",
        name: "Ovo Frito",
        description: "Ovo frito",
        categoryId: "550e8400-e29b-41d4-a716-446655440003",
        isActive: true,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      },
      createdAt: "2025-01-01",
    },
  ],
  createdAt: "2025-01-01",
  updatedAt: "2025-01-01",
};

describe("Reservation Creation Flow Integration", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Dialog open={true}>{ui}</Dialog>
      </QueryClientProvider>,
    );
  };

  it("deve criar reserva com sucesso selecionando variação padrão", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    mockMutate.mockImplementation((_data, callbacks) => {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    });

    renderWithProviders(
      <ReservationFormDialog menu={mockMenu} onSuccess={onSuccess} />,
    );

    // Aguardar o formulário carregar
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /confirmar reserva/i }),
      ).toBeInTheDocument();
    });

    // A variação padrão já deve estar selecionada por padrão
    // Verificar que a variação padrão está selecionada
    const defaultVariation = screen.getByRole("radio", { name: /padrão/i });
    expect(defaultVariation).toBeChecked();

    // Clicar no botão de confirmar
    const submitButton = screen.getByRole("button", {
      name: /confirmar reserva/i,
    });
    await user.click(submitButton);

    // Verificar que a mutation foi chamada
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    // Verificar que o callback de sucesso foi chamado
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("deve criar reserva com sucesso selecionando variação com ovo", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    mockMutate.mockImplementation((_data, callbacks) => {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    });

    renderWithProviders(
      <ReservationFormDialog menu={mockMenu} onSuccess={onSuccess} />,
    );

    // Aguardar o formulário carregar
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /confirmar reserva/i }),
      ).toBeInTheDocument();
    });

    // Selecionar variação com ovo
    const eggVariation = screen.getByRole("radio", { name: /com ovo/i });
    await user.click(eggVariation);

    // Verificar que a variação foi selecionada
    await waitFor(() => {
      expect(eggVariation).toBeChecked();
    });

    // Clicar no botão de confirmar
    const submitButton = screen.getByRole("button", {
      name: /confirmar reserva/i,
    });
    await user.click(submitButton);

    // Verificar que a mutation foi chamada
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    // Verificar que o callback de sucesso foi chamado
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("deve exibir composição completa do cardápio", async () => {
    renderWithProviders(
      <ReservationFormDialog menu={mockMenu} onSuccess={() => {}} />,
    );

    // Verificar que os itens do cardápio são exibidos
    const frangoElements = screen.getAllByText(/frango grelhado/i);
    expect(frangoElements.length).toBeGreaterThan(0);

    expect(
      screen.getByText(/frango grelhado com temperos/i),
    ).toBeInTheDocument();
  });

  it("deve exibir todas as variações disponíveis", async () => {
    renderWithProviders(
      <ReservationFormDialog menu={mockMenu} onSuccess={() => {}} />,
    );

    // Verificar que as variações são exibidas
    expect(screen.getAllByText(/padrão/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/com ovo/i)).toBeInTheDocument();
  });
});
