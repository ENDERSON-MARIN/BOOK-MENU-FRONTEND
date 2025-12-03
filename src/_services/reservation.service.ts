import { apiClient } from "@/_lib/api-client";
import type {
  CreateReservationRequest,
  Reservation,
  ReservationStatus,
  UpdateReservationRequest,
} from "@/_types/reservation";

interface GetReservationsParams {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export const ReservationService = {
  // GET /api/lunch-reservation/reservations - Retorna as reservas do usuário logado
  async getMyReservations(
    params?: Omit<GetReservationsParams, "userId">,
  ): Promise<Reservation[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const query = queryParams.toString();
    const endpoint = query
      ? `/lunch-reservation/reservations?${query}`
      : "/lunch-reservation/reservations";

    return apiClient<Reservation[]>(endpoint);
  },

  // GET /api/lunch-reservation/reservations/active - Retorna reservas ativas do usuário
  async getActiveReservations(): Promise<Reservation[]> {
    return apiClient<Reservation[]>("/lunch-reservation/reservations/active");
  },

  // Alias para getMyReservations (compatibilidade)
  async getAll(
    params?: Omit<GetReservationsParams, "userId">,
  ): Promise<Reservation[]> {
    return this.getMyReservations(params);
  },

  // GET /api/lunch-reservation/admin/reservations - Admin: todas as reservas
  async getAllAdmin(params?: GetReservationsParams): Promise<Reservation[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.userId) queryParams.append("userId", params.userId);

    const query = queryParams.toString();
    const endpoint = query
      ? `/lunch-reservation/admin/reservations?${query}`
      : "/lunch-reservation/admin/reservations";

    return apiClient<Reservation[]>(endpoint);
  },

  // GET /api/lunch-reservation/reservations/{id}
  async getById(id: string): Promise<Reservation> {
    return apiClient<Reservation>(`/lunch-reservation/reservations/${id}`);
  },

  // POST /api/lunch-reservation/reservations
  async create(data: CreateReservationRequest): Promise<Reservation> {
    return apiClient<Reservation>("/lunch-reservation/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT /api/lunch-reservation/reservations/{id}
  async update(
    id: string,
    data: UpdateReservationRequest,
  ): Promise<Reservation> {
    return apiClient<Reservation>(`/lunch-reservation/reservations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/lunch-reservation/reservations/{id}
  async cancel(id: string): Promise<void> {
    return apiClient<void>(`/lunch-reservation/reservations/${id}`, {
      method: "DELETE",
    });
  },

  // PUT /api/lunch-reservation/admin/reservations/{id}/status
  async toggleStatus(
    id: string,
    status: ReservationStatus,
  ): Promise<Reservation> {
    return apiClient<Reservation>(
      `/lunch-reservation/admin/reservations/${id}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      },
    );
  },
};
