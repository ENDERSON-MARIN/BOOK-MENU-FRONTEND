import {
  PageContainer,
  PageContent,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

import { CreateMenuItemButton } from "./_components/create-menu-item-button";
import MenuItemsTable from "./_components/menu-items-table";

export default function MenuItemsPage() {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Itens de Menu</PageHeaderTitle>
          <PageHeaderDescription>
            Gerencie os itens de menu disponíveis para compor os cardápios
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <CreateMenuItemButton />
        </PageHeaderActions>
      </PageHeaderContainer>

      <PageContent>
        <MenuItemsTable />
      </PageContent>
    </PageContainer>
  );
}
