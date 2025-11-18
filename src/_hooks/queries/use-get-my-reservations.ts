import { useQuery } from "@tanstack/react-query";

import { criticalQueryRetry } from "@/_lib/query-utils";
import { ReservationService } from "@/_services/reservation.service";
import type { ReservationStatus } from "@/_types/reservation";

interface UseGetMyReservationsParams {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}

interface UseGetMyReservationsOptions {
  enabled?: boolean;
}

export function useGetMyReservations(
  params?: UseGetMyReservationsParams,
  options?: UseGetMyReservationsOptions,
) {
  return useQuery({
    queryKey: ["my-reservations", params],
    queryFn: () => ReservationService.getMyReservations(params),
    enabled: options?.enabled ?? true,
    ...criticalQueryRetry,
  });
}
