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
import { useGetReservationsReport } from "@/_hooks/queries/use-get-reservations-report";
import { generateReportFilename, REPORT_TYPES } from "@/_lib/pdf/generate-pdf";
import { ReservationsReportPDF } from "@/_lib/pdf/reservations-report-pdf";
import { ReportFilters } from "@/_types/report";

import { ReservationsReportChart } from "./_components/reservations-report-chart";
import { ReservationsReportFilters } from "./_components/reservations-report-filters";
import { ReservationsReportStats } from "./_components/reservations-report-stats";
import { ReservationsReportTable } from "./_components/reservations-report-table";
import { ReservationsReportWeekly } from "./_components/reservations-report-weekly";

export default function ReservasPeriodoPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "",
    endDate: "",
    status: "ALL",
    reservationType: "ALL",
  });

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  const hasValidFilters = filters.startDate && filters.endDate;

  const { data, isLoading, isError } = useGetReservationsReport(filters);

  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Relatório de Reservas por Período</PageHeaderTitle>
          <PageHeaderDescription>
            Análise detalhada de reservas, estatísticas e padrões ao longo do
            tempo
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <ExportPDFButton
            pdfComponent={
              <ReservationsReportPDF data={data!} filters={filters} />
            }
            filename={generateReportFilename(
              REPORT_TYPES.RESERVATIONS,
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
          <ReservationsReportFilters onFiltersChange={handleFiltersChange} />

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
              {/* Estatísticas */}
              <ReservationsReportStats data={data} />

              {/* Gráfico de evolução diária */}
              <ReservationsReportChart data={data} />

              {/* Agrupamento semanal */}
              <ReservationsReportWeekly data={data} />

              {/* Tabela de reservas */}
              <ReservationsReportTable data={data} />
            </div>
          ) : null}
        </div>
      </PageContent>
    </PageContainer>
  );
}
