"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import { ReportChartSkeleton } from "@/_components/reports/report-chart-skeleton";
import { Button } from "@/_components/ui/button";
import {
  PageContainer,
  PageContent,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";
import { useGetActiveUsersReport } from "@/_hooks/queries/use-get-active-users-report";
import { ReportFilters } from "@/_types/report";

import { ActiveUsersFilters } from "./_components/active-users-filters";
import { ActiveUsersStats } from "./_components/active-users-stats";
import { ActiveUsersTable } from "./_components/active-users-table";

export default function UsuariosAtivosPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "",
    endDate: "",
    userType: "ALL",
  });

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  const hasValidFilters = filters.startDate && filters.endDate;

  const { data, isLoading, isError } = useGetActiveUsersReport(filters);

  const handleExportPDF = () => {
    // TODO: Implementar exportação de PDF (Phase 10)
    console.log("Exportar PDF", filters);
  };

  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Relatório de Usuários Ativos</PageHeaderTitle>
          <PageHeaderDescription>
            Análise de engajamento e estatísticas de usuários do sistema
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button
            onClick={handleExportPDF}
            disabled={!hasValidFilters || !data}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </PageHeaderActions>
      </PageHeaderContainer>

      <PageContent>
        <div className="space-y-6">
          {/* Filtros */}
          <ActiveUsersFilters onFiltersChange={handleFiltersChange} />

          {/* Conteúdo do relatório */}
          {!hasValidFilters ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Selecione um período para gerar o relatório
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-6">
              <ReportChartSkeleton />
            </div>
          ) : isError ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-destructive text-sm font-medium">
                  Erro ao carregar relatório
                </p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Tente novamente mais tarde
                </p>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Estatísticas e gráfico de distribuição */}
              <ActiveUsersStats data={data} />

              {/* Tabela de usuários */}
              <ActiveUsersTable data={data} />
            </div>
          ) : null}
        </div>
      </PageContent>
    </PageContainer>
  );
}
