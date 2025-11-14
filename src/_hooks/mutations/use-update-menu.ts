import { useMutation, useQueryClient } from "@tanstack/react-query";

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

      // Invalidate and refetch queries before returning
      await queryClient.invalidateQueries({ queryKey: ["menus"] });
      await queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      await queryClient.refetchQueries({ queryKey: ["menus"], type: "active" });

      return result;
    },
  });
}
