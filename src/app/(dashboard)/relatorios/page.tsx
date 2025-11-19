import {
  PageContainer,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

import { ReportsDashboard } from "./_components/reports-dashboard";

export default function RelatoriosPage() {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Relatórios</PageHeaderTitle>
          <PageHeaderDescription>
            Análises e estatísticas do sistema de reservas
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeaderContainer>
      <ReportsDashboard />
    </PageContainer>
  );
}
