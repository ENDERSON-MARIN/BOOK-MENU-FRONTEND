import {
  PageContainer,
  PageContent,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

import CategoriesTable from "./_components/categories-table";
import { CreateCategoryButton } from "./_components/create-category-button";

export default function CategoriesPage() {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Categorias</PageHeaderTitle>
          <PageHeaderDescription>
            Gerencie as categorias de alimentos do sistema de reservas
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <CreateCategoryButton />
        </PageHeaderActions>
      </PageHeaderContainer>

      <PageContent>
        <CategoriesTable />
      </PageContent>
    </PageContainer>
  );
}
