"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/_context/AuthContext";

interface UseRouteGuardOptions {
  requiredRole?: string | string[];
  redirectTo?: string;
}

export function useRouteGuard(options: UseRouteGuardOptions = {}) {
  const { requiredRole, redirectTo = "/" } = options;
  const { hasRequiredRole, isLoading } = useAuth();
  const router = useRouter();
  const isAllowed = hasRequiredRole(requiredRole);

  useEffect(() => {
    if (!isLoading && !isAllowed) {
      console.log(`Access denied. Redirecting to ${redirectTo}.`);
      router.push(redirectTo);
    }
  }, [isAllowed, isLoading, router, redirectTo]);

  return { isLoading, isAllowed };
}
