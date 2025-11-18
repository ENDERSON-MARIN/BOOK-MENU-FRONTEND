"use client";

import { ProtectedRoute } from "@/_components/common/protected-route";

export default function RelatoriosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedRoles={["ADMIN"]}>{children}</ProtectedRoute>;
}
