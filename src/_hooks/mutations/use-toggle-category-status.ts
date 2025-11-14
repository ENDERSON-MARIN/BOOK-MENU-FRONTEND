import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { CategoryService } from "@/_services/category.service";

export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.toggleActive(id),
    onSuccess: () => {
      // Invalidate categories and menu-items queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(toastMessages.category.toggleStatusSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.category.toggleStatusError);
    },
  });
}
