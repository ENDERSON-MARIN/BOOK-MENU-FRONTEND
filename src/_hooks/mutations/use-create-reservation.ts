import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ReservationService } from "@/_services/reservation.service";
import type { CreateReservationRequest } from "@/_types/reservation";

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservationRequest) =>
      ReservationService.create(data),
    onSuccess: () => {
      // Invalidate all queries related to reservations and menus
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
      // Invalidate all menu queries (including those with parameters)
      queryClient.invalidateQueries({
        queryKey: ["menus"],
        refetchType: "all",
      });
    },
  });
}
