import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { UserService } from "@/_services/user.service";
import type { UpdateUserRequest } from "@/_types/user";

interface UseUpdateUserParams {
  id: string;
  data: UpdateUserRequest;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UseUpdateUserParams) =>
      UserService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(toastMessages.user.updateSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.user.updateError);
    },
  });
}
