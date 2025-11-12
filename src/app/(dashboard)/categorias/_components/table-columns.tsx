"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { Category } from "@/_types/category";

import CategoriesTableActions from "./table-actions";

const statusLabels = {
  true: "Ativo",
  false: "Inativo",
};

export const categoriesTableColumns: ColumnDef<Category>[] = [
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
    id: "displayOrder",
    accessorKey: "displayOrder",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ordem
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
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
      const category = params.row.original;
      return <CategoriesTableActions category={category} />;
    },
  },
];
