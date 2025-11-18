"use client";

import {
  Calendar,
  CalendarCheck,
  CalendarX,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { cn } from "@/_lib/utils";
import { OperationalStatsReportData } from "@/_types/report";

interface OperationalStatsCardsProps {
  data: OperationalStatsReportData;
}

/**
 * Componente que exibe cards com métricas operacionais consolidadas
 * Organizado em grid 2x2 com 4 seções principais: Reservas, Usuários, Cardápios e Cancelamentos
 * Inclui card de tendência de crescimento com indicador visual
 *
 * @param data - Dados do relatório de estatísticas operacionais
 *
 * @example
 * <OperationalStatsCards data={operationalStatsData} />
 */
export function OperationalStatsCards({ data }: OperationalStatsCardsProps) {
  const {
    reservationMetrics,
    userMetrics,
    menuMetrics,
    cancellationMetrics,
    growthTrend,
  } = data;

  return (
    <div className="space-y-6">
      {/* Grid 2x2 de seções principais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Seção 1: Métricas de Reservas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-primary h-5 w-5" />
              Reservas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Total de Reservas
                </p>
                <p className="text-3xl font-bold">{reservationMetrics.total}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Média Diária</p>
                <p className="text-2xl font-semibold">
                  {reservationMetrics.dailyAverage.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Dia com Mais</p>
                  <p className="text-sm font-medium">
                    {new Date(
                      reservationMetrics.peakDay.date,
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </p>
                  <p className="text-primary text-lg font-bold">
                    {reservationMetrics.peakDay.count}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Dia com Menos</p>
                  <p className="text-sm font-medium">
                    {new Date(
                      reservationMetrics.lowestDay.date,
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </p>
                  <p className="text-muted-foreground text-lg font-bold">
                    {reservationMetrics.lowestDay.count}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 2: Métricas de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary h-5 w-5" />
              Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Usuários Ativos</p>
                <p className="text-3xl font-bold">{userMetrics.totalActive}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Taxa de Adesão</p>
                <p className="text-2xl font-semibold">
                  {userMetrics.adherenceRate.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Novos Usuários</p>
                <p className="text-primary text-2xl font-bold">
                  {userMetrics.newUsers}
                </p>
                <p className="text-muted-foreground text-xs">
                  no período selecionado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 3: Métricas de Cardápios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="text-primary h-5 w-5" />
              Cardápios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Total de Cardápios
                </p>
                <p className="text-3xl font-bold">{menuMetrics.totalMenus}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Média de Reservas por Cardápio
                </p>
                <p className="text-2xl font-semibold">
                  {menuMetrics.averageReservationsPerMenu.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">
                  Cardápio Mais Popular
                </p>
                <p className="text-sm font-medium">
                  {new Date(
                    menuMetrics.mostPopularMenu.date,
                  ).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="text-primary text-lg font-bold">
                  {menuMetrics.mostPopularMenu.reservations} reservas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 4: Métricas de Cancelamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarX className="text-destructive h-5 w-5" />
              Cancelamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Total de Cancelamentos
                </p>
                <p className="text-3xl font-bold">
                  {cancellationMetrics.total}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Taxa de Cancelamento
                </p>
                <p
                  className={cn(
                    "text-2xl font-semibold",
                    cancellationMetrics.rate > 20
                      ? "text-destructive"
                      : cancellationMetrics.rate > 10
                        ? "text-yellow-600 dark:text-yellow-500"
                        : "text-green-600 dark:text-green-500",
                  )}
                >
                  {cancellationMetrics.rate.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">
                  Horário Médio de Cancelamento
                </p>
                <p className="text-lg font-bold">
                  {cancellationMetrics.averageTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Tendência de Crescimento */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            Tendência de Crescimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Período Atual</p>
              <p className="text-2xl font-bold">{growthTrend.currentPeriod}</p>
              <p className="text-muted-foreground text-xs">reservas</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Período Anterior</p>
              <p className="text-2xl font-bold">{growthTrend.previousPeriod}</p>
              <p className="text-muted-foreground text-xs">reservas</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Variação</p>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-3xl font-bold",
                    growthTrend.percentageChange > 0
                      ? "text-green-600 dark:text-green-500"
                      : growthTrend.percentageChange < 0
                        ? "text-red-600 dark:text-red-500"
                        : "text-muted-foreground",
                  )}
                >
                  {growthTrend.percentageChange > 0 ? "+" : ""}
                  {growthTrend.percentageChange.toFixed(1)}%
                </p>
                {growthTrend.percentageChange > 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-500" />
                ) : growthTrend.percentageChange < 0 ? (
                  <CalendarX className="h-6 w-6 text-red-600 dark:text-red-500" />
                ) : (
                  <CalendarCheck className="text-muted-foreground h-6 w-6" />
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                {growthTrend.percentageChange > 0
                  ? "Crescimento em relação ao período anterior"
                  : growthTrend.percentageChange < 0
                    ? "Redução em relação ao período anterior"
                    : "Sem variação"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
