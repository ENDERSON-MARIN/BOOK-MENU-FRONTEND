import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { UserService } from "@/_services/user.service";
import { UserStatus } from "@/_types/user";

interface ToggleUserStatusParams {
  id: string;
  newStatus: UserStatus;
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newStatus }: ToggleUserStatusParams) =>
      UserService.toggleStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(toastMessages.user.toggleStatusSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.user.toggleStatusError);
    },
  });
}
