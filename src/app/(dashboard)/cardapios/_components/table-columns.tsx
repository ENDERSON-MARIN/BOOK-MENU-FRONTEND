"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { formatDateBR } from "@/_lib/date-utils";
import { Menu } from "@/_types/menu";

import MenusTableActions from "./table-actions";

const dayOfWeekLabels: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const statusLabels = {
  true: "Ativo",
  false: "Inativo",
};

const dateColumn: ColumnDef<Menu> = {
  id: "date",
  accessorKey: "date",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  },
  cell: ({ row }) => {
    const date = row.getValue("date") as string;
    return formatDateBR(date);
  },
};

const dayOfWeekColumn: ColumnDef<Menu> = {
  id: "dayOfWeek",
  accessorKey: "dayOfWeek",
  header: "Dia da Semana",
  cell: ({ row }) => {
    const dayOfWeek = row.getValue("dayOfWeek") as string;
    return dayOfWeekLabels[dayOfWeek] || dayOfWeek;
  },
};

const mainProteinColumn: ColumnDef<Menu> = {
  id: "mainProtein",
  header: "Proteína Principal",
  cell: ({ row }) => {
    const menu = row.original;
    const mainProtein = menu.menuCompositions?.find(
      (comp) => comp.isMainProtein,
    );

    // If menuItem is populated, use it
    if (mainProtein?.menuItem?.name) {
      return mainProtein.menuItem.name;
    }

    // Otherwise, show a placeholder
    return mainProtein ? "Carregando..." : "-";
  },
};

const itemsCountColumn: ColumnDef<Menu> = {
  id: "itemsCount",
  header: "Itens",
  cell: ({ row }) => {
    const menu = row.original;
    const count = menu.menuCompositions?.length || 0;
    return `${count} ${count === 1 ? "item" : "itens"}`;
  },
};

const statusColumn: ColumnDef<Menu> = {
  id: "isActive",
  accessorKey: "isActive",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  },
  cell: ({ row }) => {
    const isActive = row.getValue("isActive") as boolean;
    return (
      <Badge
        variant={isActive ? "default" : "destructive"}
        className={
          isActive
            ? "bg-green-600 text-black hover:bg-green-700 dark:bg-green-500"
            : ""
        }
      >
        {statusLabels[String(isActive) as keyof typeof statusLabels]}
      </Badge>
    );
  },
};

const reservationStatusColumn: ColumnDef<Menu> = {
  id: "reservationStatus",
  header: "Minha Reserva",
  cell: ({ row }) => {
    const menu = row.original;
    const reservation = menu.userReservation;

    if (!reservation) {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Sem reserva
        </Badge>
      );
    }

    if (reservation.status === "ACTIVE") {
      return (
        <Badge
          variant="default"
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500"
        >
          Reservado
        </Badge>
      );
    }

    if (reservation.status === "CANCELLED") {
      return (
        <Badge
          variant="destructive"
          className="bg-orange-600 hover:bg-orange-700"
        >
          Cancelado
        </Badge>
      );
    }

    return null;
  },
};

const actionsColumn: ColumnDef<Menu> = {
  id: "actions",
  cell: (params) => {
    const menu = params.row.original;
    return <MenusTableActions menu={menu} />;
  },
};

// Columns for regular users (with reservation status)
export const menusTableColumns: ColumnDef<Menu>[] = [
  dateColumn,
  dayOfWeekColumn,
  mainProteinColumn,
  itemsCountColumn,
  statusColumn,
  reservationStatusColumn,
  actionsColumn,
];

// Columns for admins (without reservation status)
export const adminMenusTableColumns: ColumnDef<Menu>[] = [
  dateColumn,
  dayOfWeekColumn,
  mainProteinColumn,
  itemsCountColumn,
  statusColumn,
  actionsColumn,
];
