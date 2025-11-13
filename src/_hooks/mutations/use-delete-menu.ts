import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MenuService } from "@/_services/menu.service";

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MenuService.delete(id),
    onSuccess: () => {
      // Invalidate both menus and menu-items queries to refresh the table
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}
