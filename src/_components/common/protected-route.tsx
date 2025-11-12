"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/_hooks/use-auth";
import type { UserRole } from "@/_types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Higher-Order Component (HOC) that protects routes based on authentication and role
 *
 * @param children - The child components to render if access is granted
 * @param allowedRoles - Optional array of roles that are allowed to access this route
 *
 * @example
 * // Protect a route for authenticated users only
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 *
 * @example
 * // Protect a route for admin users only
 * <ProtectedRoute allowedRoles={["ADMIN"]}>
 *   <AdminPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // Wait for auth state to be initialized
    if (isLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role-based access if allowedRoles is specified
    if (allowedRoles && allowedRoles.length > 0 && user) {
      const hasPermission = allowedRoles.includes(user.role);

      if (!hasPermission) {
        // Redirect to home page if user doesn't have required role
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render children if user doesn't have required role
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasPermission = allowedRoles.includes(user.role);
    if (!hasPermission) {
      return null;
    }
  }

  return <>{children}</>;
}
