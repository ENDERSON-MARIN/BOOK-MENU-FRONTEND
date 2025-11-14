import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ReservationService } from "@/_services/reservation.service";
import type { UpdateReservationRequest } from "@/_types/reservation";

interface UseUpdateReservationParams {
  id: string;
  data: UpdateReservationRequest;
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UseUpdateReservationParams) =>
      ReservationService.update(id, data),
    onSuccess: () => {
      // Invalidate all queries related to reservations and menus
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservation"] });
      // Invalidate all menu queries to update reservation status
      queryClient.invalidateQueries({
        queryKey: ["menus"],
        refetchType: "all",
      });
    },
  });
}
