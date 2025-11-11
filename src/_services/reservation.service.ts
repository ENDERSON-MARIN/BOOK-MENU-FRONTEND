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
  async getMyReservations(
    params?: Omit<GetReservationsParams, "userId">,
  ): Promise<Reservation[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const query = queryParams.toString();
    const endpoint = query
      ? `/reservations/my-reservations?${query}`
      : "/reservations/my-reservations";

    return apiClient<Reservation[]>(endpoint);
  },

  async getAll(params?: GetReservationsParams): Promise<Reservation[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.userId) queryParams.append("userId", params.userId);

    const query = queryParams.toString();
    const endpoint = query ? `/reservations?${query}` : "/reservations";

    return apiClient<Reservation[]>(endpoint);
  },

  async getById(id: string): Promise<Reservation> {
    return apiClient<Reservation>(`/reservations/${id}`);
  },

  async create(data: CreateReservationRequest): Promise<Reservation> {
    return apiClient<Reservation>("/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: UpdateReservationRequest,
  ): Promise<Reservation> {
    return apiClient<Reservation>(`/reservations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async cancel(id: string): Promise<void> {
    return apiClient<void>(`/reservations/${id}`, {
      method: "DELETE",
    });
  },
};
