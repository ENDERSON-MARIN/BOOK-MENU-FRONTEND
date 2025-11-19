"use client";

import dayjs from "dayjs";
import { memo, useMemo } from "react";

import { LineChart } from "@/_components/charts/line-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { ReservationReportData } from "@/_types/report";

interface ReservationsReportChartProps {
  data: ReservationReportData;
}

export const ReservationsReportChart = memo(function ReservationsReportChart({
  data,
}: ReservationsReportChartProps) {
  // Formatar dados para o gráfico com datas legíveis
  const chartData = useMemo(
    () =>
      data.dailyData.map((item) => ({
        date: dayjs(item.date).format("DD/MM"),
        total: item.total,
        confirmadas: item.confirmed,
        canceladas: item.cancelled,
      })),
    [data.dailyData],
  );

  const lines = useMemo(
    () => [
      {
        dataKey: "total",
        name: "Total",
        color: "#1b994b",
      },
      {
        dataKey: "confirmadas",
        name: "Confirmadas",
        color: "#10b981",
      },
      {
        dataKey: "canceladas",
        name: "Canceladas",
        color: "#ef4444",
      },
    ],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Diária de Reservas</CardTitle>
        <CardDescription>
          Acompanhe o volume de reservas ao longo do período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart data={chartData} xKey="date" lines={lines} height={350} />
      </CardContent>
    </Card>
  );
});
