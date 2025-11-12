import { useQuery } from "@tanstack/react-query";

import { MenuItemService } from "@/_services/menu-item.service";

interface UseGetMenuItemsParams {
  categoryId?: string;
  isActive?: boolean;
}

export function useGetMenuItems(params?: UseGetMenuItemsParams) {
  return useQuery({
    queryKey: ["menu-items", params],
    queryFn: () => MenuItemService.getAll(params),
  });
}
