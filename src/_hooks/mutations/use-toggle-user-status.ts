import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UserService } from "@/_services/user.service";

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
