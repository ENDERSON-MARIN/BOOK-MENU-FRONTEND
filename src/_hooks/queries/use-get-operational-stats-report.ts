import { useQuery } from "@tanstack/react-query";

import { criticalQueryRetry } from "@/_lib/query-utils";
import { reportService } from "@/_services/report.service";
import type { ReportFilters } from "@/_types/report";

/**
 * Hook to fetch operational statistics report data
 * Provides comprehensive metrics about system usage including reservations,
 * users, menus, cancellations, and growth trends
 *
 * @param filters - Report filters including date range
 * @returns Query result with OperationalStatsReportData
 */
export function useGetOperationalStatsReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["operational-stats-report", filters],
    queryFn: () => reportService.getOperationalStatsReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    enabled: !!filters.startDate && !!filters.endDate,
    ...criticalQueryRetry,
  });
}
