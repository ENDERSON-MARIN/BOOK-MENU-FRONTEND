import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryService } from "@/_services/category.service";

export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.toggleActive(id),
    onSuccess: () => {
      // Invalidate categories and menu-items queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}
