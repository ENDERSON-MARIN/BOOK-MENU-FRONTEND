import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MenuService } from "@/_services/menu.service";

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MenuService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}
