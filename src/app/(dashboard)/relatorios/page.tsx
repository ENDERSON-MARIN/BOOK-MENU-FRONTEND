import {
  PageContainer,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

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
    </PageContainer>
  );
}
