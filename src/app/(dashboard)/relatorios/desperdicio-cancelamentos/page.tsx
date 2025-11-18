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
import { useGetWasteReport } from "@/_hooks/queries/use-get-waste-report";
import { ReportFilters } from "@/_types/report";

import { WasteReportAnalysis } from "./_components/waste-report-analysis";
import { WasteReportFilters } from "./_components/waste-report-filters";
import { WasteReportStats } from "./_components/waste-report-stats";

export default function DesperdicioPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "",
    endDate: "",
  });

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  const hasValidFilters = filters.startDate && filters.endDate;

  const { data, isLoading, isError } = useGetWasteReport(filters);

  const handleExportPDF = () => {
    // TODO: Implementar exportação de PDF (Phase 10)
    console.log("Exportar PDF", filters);
  };

  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>
            Relatório de Desperdício e Cancelamentos
          </PageHeaderTitle>
          <PageHeaderDescription>
            Análise de padrões de cancelamento e identificação de desperdício
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button
            onClick={handleExportPDF}
            disabled={!hasValidFilters}
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
          <WasteReportFilters onFiltersChange={handleFiltersChange} />

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
              {/* Estatísticas de desperdício */}
              <WasteReportStats data={data} />

              {/* Análise detalhada */}
              <WasteReportAnalysis data={data} />
            </div>
          ) : null}
        </div>
      </PageContent>
    </PageContainer>
  );
}
