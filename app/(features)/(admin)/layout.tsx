"use client";

import { Header } from "@/_ui/components/partials/Header";
import { ProtectedRoute } from "@/_ui/components/partials/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen flex-col gap-8 py-6">
        <Header />
        <div className="container mx-auto">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
