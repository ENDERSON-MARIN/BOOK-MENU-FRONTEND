"use client";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { ChevronLeft, ChevronRight, Edit, Eye, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/_components/ui/skeleton";
import { useGetMenus } from "@/_hooks/queries/use-get-menus";
import { useAuth } from "@/_hooks/use-auth";
import type { Menu } from "@/_types/menu";

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
      {isLoading ? (
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

            return (
              <MenuDayCard
                key={dateStr}
                date={day}
                menu={menu}
                isToday={isToday}
                isPast={isPast}
                isAdmin={isAdmin}
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
}

function MenuDayCard({
  date,
  menu,
  isToday,
  isPast,
  isAdmin,
}: MenuDayCardProps) {
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
      <CardFooter className="flex gap-2">
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
      </CardFooter>
    </Card>
  );
}
