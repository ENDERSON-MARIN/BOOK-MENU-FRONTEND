import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AppError } from "@/_errors/AppError";
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
      // Handle specific error cases based on status code
      if (error instanceof AppError) {
        switch (error.statusCode) {
          case 400:
            // Bad request - likely deadline expired
            toast.error(toastMessages.reservation.toggleStatusDeadlineExpired);
            break;
          case 403:
            // Forbidden - no permission
            toast.error(toastMessages.reservation.toggleStatusForbidden);
            break;
          case 404:
            // Not found
            toast.error(toastMessages.reservation.toggleStatusNotFound);
            break;
          case 500:
            // Server error
            toast.error(toastMessages.reservation.toggleStatusServerError);
            break;
          default:
            // Generic error with custom message if available
            toast.error(
              error.message || toastMessages.reservation.toggleStatusError,
            );
        }
      } else if (error.message?.includes("fetch")) {
        // Network error
        toast.error(toastMessages.reservation.toggleStatusNetworkError);
      } else {
        // Generic error fallback
        toast.error(
          error.message || toastMessages.reservation.toggleStatusError,
        );
      }
    },
  });
}
