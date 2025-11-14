"use client";

import { PageContainer } from "@/_components/ui/page-container";
import { useAuth } from "@/_hooks/use-auth";

import MyReservationsTable from "./_components/my-reservations-table";

export default function MyReservationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <PageContainer>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "Todas as Reservas" : "Minhas Reservas"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Visualize e gerencie todas as reservas de almoço do sistema"
              : "Visualize e gerencie suas reservas de almoço"}
          </p>
        </div>
        <MyReservationsTable />
      </div>
    </PageContainer>
  );
}
