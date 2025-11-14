"use client";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Dialog } from "@/_components/ui/dialog";
import { Skeleton } from "@/_components/ui/skeleton";
import { useGetMenus } from "@/_hooks/queries/use-get-menus";
import { useGetMyReservations } from "@/_hooks/queries/use-get-my-reservations";
import { useAuth } from "@/_hooks/use-auth";
import { isBeforeCutoffTime } from "@/_lib/date-utils";
import type { Menu } from "@/_types/menu";

import ReservationFormDialog from "./reservation-form-dialog";

// Extend dayjs with plugins
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(utc);

const DAY_NAMES: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export function MenusCalendar() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("ADMIN");
  const isUser = hasRole("USER");

  // Start with current week
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    dayjs().startOf("isoWeek"),
  );

  const weekEnd = currentWeekStart.endOf("isoWeek");

  // Fetch menus for the current week
  const { data: menus, isLoading } = useGetMenus({
    startDate: currentWeekStart.format("YYYY-MM-DD"),
    endDate: weekEnd.format("YYYY-MM-DD"),
    isActive: true,
  });

  // Fetch user's reservations for the current week (only for non-admin users)
  const { data: myReservations, isLoading: isLoadingReservations } =
    useGetMyReservations({
      startDate: currentWeekStart.format("YYYY-MM-DD"),
      endDate: weekEnd.format("YYYY-MM-DD"),
    });

  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => prev.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => prev.add(1, "week"));
  };

  // Generate array of 7 days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day"),
  );

  // Map menus to their dates
  const menusByDate = new Map<string, Menu>();
  menus?.forEach((menu) => {
    menusByDate.set(menu.date, menu);
  });

  // Map reservations to their dates (only active reservations)
  const reservationsByDate = new Map<string, boolean>();
  myReservations
    ?.filter((reservation) => reservation.status === "ACTIVE")
    .forEach((reservation) => {
      reservationsByDate.set(reservation.reservationDate, true);
    });

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {currentWeekStart.utc().format("DD/MM/YYYY")} -{" "}
            {weekEnd.utc().format("DD/MM/YYYY")}
          </h2>
          <p className="text-muted-foreground text-sm">
            Semana {currentWeekStart.isoWeek()} de {currentWeekStart.year()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousWeek}
            aria-label="Semana anterior"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentWeekStart(dayjs().startOf("isoWeek"))}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            aria-label="Próxima semana"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      {isLoading || isLoadingReservations ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {weekDays.map((day) => {
            const dateStr = day.format("YYYY-MM-DD");
            const menu = menusByDate.get(dateStr);
            const isToday = day.isSame(dayjs(), "day");
            const isPast = day.isBefore(dayjs(), "day");
            const hasReservation = reservationsByDate.get(dateStr) || false;

            return (
              <MenuDayCard
                key={dateStr}
                date={day}
                menu={menu}
                isToday={isToday}
                isPast={isPast}
                isAdmin={isAdmin}
                isUser={isUser}
                hasReservation={hasReservation}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface MenuDayCardProps {
  date: dayjs.Dayjs;
  menu?: Menu;
  isToday: boolean;
  isPast: boolean;
  isAdmin: boolean;
  isUser: boolean;
  hasReservation: boolean;
}

function MenuDayCard({
  date,
  menu,
  isToday,
  isPast,
  isAdmin,
  isUser,
  hasReservation,
}: MenuDayCardProps) {
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const dayName = DAY_NAMES[menu?.dayOfWeek || ""] || date.format("dddd");
  // Use UTC to avoid timezone issues when displaying dates
  const dateFormatted = date.utc().format("DD/MM/YYYY");

  if (!menu) {
    return (
      <Card className={isToday ? "border-primary" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{dayName}</CardTitle>
              <CardDescription>{dateFormatted}</CardDescription>
            </div>
            {isToday && (
              <Badge variant="default" className="text-xs">
                Hoje
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Nenhum cardápio cadastrado
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get main protein
  const mainProtein = menu.menuCompositions.find((mc) => mc.isMainProtein);
  const itemCount = menu.menuCompositions.length;

  // TODO: Get reservation count from API when available
  // For now, we'll use 0 but type it as number so it can be updated later
  const reservationCount: number = 0;

  return (
    <Card className={isToday ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{dayName}</CardTitle>
            <CardDescription>{dateFormatted}</CardDescription>
          </div>
          {isToday && (
            <Badge variant="default" className="text-xs">
              Hoje
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main Protein */}
        {mainProtein && (
          <div>
            <p className="text-muted-foreground text-xs font-medium">
              Proteína Principal
            </p>
            <p className="text-sm font-semibold">{mainProtein.menuItem.name}</p>
          </div>
        )}

        {/* Item Count */}
        <div>
          <p className="text-muted-foreground text-xs">
            {itemCount} {itemCount === 1 ? "item" : "itens"} no cardápio
          </p>
        </div>

        {/* Reservation Count (Admin only) */}
        {isAdmin && (
          <div className="border-t pt-2">
            <p className="text-muted-foreground text-xs">
              {reservationCount}{" "}
              {reservationCount === 1 ? "reserva" : "reservas"}
            </p>
          </div>
        )}

        {/* Observations */}
        {menu.observations && (
          <div className="border-t pt-2">
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {menu.observations}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex w-full gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="mr-1" />
            Ver Detalhes
          </Button>
          {isAdmin && (
            <>
              <Button variant="outline" size="icon-sm">
                <Edit />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={isPast || reservationCount > 0}
                aria-label="Excluir cardápio"
              >
                <Trash2 />
              </Button>
            </>
          )}
        </div>

        {/* Reservation Button for Users */}
        {isUser && (
          <>
            {hasReservation ? (
              <div className="w-full rounded-md border border-green-200 bg-green-50 px-3 py-2 text-center dark:border-green-900 dark:bg-green-950/20">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✓ Reserva já realizada
                </p>
              </div>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full text-white"
                  disabled={!isBeforeCutoffTime(menu.date)}
                  onClick={() => setReservationDialogOpen(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Fazer Reserva
                </Button>
                {!isBeforeCutoffTime(menu.date) && (
                  <p className="text-muted-foreground text-center text-xs">
                    Prazo encerrado (até 8:30 AM)
                  </p>
                )}
              </>
            )}
          </>
        )}
      </CardFooter>

      {/* Reservation Dialog */}
      {isUser && !hasReservation && (
        <Dialog
          open={reservationDialogOpen}
          onOpenChange={setReservationDialogOpen}
        >
          <ReservationFormDialog
            menu={menu}
            onSuccess={() => setReservationDialogOpen(false)}
          />
        </Dialog>
      )}
    </Card>
  );
}
