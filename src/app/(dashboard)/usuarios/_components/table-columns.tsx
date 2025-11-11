"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { PatternFormat } from "react-number-format";

import { Button } from "@/_components/ui/button";
import { User } from "@/_types/user";

import UsersTableActions from "./table-actions";

const roleLabels = {
  ADMIN: "Administrador",
  USER: "Usuário",
};

const userTypeLabels = {
  FIXO: "Fixo",
  NAO_FIXO: "Não Fixo",
};

const statusLabels = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
};

export const usersTableColumns: ColumnDef<User>[] = [
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
      return (
        <PatternFormat value={cpf} format="###.###.###-##" displayType="text" />
      );
    },
  },
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
    id: "role",
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Perfil
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as keyof typeof roleLabels;
      return roleLabels[role];
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
    id: "status",
    accessorKey: "status",
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
      const status = row.getValue("status") as keyof typeof statusLabels;
      return (
        <span
          className={
            status === "ATIVO"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {statusLabels[status]}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const user = params.row.original;
      return <UsersTableActions user={user} />;
    },
  },
];
