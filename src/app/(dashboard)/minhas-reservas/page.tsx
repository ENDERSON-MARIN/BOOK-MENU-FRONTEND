"use client";

import {
  PageContainer,
  PageContent,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";

import MyReservationsTable from "../reservas/_components/my-reservations-table";

export default function MyReservationsPage() {
  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Minhas Reservas</PageHeaderTitle>
          <PageHeaderDescription>
            Visualize e gerencie suas reservas de almoço
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeaderContainer>

      <PageContent>
        <MyReservationsTable />
      </PageContent>
    </PageContainer>
  );
}
