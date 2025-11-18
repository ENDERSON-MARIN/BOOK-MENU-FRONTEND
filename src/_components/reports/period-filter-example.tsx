"use client";

import { useReportFilters } from "@/_hooks/use-report-filters";

import { PeriodFilter } from "./period-filter";

/**
 * Exemplo de uso do componente PeriodFilter
 * Este arquivo demonstra como integrar o PeriodFilter com o hook useReportFilters
 */
export function PeriodFilterExample() {
  const {
    startDate,
    endDate,
    errors,
    setStartDate,
    setEndDate,
    setPresetPeriod,
    isValid,
  } = useReportFilters();

  return (
    <div className="space-y-4">
      <PeriodFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onPresetSelect={setPresetPeriod}
        errors={errors}
      />

      {/* Debug Info */}
      <div className="rounded-md border p-4">
        <h3 className="mb-2 font-semibold">Estado Atual:</h3>
        <pre className="text-xs">
          {JSON.stringify(
            {
              startDate,
              endDate,
              isValid,
              errors,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}
