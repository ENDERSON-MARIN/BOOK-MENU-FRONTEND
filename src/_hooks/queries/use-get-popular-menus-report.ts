import { useQuery } from "@tanstack/react-query";

import { criticalQueryRetry } from "@/_lib/query-utils";
import { reportService } from "@/_services/report.service";
import type { ReportFilters } from "@/_types/report";

/**
 * Hook to fetch popular menus report data
 * Analyzes which menus had the most reservations and calculates adherence rates
 *
 * @param filters - Report filters including date range
 * @returns Query result with PopularMenusReportData
 */
export function useGetPopularMenusReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["popular-menus-report", filters],
    queryFn: async () => {
      try {
        return await reportService.getPopularMenusReport(filters);
      } catch (error) {
        console.error("Error fetching popular menus report:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    enabled: !!filters.startDate && !!filters.endDate,
    ...criticalQueryRetry,
  });
}
