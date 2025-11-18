import {
  BarChart3Icon,
  CalendarDaysIcon,
  TrashIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import { ReportCard } from "./report-card";

export function ReportsDashboard() {
  const reports = [
    {
      title: "Reservas por Período",
      description:
        "Analise o volume e padrões de reservas ao longo do tempo, incluindo estatísticas de cancelamentos e reservas automáticas.",
      icon: CalendarDaysIcon,
      href: "/relatorios/reservas-periodo",
    },
    {
      title: "Cardápios Populares",
      description:
        "Visualize os cardápios mais reservados e identifique preferências alimentares para planejar cardápios futuros.",
      icon: BarChart3Icon,
      href: "/relatorios/cardapios-populares",
    },
    {
      title: "Usuários Ativos",
      description:
        "Entenda o engajamento dos colaboradores com estatísticas sobre usuários ativos e taxas de adesão.",
      icon: UsersIcon,
      href: "/relatorios/usuarios-ativos",
    },
    {
      title: "Estatísticas Operacionais",
      description:
        "Tenha uma visão geral consolidada do funcionamento do sistema com métricas operacionais detalhadas.",
      icon: TrendingUpIcon,
      href: "/relatorios/estatisticas-operacionais",
    },
    {
      title: "Desperdício e Cancelamentos",
      description:
        "Analise padrões de cancelamento para identificar problemas e reduzir desperdício de alimentos.",
      icon: TrashIcon,
      href: "/relatorios/desperdicio-cancelamentos",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {reports.map((report) => (
        <ReportCard
          key={report.href}
          title={report.title}
          description={report.description}
          icon={report.icon}
          href={report.href}
        />
      ))}
    </div>
  );
}
