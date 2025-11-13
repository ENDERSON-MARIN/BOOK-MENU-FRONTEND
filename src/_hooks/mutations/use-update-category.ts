import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryService } from "@/_services/category.service";
import type { UpdateCategoryRequest } from "@/_types/category";

interface UseUpdateCategoryParams {
  id: string;
  data: UpdateCategoryRequest;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UseUpdateCategoryParams) =>
      CategoryService.update(id, data),
    onSuccess: () => {
      // Invalidate categories and menu-items queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}
