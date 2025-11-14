import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { MenuService } from "@/_services/menu.service";
import type { CreateMenuRequest } from "@/_types/menu";

export function useCreateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuRequest) => MenuService.create(data),
    onSuccess: () => {
      // Invalidate both menus and menu-items queries to refresh the table
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(toastMessages.menu.createSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.menu.createError);
    },
  });
}
