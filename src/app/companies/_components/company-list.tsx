"use client";

import { DataTable } from "@/_components/ui/data-table";
import { useGetCompanies } from "@/_hooks/queries/use-get-companies";

import { companiesTableColumns } from "./table-columns";

export function CompanyList() {
  const { data: companies, isLoading, isError } = useGetCompanies();

  if (isLoading) {
    return <div>Carregando empresas...</div>;
  }

  if (isError) {
    return <div>Ocorreu um erro ao buscar as empresas.</div>;
  }

  return <DataTable columns={companiesTableColumns} data={companies || []} />;
}
