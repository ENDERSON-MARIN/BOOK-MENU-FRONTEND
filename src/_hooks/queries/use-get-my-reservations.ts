import { useQuery } from "@tanstack/react-query";

import { ReservationService } from "@/_services/reservation.service";
import type { ReservationStatus } from "@/_types/reservation";

interface UseGetMyReservationsParams {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}

export function useGetMyReservations(params?: UseGetMyReservationsParams) {
  return useQuery({
    queryKey: ["my-reservations", params],
    queryFn: () => ReservationService.getMyReservations(params),
  });
}
