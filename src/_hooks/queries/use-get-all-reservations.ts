import { useQuery } from "@tanstack/react-query";

import { ReservationService } from "@/_services/reservation.service";
import type { ReservationStatus } from "@/_types/reservation";

interface UseGetAllReservationsParams {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export function useGetAllReservations(params?: UseGetAllReservationsParams) {
  return useQuery({
    queryKey: ["all-reservations", params],
    queryFn: () => ReservationService.getAllAdmin(params),
  });
}
