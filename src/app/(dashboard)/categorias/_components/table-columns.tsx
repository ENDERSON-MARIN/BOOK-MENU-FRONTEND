"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
        <span
          className={
            isActive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {statusLabels[String(isActive) as keyof typeof statusLabels]}
        </span>
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
