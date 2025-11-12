import { useQuery } from "@tanstack/react-query";

import { CategoryService } from "@/_services/category.service";

export function useGetCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => CategoryService.getById(id),
    enabled: !!id,
  });
}
