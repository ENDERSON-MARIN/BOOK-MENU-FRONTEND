import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { UserService } from "@/_services/user.service";
import type { CreateUserRequest } from "@/_types/user";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => UserService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(toastMessages.user.createSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.user.createError);
    },
  });
}
