"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";

// Extend dayjs with UTC plugin
dayjs.extend(utc);

import { Input } from "@/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { Skeleton } from "@/_components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_components/ui/table";
import { useGetMenuItems } from "@/_hooks/queries/use-get-menu-items";
import { useGetMenus } from "@/_hooks/queries/use-get-menus";
import { useGetMyReservations } from "@/_hooks/queries/use-get-my-reservations";
import { useAuth } from "@/_hooks/use-auth";
import type { DayOfWeek } from "@/_types/menu";

import MenusTableContent from "./menus-table-content";
import { adminMenusTableColumns, menusTableColumns } from "./table-columns";

const MenusTable = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [dayOfWeekFilter, setDayOfWeekFilter] = useState<DayOfWeek | "ALL">(
    "ALL",
  );
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");

  const startDate = dayjs().subtract(7, "days").format("YYYY-MM-DD");
  const endDate = dayjs().add(30, "days").format("YYYY-MM-DD");

  const {
    data: allMenus,
    isLoading,
    isError,
  } = useGetMenus({
    startDate,
    endDate,
  });

  // Fetch menu items to enrich menu compositions
  const { data: allMenuItems } = useGetMenuItems();

  // Fetch user reservations (only for non-admin users)
  const { data: userReservations } = useGetMyReservations(
    {
      startDate,
      endDate,
    },
    { enabled: !isAdmin },
  );

  // Create a map of reservations by menuId (only for non-admin users)
  const reservationsByMenuId = !isAdmin
    ? userReservations?.reduce(
        (acc, reservation) => {
          acc[reservation.menuId] = reservation;
          return acc;
        },
        {} as Record<string, (typeof userReservations)[0]>,
      )
    : undefined;

  // Enrich menus with menu item data and reservation status
  const enrichedMenus = allMenus?.map((menu) => {
    const reservation = reservationsByMenuId?.[menu.id];

    if (!menu.menuCompositions || !allMenuItems) {
      return {
        ...menu,
        userReservation: reservation,
      };
    }

    return {
      ...menu,
      userReservation: reservation,
      menuCompositions: menu.menuCompositions.map((comp) => {
        if (comp.menuItem?.name) {
          return comp;
        }

        const menuItem = allMenuItems.find(
          (item) => item.id === comp.menuItemId,
        );
        return {
          ...comp,
          menuItem: menuItem || comp.menuItem,
        };
      }),
    };
  });

  const menus = enrichedMenus?.filter((menu) => {
    if (dateFilter) {
      // Compare only the date part (YYYY-MM-DD) ignoring time
      const menuDate = dayjs.utc(menu.date).format("YYYY-MM-DD");
      if (menuDate !== dateFilter) {
        return false;
      }
    }
    if (dayOfWeekFilter !== "ALL" && menu.dayOfWeek !== dayOfWeekFilter) {
      return false;
    }
    if (statusFilter === "ACTIVE" && !menu.isActive) return false;
    if (statusFilter === "INACTIVE" && menu.isActive) return false;
    return true;
  });

  const FiltersSection = () => (
    <div className="flex flex-col gap-4 md:flex-row">
      <Input
        type="date"
        placeholder="Procurar por data"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="w-full md:w-[200px]"
      />

      <Select
        value={dayOfWeekFilter}
        onValueChange={(value) =>
          setDayOfWeekFilter(value as DayOfWeek | "ALL")
        }
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filtrar por dia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os dias</SelectItem>
          <SelectItem value="MONDAY">Segunda-feira</SelectItem>
          <SelectItem value="TUESDAY">Terça-feira</SelectItem>
          <SelectItem value="WEDNESDAY">Quarta-feira</SelectItem>
          <SelectItem value="THURSDAY">Quinta-feira</SelectItem>
          <SelectItem value="FRIDAY">Sexta-feira</SelectItem>
          <SelectItem value="SATURDAY">Sábado</SelectItem>
          <SelectItem value="SUNDAY">Domingo</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={statusFilter}
        onValueChange={(value) =>
          setStatusFilter(value as "ALL" | "ACTIVE" | "INACTIVE")
        }
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os status</SelectItem>
          <SelectItem value="ACTIVE">Ativo</SelectItem>
          <SelectItem value="INACTIVE">Inativo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  if (isError) {
    return (
      <div className="space-y-4">
        <FiltersSection />
        <div className="bg-muted/50 rounded-md border py-12 text-center">
          <p className="text-destructive font-medium">
            Erro ao carregar cardápios. Por favor, tente novamente.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <Skeleton className="h-10 w-full md:w-[200px]" />
          <Skeleton className="h-10 w-full md:w-[200px]" />
          <Skeleton className="h-10 w-full md:w-[200px]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-48" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!isLoading && menus?.length === 0) {
    return (
      <div className="space-y-4">
        <FiltersSection />
        <div className="bg-muted/50 rounded-md border py-12 text-center">
          <p className="text-muted-foreground">
            Nenhum cardápio encontrado com os filtros selecionados.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Tente ajustar os critérios de busca.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          type="date"
          placeholder="Buscar por data"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full md:w-[200px]"
        />

        <Select
          value={dayOfWeekFilter}
          onValueChange={(value) =>
            setDayOfWeekFilter(value as DayOfWeek | "ALL")
          }
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por dia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os dias</SelectItem>
            <SelectItem value="MONDAY">Segunda-feira</SelectItem>
            <SelectItem value="TUESDAY">Terça-feira</SelectItem>
            <SelectItem value="WEDNESDAY">Quarta-feira</SelectItem>
            <SelectItem value="THURSDAY">Quinta-feira</SelectItem>
            <SelectItem value="FRIDAY">Sexta-feira</SelectItem>
            <SelectItem value="SATURDAY">Sábado</SelectItem>
            <SelectItem value="SUNDAY">Domingo</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as "ALL" | "ACTIVE" | "INACTIVE")
          }
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            <SelectItem value="ACTIVE">Ativo</SelectItem>
            <SelectItem value="INACTIVE">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MenusTableContent
        data={menus || []}
        columns={isAdmin ? adminMenusTableColumns : menusTableColumns}
      />
    </div>
  );
};

export default MenusTable;
