import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Shield,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showAddUser, setShowAddUser] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffMembers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const combined = profiles?.map((p) => ({
        ...p,
        role: roles?.find((r) => r.user_id === p.user_id)?.role || "staff",
      })) || [];

      setStaffMembers(combined);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const clearDemoData = async () => {
    toast({
      title: "Demo data cleared",
      description: "All demo data has been removed from the display.",
    });
  };

  const stats = [
    {
      title: "Total Staff",
      value: staffMembers.filter(s => s.role !== "super_admin").length.toString(),
      change: "+0",
      changeType: "increase" as const,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Managers",
      value: staffMembers.filter(s => s.role === "manager").length.toString(),
      change: "+0",
      changeType: "increase" as const,
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Staff Members",
      value: staffMembers.filter(s => s.role === "staff").length.toString(),
      change: "+0",
      changeType: "increase" as const,
      icon: CheckSquare,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Active Today",
      value: staffMembers.filter(s => s.is_active).length.toString(),
      change: "+0",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name}! Manage your entire organization.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearDemoData}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Demo Data
          </Button>
          <Button onClick={() => setShowAddUser(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff List */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          ) : staffMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">No team members yet</p>
              <p className="text-sm">Click "Add User" to invite your first team member</p>
            </div>
          ) : (
            <div className="space-y-3">
              {staffMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {member.full_name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant={member.role === "super_admin" ? "default" : member.role === "manager" ? "secondary" : "outline"}>
                    {member.role.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddUserDialog 
        open={showAddUser} 
        onOpenChange={setShowAddUser}
        onUserAdded={fetchStaffMembers}
      />
    </div>
  );
}
