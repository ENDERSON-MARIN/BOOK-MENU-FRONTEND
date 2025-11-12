import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MenuItemService } from "@/_services/menu-item.service";

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MenuItemService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}
