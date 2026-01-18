"use client";

import { useAuth } from "@/_context/AuthContext";
import { LoadingSpinner } from "@/_ui/components/partials/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { hasRequiredRole, isLoading } = useAuth();
  const router = useRouter();
  const isAllowed = hasRequiredRole(requiredRole);

  useEffect(() => {
    if (!isLoading && !isAllowed) {
      router.push(redirectTo);
    }
  }, [isLoading, isAllowed, router, redirectTo]);

  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  if (!isAllowed) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
