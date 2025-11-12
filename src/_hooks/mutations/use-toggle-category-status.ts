import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryService } from "@/_services/category.service";

export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
