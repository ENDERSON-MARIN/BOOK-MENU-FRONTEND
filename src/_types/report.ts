// Types and interfaces for the Administrative Reports module

export type ReportType =
  | "reservations-period"
  | "popular-menus"
  | "active-users"
  | "operational-stats"
  | "waste-analysis";

export type ReportPeriod =
  | "last-week"
  | "last-month"
  | "last-3-months"
  | "last-year"
  | "custom";

export interface ReportFilters {
  startDate: string; // ISO date format (YYYY-MM-DD)
  endDate: string; // ISO date format (YYYY-MM-DD)
  status?: "CONFIRMED" | "CANCELLED" | "ALL";
  userType?: "FIXO" | "NAO_FIXO" | "ALL";
  reservationType?: "MANUAL" | "AUTOMATIC" | "ALL";
}

// Reservation Report Data Types
export interface ReservationReportData {
  summary: {
    totalReservations: number;
    activeReservations: number;
    cancelledReservations: number;
    cancellationRate: number;
  };
  dailyData: Array<{
    date: string;
    total: number;
    confirmed: number;
    cancelled: number;
  }>;
  weeklyData: Array<{
    weekStart: string;
    weekEnd: string;
    total: number;
  }>;
  reservations: Array<{
    id: string;
    date: string;
    userName: string;
    userCpf: string;
    menuSummary: string;
    variation: string;
    status: string;
    isAutomatic: boolean;
  }>;
}

// Popular Menus Report Data Types
export interface PopularMenusReportData {
  summary: {
    totalMenus: number;
    totalReservations: number;
    averageReservationsPerMenu: number;
  };
  topMenus: Array<{
    menuId: string;
    date: string;
    dayOfWeek: string;
    summary: string;
    totalReservations: number;
    adherenceRate: number;
    composition: Array<{
      categoryName: string;
      items: string[];
    }>;
    variationDistribution: {
      standard: number;
      withEgg: number;
    };
  }>;
}

// Active Users Report Data Types
export interface ActiveUsersReportData {
  summary: {
    totalActiveUsers: number;
    totalRegisteredUsers: number;
    adherenceRate: number;
  };
  userTypeDistribution: {
    fixo: number;
    naoFixo: number;
  };
  users: Array<{
    userId: string;
    name: string;
    cpf: string;
    userType: "FIXO" | "NAO_FIXO";
    totalReservations: number;
    cancelledReservations: number;
    cancellationRate: number;
  }>;
}

// Operational Stats Report Data Types
export interface OperationalStatsReportData {
  reservationMetrics: {
    total: number;
    dailyAverage: number;
    peakDay: { date: string; count: number };
    lowestDay: { date: string; count: number };
  };
  userMetrics: {
    totalActive: number;
    adherenceRate: number;
    newUsers: number;
  };
  menuMetrics: {
    totalMenus: number;
    averageReservationsPerMenu: number;
    mostPopularMenu: { date: string; reservations: number };
  };
  cancellationMetrics: {
    total: number;
    rate: number;
    averageTime: string;
  };
  dayOfWeekDistribution: Array<{
    dayOfWeek: string;
    count: number;
  }>;
  variationDistribution: {
    standard: number;
    withEgg: number;
  };
  growthTrend: {
    currentPeriod: number;
    previousPeriod: number;
    percentageChange: number;
  };
}

// Waste Report Data Types
export interface WasteReportData {
  summary: {
    totalCancellations: number;
    cancellationRate: number;
    estimatedWasteCost: number;
  };
  timeDistribution: {
    beforeDeadline: number;
    afterDeadline: number;
  };
  topCancellers: Array<{
    userId: string;
    userName: string;
    userCpf: string;
    totalCancellations: number;
    cancellationRate: number;
  }>;
  dailyTrend: Array<{
    date: string;
    cancellations: number;
  }>;
  patterns: {
    lastMinuteCancellations: number;
    recurringCancellers: number;
  };
}
