"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import { maskCPF } from "@/_lib/report-utils";

interface ActiveUserRow {
  userId: string;
  name: string;
  cpf: string;
  userType: "FIXO" | "NAO_FIXO";
  totalReservations: number;
  cancelledReservations: number;
  cancellationRate: number;
}

const userTypeLabels = {
  FIXO: "Fixo",
  NAO_FIXO: "Não Fixo",
};

export const activeUsersTableColumns: ColumnDef<ActiveUserRow>[] = [
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
    id: "cpf",
    accessorKey: "cpf",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CPF
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cpf = row.getValue("cpf") as string;
      return <span>{maskCPF(cpf)}</span>;
    },
  },
  {
    id: "userType",
    accessorKey: "userType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const userType = row.getValue("userType") as keyof typeof userTypeLabels;
      return userTypeLabels[userType];
    },
  },
  {
    id: "totalReservations",
    accessorKey: "totalReservations",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Reservas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const total = row.getValue("totalReservations") as number;
      return <span className="font-medium">{total}</span>;
    },
  },
  {
    id: "cancelledReservations",
    accessorKey: "cancelledReservations",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Canceladas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "cancellationRate",
    accessorKey: "cancellationRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Taxa Cancelamento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rate = row.getValue("cancellationRate") as number;
      const isHighRate = rate > 20;

      return (
        <Badge
          variant={isHighRate ? "destructive" : "secondary"}
          className={isHighRate ? "font-semibold" : ""}
        >
          {rate.toFixed(2)}%
        </Badge>
      );
    },
  },
];
