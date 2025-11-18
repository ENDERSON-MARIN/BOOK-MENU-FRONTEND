import { apiClient } from "@/_lib/api-client";
import type { Menu } from "@/_types/menu";
import type {
  ActiveUsersReportData,
  OperationalStatsReportData,
  PopularMenusReportData,
  ReportFilters,
  ReservationReportData,
  WasteReportData,
} from "@/_types/report";
import type { Reservation } from "@/_types/reservation";
import type { User } from "@/_types/user";

import {
  processActiveUsersData,
  processOperationalStatsData,
  processPopularMenusData,
  processReservationsData,
  processWasteData,
} from "./report-processors";

/**
 * Service for generating administrative reports
 * Fetches data from API and processes it into report-ready formats
 */
export const reportService = {
  /**
   * Generates a reservations report for a given period
   * Fetches all reservations and processes them into summary statistics,
   * daily/weekly aggregations, and detailed reservation list
   */
  async getReservationsReport(
    filters: ReportFilters,
  ): Promise<ReservationReportData> {
    // Build query parameters
    const params = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    // Add optional status filter
    if (filters.status && filters.status !== "ALL") {
      params.append("status", filters.status);
    }

    // Fetch reservations from admin endpoint
    const reservations = await apiClient<Reservation[]>(
      `/lunch-reservation/admin/reservations?${params}`,
    );

    // Process data into report format
    return processReservationsData(reservations, filters);
  },

  /**
   * Generates a popular menus report
   * Analyzes which menus had the most reservations and calculates adherence rates
   */
  async getPopularMenusReport(
    filters: ReportFilters,
  ): Promise<PopularMenusReportData> {
    // Fetch both reservations and menus for the period
    const [reservations, menus] = await Promise.all([
      apiClient<Reservation[]>(
        `/lunch-reservation/admin/reservations?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
      apiClient<Menu[]>(
        `/lunch-reservation/menus?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
    ]);

    // Filter only active reservations for the report
    const activeReservations = reservations.filter(
      (r) => r.status === "ACTIVE",
    );

    return processPopularMenusData(activeReservations, menus);
  },

  /**
   * Generates an active users report
   * Shows which users made reservations and their engagement statistics
   */
  async getActiveUsersReport(
    filters: ReportFilters,
  ): Promise<ActiveUsersReportData> {
    // Fetch reservations and all users
    const [reservations, users] = await Promise.all([
      apiClient<Reservation[]>(
        `/lunch-reservation/admin/reservations?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
      apiClient<User[]>("/lunch-reservation/users?includeInactive=false"),
    ]);

    return processActiveUsersData(reservations, users, filters);
  },

  /**
   * Generates operational statistics report
   * Provides comprehensive metrics about system usage
   */
  async getOperationalStatsReport(
    filters: ReportFilters,
  ): Promise<OperationalStatsReportData> {
    // Fetch all necessary data
    const [reservations, users, menus] = await Promise.all([
      apiClient<Reservation[]>(
        `/lunch-reservation/admin/reservations?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
      apiClient<User[]>("/lunch-reservation/users?includeInactive=false"),
      apiClient<Menu[]>(
        `/lunch-reservation/menus?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
    ]);

    return processOperationalStatsData(reservations, users, menus, filters);
  },

  /**
   * Generates waste and cancellations report
   * Analyzes cancellation patterns to identify waste opportunities
   */
  async getWasteReport(filters: ReportFilters): Promise<WasteReportData> {
    // Fetch only cancelled reservations using status filter
    const reservations = await apiClient<Reservation[]>(
      `/lunch-reservation/admin/reservations?startDate=${filters.startDate}&endDate=${filters.endDate}&status=CANCELLED`,
    );

    return processWasteData(reservations, filters);
  },
};
