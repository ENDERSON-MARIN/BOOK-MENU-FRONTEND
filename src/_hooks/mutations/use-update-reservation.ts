import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
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
      toast.success(toastMessages.reservation.updateSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.reservation.updateError);
    },
  });
}
