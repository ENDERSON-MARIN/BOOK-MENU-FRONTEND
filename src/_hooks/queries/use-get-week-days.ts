import { useQuery } from "@tanstack/react-query";

import { WeekDayService } from "@/_services/week-day.service";

export function useGetWeekDays() {
  return useQuery({
    queryKey: ["week-days"],
    queryFn: () => WeekDayService.getAll(),
  });
}
