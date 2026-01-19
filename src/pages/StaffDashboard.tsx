import {
  CheckSquare,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

export default function StaffDashboard() {
  const { profile } = useAuth();

  const stats = [
    {
      title: "My Tasks",
      value: "0",
      icon: CheckSquare,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Completed",
      value: "0",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "In Progress",
      value: "0",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Files Uploaded",
      value: "0",
      icon: FileText,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  const myTasks = [
    { status: "To Do", count: 0, color: "bg-muted-foreground" },
    { status: "In Progress", count: 0, color: "bg-warning" },
    { status: "Done", count: 0, color: "bg-success" },
  ];

  const totalTasks = myTasks.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.full_name}! Here's your work summary.
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

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Tasks Progress */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">My Tasks Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myTasks.map((task) => (
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
            {totalTasks === 0 && (
              <div className="pt-2 text-center text-sm text-muted-foreground">
                No tasks assigned yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">View My Tasks</p>
                  <p className="text-sm text-muted-foreground">Check your assigned tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Attendance</p>
                  <p className="text-sm text-muted-foreground">You're marked present today</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <FileText className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Upload Files</p>
                  <p className="text-sm text-muted-foreground">Share documents with your team</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
