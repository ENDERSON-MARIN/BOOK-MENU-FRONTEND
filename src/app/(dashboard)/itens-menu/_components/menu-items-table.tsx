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
import { useGetMenuItems } from "@/_hooks/queries/use-get-menu-items";

import MenuItemsTableContent from "./menu-items-table-content";
import { menuItemsTableColumns } from "./table-columns";

const MenuItemsTable = () => {
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const { data: categories } = useGetCategories({ isActive: true });

  const { data: allMenuItems, isLoading, isError } = useGetMenuItems();

  // Filtragem local dos itens de menu
  const menuItems = allMenuItems?.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && item.isActive) ||
      (statusFilter === "INACTIVE" && !item.isActive);
    const matchesCategory =
      categoryFilter === "ALL" || item.categoryId === categoryFilter;

    return matchesStatus && matchesCategory;
  });

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as categorias</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
            Erro ao carregar itens de menu. Por favor, tente novamente.
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
                  <Skeleton className="h-4 w-24" />
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
                    <Skeleton className="h-4 w-24" />
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

  if (!isLoading && menuItems?.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as categorias</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
            Nenhum item de menu encontrado com os filtros selecionados.
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
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as categorias</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      <MenuItemsTableContent
        data={menuItems || []}
        columns={menuItemsTableColumns}
      />
    </div>
  );
};

export default MenuItemsTable;
