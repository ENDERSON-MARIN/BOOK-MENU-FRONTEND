"use client";

import { AuthProvider } from "@/_providers/auth-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="from-background to-muted min-h-screen bg-gradient-to-br">
        {children}
      </div>
    </AuthProvider>
  );
}
