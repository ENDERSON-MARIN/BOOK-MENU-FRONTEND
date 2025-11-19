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
const activeUsersFiltersSchema = z.object({
  startDate: z.string().min(1, "Data inicial é obrigatória"),
  endDate: z.string().min(1, "Data final é obrigatória"),
  userType: z.enum(["FIXO", "NAO_FIXO", "ALL"]).optional(),
});

interface ActiveUsersFiltersProps {
  onFiltersChange: (filters: ReportFilters) => void;
  className?: string;
}

/**
 * Componente de filtros para o relatório de usuários ativos
 * Permite filtrar por período e tipo de usuário (FIXO, NAO_FIXO, TODOS)
 *
 * @param onFiltersChange - Callback chamado quando os filtros são alterados
 * @param className - Classes CSS adicionais
 *
 * @example
 * <ActiveUsersFilters
 *   onFiltersChange={(filters) => console.log(filters)}
 * />
 */
export function ActiveUsersFilters({
  onFiltersChange,
  className,
}: ActiveUsersFiltersProps) {
  const {
    filters,
    startDate,
    endDate,
    errors,
    setStartDate,
    setEndDate,
    setPresetPeriod,
    setUserType,
    clearFilters,
    isValid,
  } = useReportFilters({
    initialStartDate: "",
    initialEndDate: "",
  });

  // Validar filtros com Zod e notificar mudanças
  const handleFiltersChange = (updatedFilters: ReportFilters) => {
    try {
      const validatedFilters = activeUsersFiltersSchema.parse(updatedFilters);
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

  const handleUserTypeChange = (value: string) => {
    const userType = value as ReportFilters["userType"];
    setUserType(userType);
    const updatedFilters = { ...filters, userType };
    handleFiltersChange(updatedFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange({
      startDate: "",
      endDate: "",
      userType: "ALL",
    });
  };

  // Contar filtros ativos (além das datas obrigatórias)
  const activeFiltersCount = [
    filters.userType && filters.userType !== "ALL",
  ].filter(Boolean).length;

  return (
    <div className={cn("bg-card space-y-6 rounded-lg border p-6", className)}>
      {/* Header com título e botão de limpar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Filtros</h3>
          <p className="text-muted-foreground text-sm">
            Selecione o período e o tipo de usuário
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

      {/* Filtro por Tipo de Usuário */}
      <div className="space-y-2">
        <Label htmlFor="user-type-filter" className="text-sm font-medium">
          Tipo de Usuário
        </Label>
        <Select
          value={filters.userType || "ALL"}
          onValueChange={handleUserTypeChange}
        >
          <SelectTrigger
            id="user-type-filter"
            className="w-full"
            aria-label="Filtrar por tipo de usuário"
          >
            <SelectValue placeholder="Selecione o tipo de usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Tipos</SelectItem>
            <SelectItem value="FIXO">Fixo</SelectItem>
            <SelectItem value="NAO_FIXO">Não Fixo</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          Usuários fixos têm reservas automáticas configuradas
        </p>
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
