import { useQuery } from "@tanstack/react-query";

import { MenuService } from "@/_services/menu.service";

export function useGetMenu(id: string) {
  return useQuery({
    queryKey: ["menus", id],
    queryFn: () => MenuService.getById(id),
    enabled: !!id,
  });
}
