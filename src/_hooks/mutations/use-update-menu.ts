import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessages } from "@/_lib/toast-messages";
import { MenuService } from "@/_services/menu.service";
import type { UpdateMenuRequest } from "@/_types/menu";

interface UseUpdateMenuParams {
  id: string;
  data: UpdateMenuRequest;
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UseUpdateMenuParams) => {
      const result = await MenuService.update(id, data);

      // Invalidate and refetch queries before returning
      await queryClient.invalidateQueries({ queryKey: ["menus"] });
      await queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      await queryClient.refetchQueries({ queryKey: ["menus"], type: "active" });

      return result;
    },
    onSuccess: () => {
      toast.success(toastMessages.menu.updateSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.menu.updateError);
    },
  });
}
