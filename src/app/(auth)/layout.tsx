import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Sistema de Reservas de Almoço",
  description: "Faça login para acessar o sistema de reservas de almoço",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-background to-muted min-h-screen bg-gradient-to-br">
      {children}
    </div>
  );
}
