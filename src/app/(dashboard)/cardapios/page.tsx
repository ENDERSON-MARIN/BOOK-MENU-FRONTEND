import {
  PageContainer,
  PageContent,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

import { CreateMenuButton } from "./_components/create-menu-button";
import MenusTable from "./_components/menus-table";

export default function CardapiosPage() {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Cardápios</PageHeaderTitle>
          <PageHeaderDescription>
            Gerencie os cardápios semanais do sistema de reservas
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <CreateMenuButton />
        </PageHeaderActions>
      </PageHeaderContainer>

      <PageContent>
        <MenusTable />
      </PageContent>
    </PageContainer>
  );
}
