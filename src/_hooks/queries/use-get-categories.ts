import { useQuery } from "@tanstack/react-query";

import { CategoryService } from "@/_services/category.service";

interface UseGetCategoriesParams {
  isActive?: boolean;
}

export function useGetCategories(params?: UseGetCategoriesParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => CategoryService.getAll(params),
  });
}
