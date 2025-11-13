import { useQuery } from "@tanstack/react-query";

import { ReservationService } from "@/_services/reservation.service";

export function useGetReservation(id: string) {
  return useQuery({
    queryKey: ["reservation", id],
    queryFn: () => ReservationService.getById(id),
    enabled: !!id,
  });
}
