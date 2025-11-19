"use client";

import { BarChart } from "@/_components/charts/bar-chart";
import { PieChart } from "@/_components/charts/pie-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";
import { OperationalStatsReportData } from "@/_types/report";

interface OperationalStatsChartsProps {
  data: OperationalStatsReportData;
}

export function OperationalStatsCharts({ data }: OperationalStatsChartsProps) {
  // Preparar dados para o gráfico de distribuição por dia da semana
  const dayOfWeekChartData = data.dayOfWeekDistribution.map((item) => ({
    dayOfWeek: item.dayOfWeek,
    count: item.count,
  }));

  // Preparar dados para o gráfico de distribuição por variação
  const variationChartData = [
    {
      name: "Padrão",
      value: data.variationDistribution.standard,
    },
    {
      name: "Com Ovo",
      value: data.variationDistribution.withEgg,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análises Gráficas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="day-of-week" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="day-of-week" className="text-xs sm:text-sm">
              Por Dia da Semana
            </TabsTrigger>
            <TabsTrigger value="variation" className="text-xs sm:text-sm">
              Por Variação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="day-of-week" className="mt-6">
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">
                Distribuição de Reservas por Dia da Semana
              </h3>
              <p className="text-muted-foreground text-xs">
                Visualize quais dias da semana têm maior volume de reservas
              </p>
              <div className="mt-4 h-[250px] sm:h-[350px]">
                <BarChart
                  data={dayOfWeekChartData}
                  xKey="dayOfWeek"
                  bars={[
                    {
                      dataKey: "count",
                      name: "Reservas",
                      color: "#1b994b",
                    },
                  ]}
                  height={350}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variation" className="mt-6">
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">
                Distribuição de Reservas por Variação
              </h3>
              <p className="text-muted-foreground text-xs">
                Proporção entre reservas padrão e com ovo
              </p>
              <div className="mt-4 flex h-[250px] w-full justify-center sm:h-[350px]">
                <PieChart
                  data={variationChartData}
                  colors={["#1b994b", "#e4e30d"]}
                  height={350}
                  showPercentage={true}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
