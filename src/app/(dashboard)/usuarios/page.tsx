import {
  PageContainer,
  PageContent,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

import { CreateUserButton } from "./_components/create-user-button";
import UsersTable from "./_components/users-table";

export default function UsersPage() {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Usuários</PageHeaderTitle>
          <PageHeaderDescription>
            Gerencie os usuários do sistema de reservas de almoço
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <CreateUserButton />
        </PageHeaderActions>
      </PageHeaderContainer>

      <PageContent>
        <UsersTable />
      </PageContent>
    </PageContainer>
  );
}
