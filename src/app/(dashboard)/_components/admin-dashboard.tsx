"use client";

import dayjs from "dayjs";
import {
  Calendar,
  CheckCircle2,
  Clock,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { useGetAllReservations } from "@/_hooks/queries/use-get-all-reservations";
import { useGetMenus } from "@/_hooks/queries/use-get-menus";
import { formatDateBR, getTodayFormatted } from "@/_lib/date-utils";

const DAY_OF_WEEK_PT: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export function AdminDashboard() {
  const today = getTodayFormatted();
  const nextWeek = dayjs().add(7, "days").format("YYYY-MM-DD");

  const { data: upcomingMenus, isLoading: isLoadingMenus } = useGetMenus({
    startDate: today,
    endDate: nextWeek,
    isActive: true,
  });

  const { data: allReservations, isLoading: isLoadingReservations } =
    useGetAllReservations({
      startDate: today,
    });

  const { data: allReservationsForStats, isLoading: isLoadingCancelled } =
    useGetAllReservations();

  const activeReservations =
    allReservations?.filter((res) => res.status === "ACTIVE") || [];

  const cancelledReservations =
    allReservationsForStats?.filter((res) => res.status === "CANCELLED") || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Reservas Ativas
              </CardTitle>
              <CheckCircle2 className="text-muted-foreground h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingReservations ? (
                <div className="bg-muted h-8 w-12 animate-pulse rounded" />
              ) : (
                activeReservations.length
              )}
            </div>
            <p className="text-muted-foreground text-xs">Próximas refeições</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Cancelamentos
              </CardTitle>
              <XCircle className="text-muted-foreground h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingCancelled ? (
                <div className="bg-muted h-8 w-12 animate-pulse rounded" />
              ) : (
                cancelledReservations.length
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Total de cancelamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Cardápios da Semana
              </CardTitle>
              <Calendar className="text-muted-foreground h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingMenus ? (
                <div className="bg-muted h-8 w-12 animate-pulse rounded" />
              ) : (
                upcomingMenus?.length || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Prazo de Reserva
              </CardTitle>
              <Clock className="text-muted-foreground h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8:30 AM</div>
            <p className="text-muted-foreground text-xs">
              Horário limite diário
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Menus */}
        <Card>
          <CardHeader>
            <CardTitle>Cardápios da Semana</CardTitle>
            <CardDescription>Próximos cardápios cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMenus ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-muted h-16 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : upcomingMenus && upcomingMenus.length > 0 ? (
              <div className="space-y-3">
                {upcomingMenus.slice(0, 5).map((menu) => {
                  const reservationCount =
                    allReservations?.filter(
                      (res) =>
                        res.menuId === menu.id && res.status === "ACTIVE",
                    ).length || 0;

                  return (
                    <div
                      key={menu.id}
                      className="border-border flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">
                            {formatDateBR(menu.date)}
                          </p>
                          <span className="text-muted-foreground text-xs">
                            • {DAY_OF_WEEK_PT[menu.dayOfWeek]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="text-muted-foreground h-3 w-3" />
                          <p className="text-muted-foreground text-xs">
                            {reservationCount}{" "}
                            {reservationCount === 1 ? "reserva" : "reservas"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto"
                        asChild
                      >
                        <Link href="/cardapios">Ver</Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center text-sm">
                <p>Nenhum cardápio cadastrado</p>
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/cardapios">Gerenciar Cardápios</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas Recentes</CardTitle>
            <CardDescription>
              Últimas reservas realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReservations ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-muted h-16 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : allReservations && allReservations.length > 0 ? (
              <div className="space-y-3">
                {allReservations
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .slice(0, 5)
                  .map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border-border flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">
                            {reservation.user?.name || "Usuário"}
                          </p>
                          {reservation.isAutoGenerated && (
                            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                              Auto
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {formatDateBR(reservation.reservationDate)}
                          {reservation.menuVariation && (
                            <>
                              {" • "}
                              {reservation.menuVariation.variationType ===
                              "STANDARD"
                                ? "Padrão"
                                : reservation.menuVariation.variationType ===
                                    "EGG_SUBSTITUTE"
                                  ? "Substituto de Ovo"
                                  : "Vegetariano"}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {reservation.status === "ACTIVE" ? (
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                            Ativa
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600">
                            Cancelada
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center text-sm">
                <p>Nenhuma reserva encontrada</p>
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/reservas">Ver Todas as Reservas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
