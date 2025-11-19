import { useQuery } from "@tanstack/react-query";

import { criticalQueryRetry } from "@/_lib/query-utils";
import { reportService } from "@/_services/report.service";
import type { ReportFilters } from "@/_types/report";

/**
 * Hook to fetch waste and cancellations report data
 * Analyzes cancellation patterns to identify waste opportunities and
 * provides insights on user behavior
 *
 * @param filters - Report filters including date range
 * @returns Query result with WasteReportData
 */
export function useGetWasteReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["waste-report", filters],
    queryFn: () => reportService.getWasteReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    enabled: !!filters.startDate && !!filters.endDate,
    ...criticalQueryRetry,
  });
}
