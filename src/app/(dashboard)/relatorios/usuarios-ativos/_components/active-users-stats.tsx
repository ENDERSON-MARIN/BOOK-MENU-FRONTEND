"use client";

import { TrendingUp, UserCheck, Users } from "lucide-react";

import { PieChart } from "@/_components/charts/pie-chart";
import { StatCard } from "@/_components/reports/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { ActiveUsersReportData } from "@/_types/report";

interface ActiveUsersStatsProps {
  data: ActiveUsersReportData;
}

export function ActiveUsersStats({ data }: ActiveUsersStatsProps) {
  const { summary, userTypeDistribution } = data;

  // Preparar dados para o gráfico de pizza
  const pieChartData = [
    {
      name: "Fixo",
      value: userTypeDistribution.fixo,
    },
    {
      name: "Não Fixo",
      value: userTypeDistribution.naoFixo,
    },
  ];

  // Cores da empresa: verde principal e amarelo
  const colors = ["#1b994b", "#e4e30d"];

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={UserCheck}
          title="Total de Usuários Ativos"
          value={summary.totalActiveUsers}
          description="Usuários que fizeram pelo menos uma reserva"
        />
        <StatCard
          icon={Users}
          title="Total de Usuários Cadastrados"
          value={summary.totalRegisteredUsers}
          description="Total de usuários no sistema"
        />
        <StatCard
          icon={TrendingUp}
          title="Taxa de Adesão"
          value={`${summary.adherenceRate.toFixed(1)}%`}
          description="Percentual de usuários ativos"
        />
      </div>

      {/* Gráfico de pizza - Distribuição por tipo de usuário */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo de Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={pieChartData} colors={colors} height={300} />
        </CardContent>
      </Card>
    </div>
  );
}
