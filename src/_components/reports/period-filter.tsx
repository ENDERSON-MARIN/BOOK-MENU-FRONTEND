"use client";

import { Calendar } from "lucide-react";

import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { cn } from "@/_lib/utils";
import { ReportPeriod } from "@/_types/report";

interface PeriodFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onPresetSelect: (preset: ReportPeriod) => void;
  errors?: {
    startDate?: string;
    endDate?: string;
    period?: string;
  };
  className?: string;
}

const PRESET_PERIODS = [
  { label: "Última Semana", value: "last-week" as ReportPeriod },
  { label: "Último Mês", value: "last-month" as ReportPeriod },
  { label: "Últimos 3 Meses", value: "last-3-months" as ReportPeriod },
  { label: "Último Ano", value: "last-year" as ReportPeriod },
];

/**
 * Componente de filtro de período para relatórios
 * Permite seleção de datas customizadas ou períodos pré-definidos
 *
 * @param startDate - Data inicial no formato YYYY-MM-DD
 * @param endDate - Data final no formato YYYY-MM-DD
 * @param onStartDateChange - Callback para mudança da data inicial
 * @param onEndDateChange - Callback para mudança da data final
 * @param onPresetSelect - Callback para seleção de período pré-definido
 * @param errors - Objeto com mensagens de erro de validação
 * @param className - Classes CSS adicionais
 *
 * @example
 * <PeriodFilter
 *   startDate={startDate}
 *   endDate={endDate}
 *   onStartDateChange={setStartDate}
 *   onEndDateChange={setEndDate}
 *   onPresetSelect={setPresetPeriod}
 *   errors={errors}
 * />
 */
export function PeriodFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPresetSelect,
  errors,
  className,
}: PeriodFilterProps) {
  const hasErrors = errors && Object.keys(errors).length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Períodos Pré-definidos */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Períodos Rápidos</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_PERIODS.map((preset) => (
            <Button
              key={preset.value}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPresetSelect(preset.value)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Data Inicial */}
        <div className="space-y-2">
          <Label
            htmlFor="start-date"
            className={cn(
              "text-sm font-medium",
              errors?.startDate && "text-destructive",
            )}
          >
            Data Inicial
          </Label>
          <div className="relative">
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              aria-invalid={!!errors?.startDate}
              aria-describedby={
                errors?.startDate ? "start-date-error" : undefined
              }
              className={cn("pr-10", errors?.startDate && "border-destructive")}
            />
            <Calendar
              className={cn(
                "text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2",
                errors?.startDate && "text-destructive",
              )}
            />
          </div>
          {errors?.startDate && (
            <p
              id="start-date-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.startDate}
            </p>
          )}
        </div>

        {/* Data Final */}
        <div className="space-y-2">
          <Label
            htmlFor="end-date"
            className={cn(
              "text-sm font-medium",
              errors?.endDate && "text-destructive",
            )}
          >
            Data Final
          </Label>
          <div className="relative">
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              aria-invalid={!!errors?.endDate}
              aria-describedby={errors?.endDate ? "end-date-error" : undefined}
              className={cn("pr-10", errors?.endDate && "border-destructive")}
            />
            <Calendar
              className={cn(
                "text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2",
                errors?.endDate && "text-destructive",
              )}
            />
          </div>
          {errors?.endDate && (
            <p
              id="end-date-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      {/* Erro de Período (se houver) */}
      {errors?.period && (
        <div
          className="border-destructive/50 bg-destructive/10 rounded-md border p-3"
          role="alert"
        >
          <p className="text-destructive text-sm">{errors.period}</p>
        </div>
      )}

      {/* Indicador Visual de Filtros Válidos */}
      {!hasErrors && startDate && endDate && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Período válido selecionado
          </p>
        </div>
      )}
    </div>
  );
}
