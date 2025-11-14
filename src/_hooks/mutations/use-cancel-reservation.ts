import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ReservationService } from "@/_services/reservation.service";

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ReservationService.cancel(id),
    onSuccess: () => {
      // Invalidate all queries related to reservations and menus
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
      // Invalidate all menu queries to update reservation status
      queryClient.invalidateQueries({
        queryKey: ["menus"],
        refetchType: "all",
      });
    },
  });
}
