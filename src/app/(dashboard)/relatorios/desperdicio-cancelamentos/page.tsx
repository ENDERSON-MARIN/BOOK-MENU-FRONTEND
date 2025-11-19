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
import { useGetWasteReport } from "@/_hooks/queries/use-get-waste-report";
import { generateReportFilename, REPORT_TYPES } from "@/_lib/pdf/generate-pdf";
import { WasteReportPDF } from "@/_lib/pdf/waste-report-pdf";
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
          <ExportPDFButton
            pdfComponent={<WasteReportPDF data={data!} filters={filters} />}
            filename={generateReportFilename(
              REPORT_TYPES.WASTE,
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
