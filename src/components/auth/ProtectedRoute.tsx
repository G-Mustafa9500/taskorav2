import { Navigate, Outlet } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

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

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    if (role === "super_admin") {
      return <Navigate to="/admin" replace />;
    } else if (role === "manager") {
      return <Navigate to="/manager" replace />;
    } else {
      return <Navigate to="/staff-dashboard" replace />;
    }
  }

  return <Outlet />;
}
