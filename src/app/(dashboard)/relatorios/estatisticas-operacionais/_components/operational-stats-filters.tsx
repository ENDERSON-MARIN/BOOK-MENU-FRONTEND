"use client";

import { FilterX } from "lucide-react";
import { z } from "zod";

import { PeriodFilter } from "@/_components/reports/period-filter";
import { Button } from "@/_components/ui/button";
import { useReportFilters } from "@/_hooks/use-report-filters";
import { cn } from "@/_lib/utils";
import { ReportFilters, ReportPeriod } from "@/_types/report";

// Zod schema para validação dos filtros
const operationalStatsFiltersSchema = z.object({
  startDate: z.string().min(1, "Data inicial é obrigatória"),
  endDate: z.string().min(1, "Data final é obrigatória"),
});

interface OperationalStatsFiltersProps {
  onFiltersChange: (filters: ReportFilters) => void;
  className?: string;
}

/**
 * Componente de filtros para o relatório de estatísticas operacionais
 * Permite filtrar apenas por período (sem filtros adicionais)
 *
 * @param onFiltersChange - Callback chamado quando os filtros são alterados
 * @param className - Classes CSS adicionais
 *
 * @example
 * <OperationalStatsFilters
 *   onFiltersChange={(filters) => console.log(filters)}
 * />
 */
export function OperationalStatsFilters({
  onFiltersChange,
  className,
}: OperationalStatsFiltersProps) {
  const {
    filters,
    startDate,
    endDate,
    errors,
    setStartDate,
    setEndDate,
    setPresetPeriod,
    clearFilters,
    isValid,
  } = useReportFilters({
    initialStartDate: "",
    initialEndDate: "",
  });

  // Validar filtros com Zod e notificar mudanças
  const handleFiltersChange = (updatedFilters: ReportFilters) => {
    try {
      const validatedFilters =
        operationalStatsFiltersSchema.parse(updatedFilters);
      onFiltersChange(validatedFilters);
    } catch (error) {
      // Validação falhou, não notificar mudanças
      console.error("Validation error:", error);
    }
  };

  // Handlers para mudanças nos filtros
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    const updatedFilters = { ...filters, startDate: date };
    handleFiltersChange(updatedFilters);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    const updatedFilters = { ...filters, endDate: date };
    handleFiltersChange(updatedFilters);
  };

  const handlePresetSelect = (preset: ReportPeriod) => {
    setPresetPeriod(preset);
    // O hook já atualiza startDate e endDate, então notificamos após um pequeno delay
    setTimeout(() => {
      handleFiltersChange(filters);
    }, 0);
  };

  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange({
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className={cn("bg-card space-y-6 rounded-lg border p-6", className)}>
      {/* Header com título e botão de limpar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Filtros</h3>
          <p className="text-muted-foreground text-sm">
            Selecione o período para análise das estatísticas operacionais
          </p>
        </div>
        {startDate && endDate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Filtro de Período */}
      <PeriodFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onPresetSelect={handlePresetSelect}
        errors={errors}
      />

      {/* Indicador de filtros válidos */}
      {isValid && startDate && endDate && (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/20">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
            ✓
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Filtros válidos aplicados
            </p>
            <p className="text-muted-foreground text-xs">
              Pronto para gerar relatório de estatísticas operacionais
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
