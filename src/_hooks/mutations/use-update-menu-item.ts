import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MenuItemService } from "@/_services/menu-item.service";
import type { UpdateMenuItemRequest } from "@/_types/menu-item";

interface UseUpdateMenuItemParams {
  id: string;
  data: UpdateMenuItemRequest;
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UseUpdateMenuItemParams) =>
      MenuItemService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}
