"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  PageContainer,
  PageContent,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";
import { useAuth } from "@/_hooks/use-auth";

import AllReservationsTable from "./_components/all-reservations-table";

export default function AllReservationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </PageContainer>
    );
  }

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Todas as Reservas</PageHeaderTitle>
          <PageHeaderDescription>
            Visualize e gerencie todas as reservas de almoço do sistema
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeaderContainer>

      <PageContent>
        <AllReservationsTable />
      </PageContent>
    </PageContainer>
  );
}
