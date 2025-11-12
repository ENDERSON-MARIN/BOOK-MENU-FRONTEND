import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MenuService } from "@/_services/menu.service";
import type { UpdateMenuRequest } from "@/_types/menu";

interface UseUpdateMenuParams {
  id: string;
  data: UpdateMenuRequest;
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UseUpdateMenuParams) =>
      MenuService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}
