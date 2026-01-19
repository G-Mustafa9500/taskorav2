import { Outlet, Navigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function DashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-64 transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
