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
      console.log("🔄 Calling MenuService.update with:", {
        id,
        itemsCount: data.menuItems.length,
      });
      const result = await MenuService.update(id, data);
      console.log("📥 Backend response:", result);
      console.log(
        "📊 Response has menuCompositions:",
        !!result.menuCompositions,
      );

      return result;
    },
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
      toast.success(toastMessages.menu.updateSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.menu.updateError);
    },
  });
}
