"use client";

import { useState } from "react";

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
import { useGetCategories } from "@/_hooks/queries/use-get-categories";

import CategoriesTableContent from "./categories-table-content";
import { categoriesTableColumns } from "./table-columns";

const CategoriesTable = () => {
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const { data: allCategories, isLoading, isError } = useGetCategories();

  // Filtragem local das categorias
  const categories = allCategories?.filter((category) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "ACTIVE") return category.isActive;
    if (statusFilter === "INACTIVE") return !category.isActive;
    return true;
  });

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
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
        <div className="bg-muted/50 rounded-md border py-12 text-center">
          <p className="text-destructive font-medium">
            Erro ao carregar categorias. Por favor, tente novamente.
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
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
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
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
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

  if (!isLoading && categories?.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
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
        <div className="bg-muted/50 rounded-md border py-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma categoria encontrada com os filtros selecionados.
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

      <CategoriesTableContent
        data={categories || []}
        columns={categoriesTableColumns}
      />
    </div>
  );
};

export default CategoriesTable;
