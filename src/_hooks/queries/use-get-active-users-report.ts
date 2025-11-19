import { useQuery } from "@tanstack/react-query";

import { criticalQueryRetry } from "@/_lib/query-utils";
import { reportService } from "@/_services/report.service";
import type { ReportFilters } from "@/_types/report";

/**
 * Hook to fetch active users report data
 * Shows which users made reservations and their engagement statistics
 *
 * @param filters - Report filters including date range and optional user type filter
 * @returns Query result with ActiveUsersReportData
 */
export function useGetActiveUsersReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["active-users-report", filters],
    queryFn: () => reportService.getActiveUsersReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    enabled: !!filters.startDate && !!filters.endDate,
    ...criticalQueryRetry,
  });
}
