import { useQuery } from "@tanstack/react-query";

import { ReservationService } from "@/_services/reservation.service";
import type { ReservationStatus } from "@/_types/reservation";

interface UseGetAllReservationsParams {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

interface UseGetAllReservationsOptions {
  enabled?: boolean;
}

export function useGetAllReservations(
  params?: UseGetAllReservationsParams,
  options?: UseGetAllReservationsOptions,
) {
  return useQuery({
    queryKey: ["all-reservations", params],
    queryFn: () => ReservationService.getAllAdmin(params),
    enabled: options?.enabled ?? true,
  });
}
