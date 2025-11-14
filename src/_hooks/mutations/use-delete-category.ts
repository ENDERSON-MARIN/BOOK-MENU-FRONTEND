import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { CategoryService } from "@/_services/category.service";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => {
      // Invalidate categories and menu-items queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(toastMessages.category.deleteSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.category.deleteError);
    },
  });
}
