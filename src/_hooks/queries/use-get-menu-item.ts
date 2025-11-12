import { useQuery } from "@tanstack/react-query";

import { MenuItemService } from "@/_services/menu-item.service";

export function useGetMenuItem(id: string) {
  return useQuery({
    queryKey: ["menu-items", id],
    queryFn: () => MenuItemService.getById(id),
    enabled: !!id,
  });
}
