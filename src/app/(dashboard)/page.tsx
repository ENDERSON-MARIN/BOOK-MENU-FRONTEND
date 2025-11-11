import {
  PageContainer,
  PageContent,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Dashboard</PageHeaderTitle>
          <PageHeaderDescription>
            Bem-vindo ao Sistema de Reservas de Almoço
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeaderContainer>

      <PageContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for dashboard cards/statistics */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Próximos Cardápios</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Visualize os cardápios da semana
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Minhas Reservas</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Gerencie suas reservas de almoço
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Estatísticas</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Resumo das suas atividades
            </p>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
}
