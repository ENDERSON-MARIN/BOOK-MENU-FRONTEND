import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MenuService } from "@/_services/menu.service";
import type { CreateMenuRequest } from "@/_types/menu";

export function useCreateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuRequest) => MenuService.create(data),
    onSuccess: () => {
      // Invalidate both menus and menu-items queries to refresh the table
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}
