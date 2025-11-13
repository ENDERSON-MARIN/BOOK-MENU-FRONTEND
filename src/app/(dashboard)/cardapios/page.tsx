import {
  PageContainer,
  PageContent,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

import { MenusCalendar } from "./_components/menus-calendar";

export default function MenusPage() {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Cardápios</PageHeaderTitle>
          <PageHeaderDescription>
            Visualize os cardápios da semana e gerencie suas reservas
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeaderContainer>

      <PageContent>
        <MenusCalendar />
      </PageContent>
    </PageContainer>
  );
}
