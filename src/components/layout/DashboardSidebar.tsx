import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  Palette,
  MessageCircle,
  Bell,
  Settings,
  FolderOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const getMenuItems = (role: AppRole | null) => {
  const baseItems = [
    { icon: CheckSquare, label: "Tasks", path: "/tasks" },
    { icon: FolderOpen, label: "Files", path: "/files" },
    { icon: Palette, label: "Whiteboard", path: "/whiteboard" },
    { icon: MessageCircle, label: "Chat", path: "/chat", comingSoon: true },
    { icon: Bot, label: "AI Assistant", path: "/ai-assistant" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (role === "super_admin") {
    return [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
      { icon: Users, label: "Staff", path: "/staff" },
      { icon: Clock, label: "Attendance", path: "/attendance" },
      ...baseItems,
    ];
  }

  if (role === "manager") {
    return [
      { icon: LayoutDashboard, label: "Dashboard", path: "/manager" },
      { icon: Users, label: "Staff", path: "/staff" },
      { icon: Clock, label: "Attendance", path: "/attendance" },
      ...baseItems,
    ];
  }

  // Staff
  return [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff-dashboard" },
    ...baseItems,
  ];
};

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { profile, role, signOut } = useAuth();

  const menuItems = getMenuItems(role);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: AppRole | null) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "manager":
        return "Manager";
      case "staff":
        return "Staff";
      default:
        return "";
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link to={role === "super_admin" ? "/admin" : role === "manager" ? "/manager" : "/staff-dashboard"} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Taskora</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <CheckSquare className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const itemWithBadge = item as typeof item & { comingSoon?: boolean };
          return (
            <Link
              key={item.path}
              to={itemWithBadge.comingSoon ? "#" : item.path}
              onClick={(e) => itemWithBadge.comingSoon && e.preventDefault()}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive && !itemWithBadge.comingSoon
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                itemWithBadge.comingSoon && "cursor-not-allowed opacity-60"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="flex items-center gap-2">
                  {item.label}
                  {itemWithBadge.comingSoon && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      Soon
                    </Badge>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-secondary"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* User Section */}
      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {profile ? getInitials(profile.full_name) : "?"}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {profile?.full_name || "Loading..."}
              </p>
              <p className="truncate text-xs text-muted-foreground flex items-center gap-1">
                {role === "super_admin" && <Shield className="h-3 w-3" />}
                {getRoleBadge(role)}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="shrink-0" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
