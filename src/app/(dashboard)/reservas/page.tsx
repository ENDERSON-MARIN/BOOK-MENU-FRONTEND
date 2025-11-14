import { PageContainer } from "@/_components/ui/page-container";

import MyReservationsTable from "./_components/my-reservations-table";

export default function MyReservationsPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Reservas</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie suas reservas de almoço
          </p>
        </div>
        <MyReservationsTable />
      </div>
    </PageContainer>
  );
}
