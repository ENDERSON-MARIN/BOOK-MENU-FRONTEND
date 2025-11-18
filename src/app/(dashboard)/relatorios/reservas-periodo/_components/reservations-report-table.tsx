"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_components/ui/table";
import { formatReportDate, maskCPF } from "@/_lib/report-utils";
import { ReservationReportData } from "@/_types/report";

interface ReservationsReportTableProps {
  data: ReservationReportData;
}

// Status labels and variants
const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  ACTIVE: "Ativa",
};

const statusVariants: Record<string, "default" | "destructive"> = {
  CONFIRMED: "default",
  ACTIVE: "default",
  CANCELLED: "destructive",
};

// Variation labels
const variationLabels: Record<string, string> = {
  STANDARD: "Padrão",
  EGG_SUBSTITUTE: "Com Ovo",
  VEGETARIAN: "Vegetariano",
  Padrão: "Padrão",
  "Com Ovo": "Com Ovo",
};

export function ReservationsReportTable({
  data,
}: ReservationsReportTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Define table columns
  const columns = useMemo<
    ColumnDef<ReservationReportData["reservations"][0]>[]
  >(
    () => [
      {
        id: "date",
        accessorKey: "date",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Data
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue("date") as string;
          return formatReportDate(date);
        },
      },
      {
        id: "user",
        header: "Usuário",
        cell: ({ row }) => {
          const reservation = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{reservation.userName}</span>
              <span className="text-muted-foreground text-sm">
                CPF: {maskCPF(reservation.userCpf)}
              </span>
            </div>
          );
        },
        accessorFn: (row) => row.userName,
      },
      {
        id: "menu",
        accessorKey: "menuSummary",
        header: "Cardápio",
        cell: ({ row }) => {
          const menuSummary = row.getValue("menu") as string;
          return (
            <div className="max-w-xs">
              <span className="line-clamp-2">{menuSummary}</span>
            </div>
          );
        },
      },
      {
        id: "variation",
        accessorKey: "variation",
        header: "Variação",
        cell: ({ row }) => {
          const variation = row.getValue("variation") as string;
          return variationLabels[variation] || variation || "-";
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge variant={statusVariants[status] || "default"}>
              {statusLabels[status] || status}
            </Badge>
          );
        },
      },
      {
        id: "type",
        accessorKey: "isAutomatic",
        header: "Tipo",
        cell: ({ row }) => {
          const isAutomatic = row.getValue("type") as boolean;
          return isAutomatic ? (
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
              Auto
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">Manual</span>
          );
        },
      },
    ],
    [],
  );

  // Initialize table with 50 items per page
  const table = useReactTable({
    data: data.reservations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50, // 50 records per page as per requirements
      },
      sorting: [{ id: "date", desc: true }], // Sort by date descending by default
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const hasResults = table.getRowModel().rows?.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhamento de Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: Horizontal scroll wrapper */}
        <div
          className="w-full overflow-x-auto rounded-md border"
          role="region"
          aria-label="Tabela de reservas"
          tabIndex={0}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="whitespace-nowrap"
                        scope="col"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {hasResults ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    aria-rowindex={index + 1}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                    role="cell"
                  >
                    Nenhuma reserva encontrada para o período selecionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <nav
          className="flex flex-col items-center justify-center gap-2 py-4 sm:flex-row sm:space-x-2"
          role="navigation"
          aria-label="Paginação da tabela"
        >
          <div
            className="text-muted-foreground text-sm"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            Página {currentPage} de {totalPages} ({data.reservations.length}{" "}
            {data.reservations.length === 1 ? "reserva" : "reservas"})
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label={`Ir para página anterior (página ${currentPage - 1})`}
              type="button"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label={`Ir para próxima página (página ${currentPage + 1})`}
              type="button"
            >
              Próxima
            </Button>
          </div>
        </nav>
      </CardContent>
    </Card>
  );
}
