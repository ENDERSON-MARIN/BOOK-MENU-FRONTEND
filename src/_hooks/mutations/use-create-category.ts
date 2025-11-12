import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryService } from "@/_services/category.service";
import type { CreateCategoryRequest } from "@/_types/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => CategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
