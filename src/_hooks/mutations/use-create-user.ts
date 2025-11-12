import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UserService } from "@/_services/user.service";
import type { CreateUserRequest } from "@/_types/user";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => UserService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
