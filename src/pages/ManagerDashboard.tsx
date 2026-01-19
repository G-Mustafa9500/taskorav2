import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StaffMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  manager_id: string | null;
}

interface Task {
  id: string;
  status: string;
}

export default function ManagerDashboard() {
  const { profile, user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch staff members assigned to this manager
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .eq("manager_id", user.id)
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

        // Fetch tasks created by or assigned to team members
        const teamUserIds = combined.map((m) => m.user_id);
        
        if (teamUserIds.length > 0) {
          const { data: taskData, error: taskError } = await supabase
            .from("tasks")
            .select("id, status")
            .or(`created_by.in.(${teamUserIds.join(",")})`);

          if (!taskError && taskData) {
            setTasks(taskData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const tasksByStatus = [
    { status: "To Do", count: tasks.filter((t) => t.status === "todo").length, color: "bg-muted-foreground" },
    { status: "In Progress", count: tasks.filter((t) => t.status === "in_progress").length, color: "bg-warning" },
    { status: "Done", count: tasks.filter((t) => t.status === "done").length, color: "bg-success" },
  ];

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status !== "done").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  const stats = [
    {
      title: "Team Members",
      value: staffMembers.length.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Today",
      value: staffMembers.filter((s) => s.is_active).length.toString(),
      icon: Clock,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks.toString(),
      icon: CheckSquare,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Completed This Week",
      value: completedTasks.toString(),
      icon: TrendingUp,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.full_name}! Monitor your team's progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <span className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </span>
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

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task Overview */}
        <Card className="border-border shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Task Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksByStatus.map((task) => (
              <div key={task.status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{task.status}</span>
                  <span className="font-medium text-foreground">
                    {task.count}
                  </span>
                </div>
                <Progress
                  value={totalTasks > 0 ? (task.count / totalTasks) * 100 : 0}
                  className="h-2"
                />
              </div>
            ))}
            <div className="pt-2 text-center text-sm text-muted-foreground">
              {totalTasks} total tasks
            </div>
          </CardContent>
        </Card>

        {/* Staff List */}
        <Card className="border-border shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Your Team</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : staffMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">No team members assigned yet</p>
                <p className="text-sm">Ask your admin to assign staff to your team</p>
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
                        {member.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.full_name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant={member.is_active ? "default" : "secondary"}>
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}