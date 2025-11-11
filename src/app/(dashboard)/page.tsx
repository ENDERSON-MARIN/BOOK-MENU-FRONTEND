"use client";

import {
  PageContainer,
  PageContent,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/_components/ui/page-container";
import { useAuth } from "@/_hooks/use-auth";

import { AdminDashboard } from "./_components/admin-dashboard";
import { UserDashboard } from "./_components/user-dashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeaderContainer>
        <PageHeaderContent>
          <PageHeaderTitle>Dashboard</PageHeaderTitle>
          <PageHeaderDescription>
            {user?.role === "ADMIN"
              ? "Visão geral do sistema de reservas de almoço"
              : "Bem-vindo ao sistema de reservas de almoço"}
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeaderContainer>

      <PageContent>
        {user?.role === "ADMIN" ? <AdminDashboard /> : <UserDashboard />}
      </PageContent>
    </PageContainer>
  );
}
