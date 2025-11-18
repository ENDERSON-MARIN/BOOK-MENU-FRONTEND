import { useQuery } from "@tanstack/react-query";

import { criticalQueryRetry } from "@/_lib/query-utils";
import { reportService } from "@/_services/report.service";
import type { ReportFilters } from "@/_types/report";

/**
 * Hook to fetch reservations report data
 * Provides summary statistics, daily/weekly aggregations, and detailed reservation list
 *
 * @param filters - Report filters including date range and optional status/type filters
 * @returns Query result with ReservationReportData
 */
export function useGetReservationsReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["reservations-report", filters],
    queryFn: () => reportService.getReservationsReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    enabled: !!filters.startDate && !!filters.endDate,
    ...criticalQueryRetry,
  });
}
