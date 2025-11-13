"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
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

export const menusTableColumns: ColumnDef<Menu>[] = [
  {
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
      return dayjs(date).format("DD/MM/YYYY");
    },
  },
  {
    id: "dayOfWeek",
    accessorKey: "dayOfWeek",
    header: "Dia da Semana",
    cell: ({ row }) => {
      const dayOfWeek = row.getValue("dayOfWeek") as string;
      return dayOfWeekLabels[dayOfWeek] || dayOfWeek;
    },
  },
  {
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
  },
  {
    id: "itemsCount",
    header: "Itens",
    cell: ({ row }) => {
      const menu = row.original;
      const count = menu.menuCompositions?.length || 0;
      return `${count} ${count === 1 ? "item" : "itens"}`;
    },
  },
  {
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
  },
  {
    id: "actions",
    cell: (params) => {
      const menu = params.row.original;
      return <MenusTableActions menu={menu} />;
    },
  },
];
