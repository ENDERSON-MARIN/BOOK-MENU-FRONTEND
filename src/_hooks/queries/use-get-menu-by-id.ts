import { useQuery } from "@tanstack/react-query";

import { MenuService } from "@/_services/menu.service";

export function useGetMenuById(id: string) {
  return useQuery({
    queryKey: ["menu", id],
    queryFn: () => MenuService.getById(id),
    enabled: !!id,
  });
}
