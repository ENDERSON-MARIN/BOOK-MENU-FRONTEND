import dayjs from "dayjs";
import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { ReservationReportData } from "@/_types/report";

interface ReservationsReportWeeklyProps {
  data: ReservationReportData;
}

export function ReservationsReportWeekly({
  data,
}: ReservationsReportWeeklyProps) {
  if (!data.weeklyData || data.weeklyData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agrupamento Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.weeklyData.map((week, index) => (
            <div
              key={`${week.weekStart}-${week.weekEnd}`}
              className="hover:bg-muted/50 flex flex-col gap-3 rounded-lg border p-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium sm:text-sm">
                  Semana {index + 1}
                </span>
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  {dayjs(week.weekStart).format("DD/MM/YYYY")} -{" "}
                  {dayjs(week.weekEnd).format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <span className="text-primary text-xl font-bold sm:text-2xl">
                  {week.total}
                </span>
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  reservas
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
