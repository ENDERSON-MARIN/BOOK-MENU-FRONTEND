import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryService } from "@/_services/category.service";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
