"use client";

import dayjs from "dayjs";
import { Calendar, Clock, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { useGetMenus } from "@/_hooks/queries/use-get-menus";
import { useGetMyReservations } from "@/_hooks/queries/use-get-my-reservations";
import { formatDateBR, getTodayFormatted } from "@/_lib/date-utils";
import type { Menu } from "@/_types/menu";

const DAY_OF_WEEK_PT: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export function UserDashboard() {
  const today = getTodayFormatted();
  const nextWeek = dayjs().add(7, "days").format("YYYY-MM-DD");

  const { data: upcomingMenus, isLoading: isLoadingMenus } = useGetMenus({
    startDate: today,
    endDate: nextWeek,
    isActive: true,
  });

  const { data: myReservations, isLoading: isLoadingReservations } =
    useGetMyReservations({
      status: "ACTIVE",
      startDate: today,
    });

  const getMainProtein = (menu: Menu) => {
    const mainProtein = menu.menuCompositions?.find(
      (comp) => comp.isMainProtein,
    );
    return mainProtein?.menuItem?.name || "Não definido";
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Reservas Ativas
              </CardTitle>
              <UtensilsCrossed className="text-muted-foreground h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingReservations ? (
                <div className="bg-muted h-8 w-12 animate-pulse rounded" />
              ) : (
                myReservations?.length || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Próximas refeições agendadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Cardápios Disponíveis
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

      {/* Upcoming Menus */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Cardápios</CardTitle>
          <CardDescription>
            Cardápios disponíveis para os próximos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingMenus ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-muted h-20 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : upcomingMenus && upcomingMenus.length > 0 ? (
            <div className="space-y-4">
              {upcomingMenus.slice(0, 5).map((menu) => {
                const hasReservation = myReservations?.some(
                  (res) => res.menuId === menu.id,
                );

                return (
                  <div
                    key={menu.id}
                    className="border-border flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{formatDateBR(menu.date)}</p>
                        <span className="text-muted-foreground text-sm">
                          • {DAY_OF_WEEK_PT[menu.dayOfWeek]}
                        </span>
                        {hasReservation && (
                          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                            Reservado
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Proteína: {getMainProtein(menu)} •{" "}
                        {menu.menuCompositions.length} itens
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <Link href="/cardapios">Ver Detalhes</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              <p>Nenhum cardápio disponível para os próximos dias</p>
            </div>
          )}

          {upcomingMenus && upcomingMenus.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/cardapios">Ver Todos os Cardápios</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
