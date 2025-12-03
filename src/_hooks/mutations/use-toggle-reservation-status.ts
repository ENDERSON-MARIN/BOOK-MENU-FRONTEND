import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { ReservationService } from "@/_services/reservation.service";
import type { ReservationStatus } from "@/_types/reservation";

interface ToggleReservationStatusParams {
  id: string;
  newStatus: ReservationStatus;
}

export function useToggleReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newStatus }: ToggleReservationStatusParams) =>
      ReservationService.toggleStatus(id, newStatus),
    onSuccess: (_, variables) => {
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
      queryClient.invalidateQueries({
        queryKey: ["reservation"],
        refetchType: "all",
      });
      // Invalidate all menu queries to update reservation status
      queryClient.invalidateQueries({
        queryKey: ["menus"],
        refetchType: "all",
      });

      // Show appropriate success message based on the action
      const successMessage =
        variables.newStatus === "CANCELLED"
          ? toastMessages.reservation.toggleStatusCancelSuccess
          : toastMessages.reservation.toggleStatusReactivateSuccess;

      toast.success(successMessage);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.reservation.toggleStatusError);
    },
  });
}
