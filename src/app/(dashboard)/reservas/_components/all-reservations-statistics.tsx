"use client";

import { Calendar, CheckCircle, TrendingUp, XCircle } from "lucide-react";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Skeleton } from "@/_components/ui/skeleton";
import { useGetAllReservations } from "@/_hooks/queries/use-get-all-reservations";
import { ReservationStatus } from "@/_types/reservation";

interface AllReservationsStatisticsProps {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

const AllReservationsStatistics = ({
  status,
  startDate,
  endDate,
  userId,
}: AllReservationsStatisticsProps) => {
  const { data: reservations, isLoading } = useGetAllReservations({
    status,
    startDate,
    endDate,
    userId,
  });

  const statistics = useMemo(() => {
    if (!reservations) {
      return {
        total: 0,
        active: 0,
        cancelled: 0,
        byDay: {} as Record<string, number>,
      };
    }

    const stats = {
      total: reservations.length,
      active: reservations.filter((r) => r.status === "ACTIVE").length,
      cancelled: reservations.filter((r) => r.status === "CANCELLED").length,
      byDay: {} as Record<string, number>,
    };

    // Count reservations by day
    reservations.forEach((reservation) => {
      const date = reservation.reservationDate;
      stats.byDay[date] = (stats.byDay[date] || 0) + 1;
    });

    return stats;
  }, [reservations]);

  const topDays = useMemo(() => {
    return Object.entries(statistics.byDay)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [statistics.byDay]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Reservas
          </CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.total}</div>
          <p className="text-muted-foreground text-xs">
            {statistics.active} ativas, {statistics.cancelled} canceladas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
          <CheckCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.active}</div>
          <p className="text-muted-foreground text-xs">
            {statistics.total > 0
              ? `${((statistics.active / statistics.total) * 100).toFixed(1)}% do total`
              : "Nenhuma reserva"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Reservas Canceladas
          </CardTitle>
          <XCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.cancelled}</div>
          <p className="text-muted-foreground text-xs">
            {statistics.total > 0
              ? `${((statistics.cancelled / statistics.total) * 100).toFixed(1)}% do total`
              : "Nenhuma reserva"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Dias com Mais Reservas
          </CardTitle>
          <Calendar className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          {topDays.length > 0 ? (
            <div className="space-y-1">
              {topDays.map(([date, count]) => (
                <div key={date} className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    {new Date(date).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-xs font-medium">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              Nenhuma reserva encontrada
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllReservationsStatistics;
