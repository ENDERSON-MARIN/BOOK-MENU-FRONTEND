"use client";

import Footer from "@/_components/common/footer";
import { AuthProvider } from "@/_providers/auth-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="from-background to-muted flex min-h-screen flex-col bg-gradient-to-br">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </AuthProvider>
  );
}
