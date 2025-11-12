"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { MenuItem } from "@/_types/menu-item";

import MenuItemsTableActions from "./table-actions";

const statusLabels = {
  true: "Ativo",
  false: "Inativo",
};

export const menuItemsTableColumns: ColumnDef<MenuItem>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | undefined;
      return description || "-";
    },
  },
  {
    id: "category",
    accessorKey: "category.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const menuItem = row.original;
      return menuItem.category?.name || "-";
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
      const menuItem = params.row.original;
      return <MenuItemsTableActions menuItem={menuItem} />;
    },
  },
];
