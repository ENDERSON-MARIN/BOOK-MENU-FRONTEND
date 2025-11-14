import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
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
      toast.success(toastMessages.category.updateSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.category.updateError);
    },
  });
}
