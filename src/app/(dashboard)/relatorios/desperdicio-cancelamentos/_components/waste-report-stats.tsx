"use client";

import {
  AlertTriangle,
  CalendarX,
  Clock,
  DollarSign,
  Percent,
} from "lucide-react";
import { memo, useMemo } from "react";

import { StatCard } from "@/_components/reports/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { cn } from "@/_lib/utils";
import { WasteReportData } from "@/_types/report";

interface WasteReportStatsProps {
  data: WasteReportData;
}

/**
 * Componente que exibe estatísticas de desperdício e cancelamentos
 * Inclui 3 cards principais (Total Cancelamentos, Taxa, Custo Estimado)
 * e um card adicional com distribuição antes/depois do prazo
 * Destaca em vermelho cancelamentos após prazo
 *
 * @param data - Dados do relatório de desperdício
 *
 * @example
 * <WasteReportStats data={wasteReportData} />
 */
export const WasteReportStats = memo(function WasteReportStats({
  data,
}: WasteReportStatsProps) {
  const { summary, timeDistribution } = data;

  // Calcular percentuais de distribuição com useMemo
  const { beforeDeadlinePercent, afterDeadlinePercent } = useMemo(() => {
    const total =
      timeDistribution.beforeDeadline + timeDistribution.afterDeadline;
    return {
      beforeDeadlinePercent:
        total > 0 ? (timeDistribution.beforeDeadline / total) * 100 : 0,
      afterDeadlinePercent:
        total > 0 ? (timeDistribution.afterDeadline / total) * 100 : 0,
    };
  }, [timeDistribution.beforeDeadline, timeDistribution.afterDeadline]);

  // Formatar custo estimado com useMemo
  const formattedCost = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(summary.estimatedWasteCost),
    [summary.estimatedWasteCost],
  );

  const cancellationRateFormatted = useMemo(
    () => summary.cancellationRate.toFixed(1),
    [summary.cancellationRate],
  );

  return (
    <div className="space-y-6">
      {/* Grid de 3 cards principais */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Total de Cancelamentos */}
        <StatCard
          icon={CalendarX}
          title="Total de Cancelamentos"
          value={summary.totalCancellations}
          description="reservas canceladas no período"
        />

        {/* Card 2: Taxa de Cancelamento */}
        <StatCard
          icon={Percent}
          title="Taxa de Cancelamento"
          value={`${cancellationRateFormatted}%`}
          description={
            summary.cancellationRate > 20
              ? "Taxa crítica - requer atenção"
              : summary.cancellationRate > 10
                ? "Taxa moderada"
                : "Taxa aceitável"
          }
          className={cn(
            summary.cancellationRate > 20 &&
              "border-destructive/50 bg-destructive/5",
          )}
        />

        {/* Card 3: Custo Estimado de Desperdício */}
        <StatCard
          icon={DollarSign}
          title="Custo Estimado de Desperdício"
          value={formattedCost}
          description="baseado em cancelamentos após prazo"
          className={cn(
            timeDistribution.afterDeadline > 0 &&
              "border-destructive/50 bg-destructive/5",
          )}
        />
      </div>

      {/* Card de Distribuição Temporal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="text-primary h-5 w-5" />
            Distribuição por Horário de Cancelamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cancelamentos Antes do Prazo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Antes do Prazo</p>
                    <p className="text-muted-foreground text-xs">
                      Até 8:30 AM do dia anterior
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-500">
                    {timeDistribution.beforeDeadline}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {beforeDeadlinePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-green-100 dark:bg-green-950">
                  <div
                    className="h-full bg-green-600 dark:bg-green-500"
                    style={{ width: `${beforeDeadlinePercent}%` }}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Cancelamentos dentro do prazo não geram desperdício
                </p>
              </div>
            </div>

            {/* Cancelamentos Após o Prazo - DESTACADO EM VERMELHO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-500">
                      Após o Prazo
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Depois de 8:30 AM do dia anterior
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-500">
                    {timeDistribution.afterDeadline}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {afterDeadlinePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-red-100 dark:bg-red-950">
                  <div
                    className="h-full bg-red-600 dark:bg-red-500"
                    style={{ width: `${afterDeadlinePercent}%` }}
                  />
                </div>
                <p className="text-xs text-red-600 dark:text-red-500">
                  ⚠️ Cancelamentos críticos que geram desperdício de alimentos
                </p>
              </div>
            </div>
          </div>

          {/* Alerta se houver muitos cancelamentos após prazo */}
          {timeDistribution.afterDeadline > 0 && afterDeadlinePercent > 30 && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Alto índice de cancelamentos após prazo
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {afterDeadlinePercent.toFixed(1)}% dos cancelamentos
                    ocorreram após o prazo limite, gerando desperdício de
                    alimentos e custos adicionais. Considere implementar medidas
                    para reduzir cancelamentos de última hora.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
