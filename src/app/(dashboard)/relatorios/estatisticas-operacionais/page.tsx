"use client";

import { useState } from "react";

import { ExportPDFButton } from "@/_components/reports/export-pdf-button";
import { ReportChartSkeleton } from "@/_components/reports/report-chart-skeleton";
import {
  PageContainer,
  PageContent,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";
import { useGetOperationalStatsReport } from "@/_hooks/queries/use-get-operational-stats-report";
import { generateReportFilename, REPORT_TYPES } from "@/_lib/pdf/generate-pdf";
import { OperationalStatsReportPDF } from "@/_lib/pdf/operational-stats-report-pdf";
import { ReportFilters } from "@/_types/report";

import { OperationalStatsCards } from "./_components/operational-stats-cards";
import { OperationalStatsCharts } from "./_components/operational-stats-charts";
import { OperationalStatsFilters } from "./_components/operational-stats-filters";

export default function EstatisticasOperacionaisPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "",
    endDate: "",
  });

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  const hasValidFilters = filters.startDate && filters.endDate;

  const { data, isLoading, isError } = useGetOperationalStatsReport(filters);

  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>
            Relatório de Estatísticas Operacionais
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visão consolidada das métricas e estatísticas do sistema
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <ExportPDFButton
            pdfComponent={
              <OperationalStatsReportPDF data={data!} filters={filters} />
            }
            filename={generateReportFilename(
              REPORT_TYPES.OPERATIONAL_STATS,
              filters.startDate,
              filters.endDate,
            )}
            disabled={!hasValidFilters || isLoading || !data}
            variant="outline"
          />
        </PageHeaderActions>
      </PageHeaderContainer>

      <PageContent>
        <div className="space-y-6">
          {/* Filtros */}
          <OperationalStatsFilters onFiltersChange={handleFiltersChange} />

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
              {/* Cards de métricas */}
              <OperationalStatsCards data={data} />

              {/* Gráficos operacionais */}
              <OperationalStatsCharts data={data} />
            </div>
          ) : null}
        </div>
      </PageContent>
    </PageContainer>
  );
}
