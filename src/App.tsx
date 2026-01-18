import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Staff from "./pages/Staff";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import Files from "./pages/Files";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Whiteboard from "./pages/Whiteboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/files" element={<Files />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/whiteboard" element={<Whiteboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
