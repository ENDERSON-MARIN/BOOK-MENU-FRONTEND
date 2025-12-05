import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { MenuService } from "@/_services/menu.service";

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MenuService.delete(id),
    onSuccess: () => {
      // Invalidate both menus and menu-items queries to refresh the table
      queryClient.invalidateQueries({
        queryKey: ["menus"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["menu-items"],
        refetchType: "all",
      });
      toast.success(toastMessages.menu.deleteSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.menu.deleteError);
    },
  });
}
