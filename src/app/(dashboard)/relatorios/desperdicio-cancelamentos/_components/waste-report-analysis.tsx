"use client";

import { AlertTriangle, Clock, TrendingUp, Users } from "lucide-react";

import { LineChart } from "@/_components/charts/line-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_components/ui/table";
import { cn } from "@/_lib/utils";
import { WasteReportData } from "@/_types/report";

interface WasteReportAnalysisProps {
  data: WasteReportData;
}

/**
 * Componente de análise detalhada de desperdício e cancelamentos
 * Exibe top 10 usuários com mais cancelamentos, gráfico de evolução temporal
 * e análise de padrões (última hora, recorrentes)
 */
export function WasteReportAnalysis({ data }: WasteReportAnalysisProps) {
  const { topCancellers, dailyTrend, patterns } = data;

  return (
    <div className="space-y-6">
      {/* Análise de Padrões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-primary h-5 w-5" />
            Análise de Padrões de Cancelamento
          </CardTitle>
          <CardDescription>
            Identificação de comportamentos críticos que geram desperdício
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Cancelamentos de Última Hora */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Cancelamentos de Última Hora
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Entre 6:30 AM e 8:30 AM do dia anterior
                  </p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-500">
                  {patterns.lastMinuteCancellations}
                </span>
                <span className="text-muted-foreground text-sm">
                  cancelamentos
                </span>
              </div>
              {patterns.lastMinuteCancellations > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-500">
                  ⚠️ Cancelamentos em horário crítico que dificultam o
                  planejamento
                </p>
              )}
            </div>

            {/* Canceladores Recorrentes */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                  <Users className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Canceladores Recorrentes
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Usuários com mais de 3 cancelamentos
                  </p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-red-600 dark:text-red-500">
                  {patterns.recurringCancellers}
                </span>
                <span className="text-muted-foreground text-sm">usuários</span>
              </div>
              {patterns.recurringCancellers > 0 && (
                <p className="text-xs text-red-600 dark:text-red-500">
                  ⚠️ Usuários com padrão de cancelamento frequente
                </p>
              )}
            </div>
          </div>

          {/* Alerta se houver padrões críticos */}
          {(patterns.lastMinuteCancellations > 10 ||
            patterns.recurringCancellers > 5) && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Padrões críticos identificados
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Recomendações: Considere implementar lembretes automáticos
                    antes do prazo limite, aplicar penalidades para canceladores
                    recorrentes, ou oferecer incentivos para confirmação
                    antecipada.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Evolução Temporal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            Evolução de Cancelamentos no Período
          </CardTitle>
          <CardDescription>
            Tendência diária de cancelamentos para identificar picos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyTrend.length > 0 ? (
            <LineChart
              data={dailyTrend}
              xKey="date"
              lines={[
                {
                  dataKey: "cancellations",
                  name: "Cancelamentos",
                  color: "#ef4444",
                },
              ]}
              height={300}
            />
          ) : (
            <div className="text-muted-foreground flex h-[300px] items-center justify-center">
              <p className="text-sm">Nenhum dado disponível para o período</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top 10 Usuários com Mais Cancelamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-primary h-5 w-5" />
            Top 10 Usuários com Mais Cancelamentos
          </CardTitle>
          <CardDescription>
            Usuários que mais cancelaram reservas no período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topCancellers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead className="text-right">
                      Total de Cancelamentos
                    </TableHead>
                    <TableHead className="text-right">
                      Taxa de Cancelamento
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCancellers.map((user, index) => (
                    <TableRow
                      key={user.userId}
                      className={cn(
                        user.cancellationRate > 50 &&
                          "bg-red-50 dark:bg-red-950/20",
                      )}
                    >
                      <TableCell className="font-medium">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                            index === 0 &&
                              "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-500",
                            index === 1 &&
                              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                            index === 2 &&
                              "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-500",
                            index > 2 && "bg-muted text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.userName}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {user.userCpf}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            user.totalCancellations > 10
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                              : user.totalCancellations > 5
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
                          )}
                        >
                          {user.totalCancellations}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "font-medium",
                            user.cancellationRate > 50
                              ? "text-red-600 dark:text-red-500"
                              : user.cancellationRate > 30
                                ? "text-orange-600 dark:text-orange-500"
                                : "text-yellow-600 dark:text-yellow-500",
                          )}
                        >
                          {user.cancellationRate.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-muted-foreground flex min-h-[200px] items-center justify-center">
              <p className="text-sm">
                Nenhum usuário com cancelamentos no período
              </p>
            </div>
          )}

          {/* Legenda de cores */}
          {topCancellers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-muted-foreground text-xs">
                  Crítico (&gt;10 cancelamentos ou &gt;50% taxa)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-muted-foreground text-xs">
                  Moderado (5-10 cancelamentos ou 30-50% taxa)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground text-xs">
                  Baixo (&lt;5 cancelamentos ou &lt;30% taxa)
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
