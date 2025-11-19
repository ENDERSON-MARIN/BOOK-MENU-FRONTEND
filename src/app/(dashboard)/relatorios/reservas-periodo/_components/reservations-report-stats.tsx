"use client";

import { CalendarCheck, CalendarX, FileText, TrendingDown } from "lucide-react";

import { StatCard } from "@/_components/reports/stat-card";
import { ReservationReportData } from "@/_types/report";

interface ReservationsReportStatsProps {
  data: ReservationReportData;
}

export function ReservationsReportStats({
  data,
}: ReservationsReportStatsProps) {
  const { summary } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={FileText}
        title="Total de Reservas"
        value={summary.totalReservations}
        description="Reservas no período"
      />

      <StatCard
        icon={CalendarCheck}
        title="Reservas Ativas"
        value={summary.activeReservations}
        description="Confirmadas"
      />

      <StatCard
        icon={CalendarX}
        title="Reservas Canceladas"
        value={summary.cancelledReservations}
        description="Cancelamentos no período"
      />

      <StatCard
        icon={TrendingDown}
        title="Taxa de Cancelamento"
        value={`${summary.cancellationRate.toFixed(1)}%`}
        description="Percentual de cancelamentos"
      />
    </div>
  );
}
