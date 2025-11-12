import { useQuery } from "@tanstack/react-query";

import { MenuService } from "@/_services/menu.service";
import type { DayOfWeek } from "@/_types/menu";

interface UseGetMenusParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  dayOfWeek?: DayOfWeek;
  isActive?: boolean;
  weekNumber?: number;
}

export function useGetMenus(params?: UseGetMenusParams) {
  return useQuery({
    queryKey: ["menus", params],
    queryFn: () => MenuService.getAll(params),
  });
}
