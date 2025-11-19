import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { ReservationService } from "@/_services/reservation.service";
import type { CreateReservationRequest } from "@/_types/reservation";

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservationRequest) =>
      ReservationService.create(data),
    onSuccess: () => {
      // Invalidate all queries related to reservations and menus
      // Using partial queryKey to invalidate all variations with different params
      queryClient.invalidateQueries({
        queryKey: ["my-reservations"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["reservations"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["all-reservations"],
        refetchType: "all",
      });
      // Invalidate all menu queries (including those with parameters)
      queryClient.invalidateQueries({
        queryKey: ["menus"],
        refetchType: "all",
      });
      toast.success(toastMessages.reservation.createSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.reservation.createError);
    },
  });
}
