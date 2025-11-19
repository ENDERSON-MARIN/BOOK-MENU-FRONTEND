"use client";

import { FilterX } from "lucide-react";
import { z } from "zod";

import { PeriodFilter } from "@/_components/reports/period-filter";
import { Button } from "@/_components/ui/button";
import { Label } from "@/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { useReportFilters } from "@/_hooks/use-report-filters";
import { cn } from "@/_lib/utils";
import { ReportFilters, ReportPeriod } from "@/_types/report";

// Zod schema para validação dos filtros
const reservationsFiltersSchema = z.object({
  startDate: z.string().min(1, "Data inicial é obrigatória"),
  endDate: z.string().min(1, "Data final é obrigatória"),
  status: z.enum(["CONFIRMED", "CANCELLED", "ALL"]).optional(),
  reservationType: z.enum(["MANUAL", "AUTOMATIC", "ALL"]).optional(),
});

interface ReservationsReportFiltersProps {
  onFiltersChange: (filters: ReportFilters) => void;
  className?: string;
}

/**
 * Componente de filtros para o relatório de reservas por período
 * Permite filtrar por período, status e tipo de reserva
 *
 * @param onFiltersChange - Callback chamado quando os filtros são alterados
 * @param className - Classes CSS adicionais
 *
 * @example
 * <ReservationsReportFilters
 *   onFiltersChange={(filters) => console.log(filters)}
 * />
 */
export function ReservationsReportFilters({
  onFiltersChange,
  className,
}: ReservationsReportFiltersProps) {
  const {
    filters,
    startDate,
    endDate,
    errors,
    setStartDate,
    setEndDate,
    setPresetPeriod,
    setStatus,
    setReservationType,
    clearFilters,
    isValid,
  } = useReportFilters({
    initialStartDate: "",
    initialEndDate: "",
  });

  // Validar filtros com Zod e notificar mudanças
  const handleFiltersChange = (updatedFilters: ReportFilters) => {
    try {
      const validatedFilters = reservationsFiltersSchema.parse(updatedFilters);
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

  const handleStatusChange = (value: string) => {
    const status = value as ReportFilters["status"];
    setStatus(status);
    const updatedFilters = { ...filters, status };
    handleFiltersChange(updatedFilters);
  };

  const handleReservationTypeChange = (value: string) => {
    const reservationType = value as ReportFilters["reservationType"];
    setReservationType(reservationType);
    const updatedFilters = { ...filters, reservationType };
    handleFiltersChange(updatedFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange({
      startDate: "",
      endDate: "",
      status: "ALL",
      reservationType: "ALL",
    });
  };

  // Contar filtros ativos (além das datas obrigatórias)
  const activeFiltersCount = [
    filters.status && filters.status !== "ALL",
    filters.reservationType && filters.reservationType !== "ALL",
  ].filter(Boolean).length;

  return (
    <div className={cn("bg-card space-y-6 rounded-lg border p-6", className)}>
      {/* Header com título e botão de limpar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Filtros</h3>
          <p className="text-muted-foreground text-sm">
            Selecione o período e os filtros desejados
          </p>
        </div>
        {activeFiltersCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Limpar Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground ml-2 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
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

      {/* Filtros Adicionais */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Filtro por Status */}
        <div className="space-y-2">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            Status da Reserva
          </Label>
          <Select
            value={filters.status || "ALL"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger
              id="status-filter"
              className="w-full"
              aria-label="Filtrar por status"
            >
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Status</SelectItem>
              <SelectItem value="CONFIRMED">Confirmadas</SelectItem>
              <SelectItem value="CANCELLED">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Tipo de Reserva */}
        <div className="space-y-2">
          <Label
            htmlFor="reservation-type-filter"
            className="text-sm font-medium"
          >
            Tipo de Reserva
          </Label>
          <Select
            value={filters.reservationType || "ALL"}
            onValueChange={handleReservationTypeChange}
          >
            <SelectTrigger
              id="reservation-type-filter"
              className="w-full"
              aria-label="Filtrar por tipo de reserva"
            >
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Tipos</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
              <SelectItem value="AUTOMATIC">Automática</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
              {activeFiltersCount > 0
                ? `${activeFiltersCount} filtro(s) adicional(is) ativo(s)`
                : "Pronto para gerar relatório"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
