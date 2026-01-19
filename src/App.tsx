import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Staff from "./pages/Staff";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import Files from "./pages/Files";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Whiteboard from "./pages/Whiteboard";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Role-based redirect component
function RoleBasedRedirect() {
  const { role, loading } = useAuth();
  
  if (loading) return null;
  
  if (role === "super_admin") return <Navigate to="/admin" replace />;
  if (role === "manager") return <Navigate to="/manager" replace />;
  return <Navigate to="/staff-dashboard" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<RoleBasedRedirect />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/files" element={<Files />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/whiteboard" element={<Whiteboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
