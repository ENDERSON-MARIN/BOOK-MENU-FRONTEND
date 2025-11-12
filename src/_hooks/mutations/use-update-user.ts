import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    },
  });
}
