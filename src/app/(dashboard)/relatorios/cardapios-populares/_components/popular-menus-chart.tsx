"use client";

import { BarChart } from "@/_components/charts/bar-chart";
import { PieChart } from "@/_components/charts/pie-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";
import { formatReportDateWithWeekday } from "@/_lib/report-utils";
import { cn } from "@/_lib/utils";
import { PopularMenusReportData } from "@/_types/report";

interface PopularMenusChartProps {
  data: PopularMenusReportData;
  className?: string;
}

/**
 * Componente de gráficos para relatório de cardápios populares
 * Exibe gráfico de barras horizontal com top 10 e gráfico de pizza para distribuição de variações
 *
 * @param data - Dados do relatório de cardápios populares
 * @param className - Classes CSS adicionais
 *
 * @example
 * <PopularMenusChart data={reportData} />
 */
export function PopularMenusChart({ data, className }: PopularMenusChartProps) {
  // Preparar dados para o gráfico de barras (top 10)
  const top10Menus = data.topMenus.slice(0, 10);
  const barChartData = top10Menus.map((menu) => ({
    name: formatReportDateWithWeekday(menu.date),
    reservas: menu.totalReservations,
  }));

  // Calcular totais de variações de todos os cardápios
  const totalStandard = data.topMenus.reduce(
    (sum, menu) => sum + menu.variationDistribution.standard,
    0,
  );
  const totalWithEgg = data.topMenus.reduce(
    (sum, menu) => sum + menu.variationDistribution.withEgg,
    0,
  );

  // Preparar dados para o gráfico de pizza
  const pieChartData = [
    {
      name: "Padrão",
      value: totalStandard,
    },
    {
      name: "Com Ovo",
      value: totalWithEgg,
    },
  ];

  // Cores da empresa
  const pieColors = ["#1b994b", "#e4e30d"];

  if (top10Menus.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Gráficos</CardTitle>
          <CardDescription>
            Nenhum dado disponível para visualização
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs defaultValue="bar-chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bar-chart">Top 10 Cardápios</TabsTrigger>
          <TabsTrigger value="pie-chart">Distribuição de Variações</TabsTrigger>
        </TabsList>

        {/* Gráfico de Barras Horizontal - Top 10 */}
        <TabsContent value="bar-chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Cardápios Mais Reservados</CardTitle>
              <CardDescription>
                Ranking dos cardápios com maior número de reservas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={barChartData}
                xKey="name"
                bars={[
                  {
                    dataKey: "reservas",
                    name: "Reservas",
                    color: "#1b994b",
                  },
                ]}
                layout="horizontal"
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfico de Pizza - Distribuição de Variações */}
        <TabsContent value="pie-chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Variações</CardTitle>
              <CardDescription>
                Proporção entre variações Padrão e Com Ovo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PieChart
                data={pieChartData}
                colors={pieColors}
                height={350}
                showPercentage={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
