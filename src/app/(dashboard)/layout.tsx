"use client";

import { useState } from "react";

import Footer from "@/_components/common/footer";
import { Header } from "@/_components/common/header";
import { ProtectedRoute } from "@/_components/common/protected-route";
import { Sidebar } from "@/_components/common/sidebar";
import { AuthProvider } from "@/_providers/auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:flex lg:w-64 lg:flex-col">
            <Sidebar />
          </aside>

          {/* Sidebar - Mobile/Tablet (Sheet overlay) */}
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Sidebar */}
              <aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </aside>
            </>
          )}

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />

            {/* Page Content */}
            <main className="bg-muted/30 flex-1 overflow-y-auto">
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
