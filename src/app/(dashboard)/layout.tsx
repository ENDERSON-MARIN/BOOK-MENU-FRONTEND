"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import Footer from "@/_components/common/footer";
import { ProtectedRoute } from "@/_components/common/protected-route";
import { SkipLink } from "@/_components/common/skip-link";
import { AuthProvider } from "@/_providers/auth-provider";

// Lazy load components for better performance
const Header = dynamic(
  () =>
    import("@/_components/common/header").then((mod) => ({
      default: mod.Header,
    })),
  { ssr: false },
);

const Sidebar = dynamic(
  () =>
    import("@/_components/common/sidebar").then((mod) => ({
      default: mod.Sidebar,
    })),
  { ssr: false },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ProtectedRoute>
        {/* Skip Links for keyboard navigation */}
        <SkipLink href="#main-content">
          Pular para o conteúdo principal
        </SkipLink>
        <SkipLink href="#navigation">Pular para a navegação</SkipLink>

        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Desktop */}
          <aside
            id="navigation"
            className="hidden lg:flex lg:w-64 lg:flex-col"
            aria-label="Navegação principal"
          >
            <Sidebar />
          </aside>

          {/* Sidebar - Mobile/Tablet (Sheet overlay) */}
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              {/* Sidebar */}
              <aside
                className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
                aria-label="Navegação principal"
                role="dialog"
                aria-modal="true"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </aside>
            </>
          )}

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />

            {/* Page Content */}
            <main
              id="main-content"
              className="bg-muted/30 flex-1 overflow-y-auto"
              role="main"
              aria-label="Conteúdo principal"
            >
              <div className="flex min-h-full flex-col">
                <div className="flex-1">{children}</div>
                <Footer />
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
