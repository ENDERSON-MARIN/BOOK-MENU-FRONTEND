"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";

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
import { ActiveUsersReportData } from "@/_types/report";

import { activeUsersTableColumns } from "./active-users-table-columns";

interface ActiveUsersTableProps {
  data: ActiveUsersReportData;
}

export const ActiveUsersTable = memo(function ActiveUsersTable({
  data,
}: ActiveUsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "totalReservations", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Ordenar usuários por total de reservas (decrescente) por padrão
  const sortedUsers = useMemo(() => {
    return [...data.users].sort(
      (a, b) => b.totalReservations - a.totalReservations,
    );
  }, [data.users]);

  // Initialize table with 50 items per page
  const table = useReactTable({
    data: sortedUsers,
    columns: activeUsersTableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50, // 50 records per page as per requirements
      },
      sorting: [{ id: "totalReservations", desc: true }], // Sort by total reservations descending by default
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
        <CardTitle>Detalhamento de Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: Horizontal scroll wrapper */}
        <div
          className="w-full overflow-x-auto rounded-md border"
          role="region"
          aria-label="Tabela de usuários ativos"
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
                    colSpan={activeUsersTableColumns.length}
                    className="h-24 text-center"
                    role="cell"
                  >
                    Nenhum usuário ativo encontrado para o período selecionado.
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
            Página {currentPage} de {totalPages} ({sortedUsers.length}{" "}
            {sortedUsers.length === 1 ? "usuário" : "usuários"})
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
});
