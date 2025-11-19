"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { useGetPopularMenusReport } from "@/_hooks/queries/use-get-popular-menus-report";
import { ReportFilters } from "@/_types/report";

import { PopularMenusChart } from "./_components/popular-menus-chart";
import { PopularMenusFilters } from "./_components/popular-menus-filters";
import { PopularMenusRanking } from "./_components/popular-menus-ranking";

export default function CardapiosPopularesPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "",
    endDate: "",
  });

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  const hasValidFilters = filters.startDate && filters.endDate;

  const { data, isLoading, isError, error } = useGetPopularMenusReport(filters);

  const handleExportPDF = () => {
    // TODO: Implementar componente PDF para cardápios populares (Task 38)
    toast.info(
      "Exportação de PDF para cardápios populares será implementada em breve.",
    );
  };

  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Relatório de Cardápios Populares</PageHeaderTitle>
          <PageHeaderDescription>
            Análise dos cardápios mais reservados e preferências alimentares
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
          <PopularMenusFilters onFiltersChange={handleFiltersChange} />

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
                  {error instanceof Error
                    ? error.message
                    : "Tente novamente mais tarde"}
                </p>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Ranking de Cardápios */}
              <PopularMenusRanking data={data} />

              {/* Gráficos */}
              <PopularMenusChart data={data} />
            </div>
          ) : null}
        </div>
      </PageContent>
    </PageContainer>
  );
}
