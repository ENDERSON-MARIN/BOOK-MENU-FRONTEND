"use client";

import dayjs from "dayjs";

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

export function ReservationsReportChart({
  data,
}: ReservationsReportChartProps) {
  // Formatar dados para o gráfico com datas legíveis
  const chartData = data.dailyData.map((item) => ({
    date: dayjs(item.date).format("DD/MM"),
    total: item.total,
    confirmadas: item.confirmed,
    canceladas: item.cancelled,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Diária de Reservas</CardTitle>
        <CardDescription>
          Acompanhe o volume de reservas ao longo do período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          data={chartData}
          xKey="date"
          lines={[
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
          ]}
          height={350}
        />
      </CardContent>
    </Card>
  );
}
