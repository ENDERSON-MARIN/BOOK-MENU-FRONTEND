import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { MenuItemService } from "@/_services/menu-item.service";

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MenuItemService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["menu-items"],
        refetchType: "all",
      });
      toast.success(toastMessages.menuItem.deleteSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.menuItem.deleteError);
    },
  });
}
