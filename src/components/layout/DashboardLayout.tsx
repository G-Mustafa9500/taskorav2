import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardLayout() {
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
