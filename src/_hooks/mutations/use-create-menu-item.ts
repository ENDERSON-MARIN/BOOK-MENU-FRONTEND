import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { MenuItemService } from "@/_services/menu-item.service";
import type { CreateMenuItemRequest } from "@/_types/menu-item";

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuItemRequest) => MenuItemService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(toastMessages.menuItem.createSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.menuItem.createError);
    },
  });
}
