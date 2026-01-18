import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "Total Staff",
    value: "24",
    change: "+2",
    changeType: "increase" as const,
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Active Today",
    value: "18",
    change: "+5",
    changeType: "increase" as const,
    icon: Clock,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Pending Tasks",
    value: "12",
    change: "-3",
    changeType: "decrease" as const,
    icon: CheckSquare,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Completed This Week",
    value: "47",
    change: "+12",
    changeType: "increase" as const,
    icon: TrendingUp,
    color: "text-info",
    bgColor: "bg-info/10",
  },
];

const recentActivities = [
  {
    user: "Sarah Johnson",
    action: "completed task",
    target: "Design Homepage",
    time: "5 min ago",
    avatar: "SJ",
  },
  {
    user: "Mike Chen",
    action: "uploaded file",
    target: "Q4 Report.pdf",
    time: "12 min ago",
    avatar: "MC",
  },
  {
    user: "Emma Wilson",
    action: "started task",
    target: "API Integration",
    time: "25 min ago",
    avatar: "EW",
  },
  {
    user: "Alex Kumar",
    action: "checked in",
    target: "",
    time: "1 hour ago",
    avatar: "AK",
  },
  {
    user: "Lisa Park",
    action: "commented on",
    target: "Marketing Plan",
    time: "2 hours ago",
    avatar: "LP",
  },
];

const tasksByStatus = [
  { status: "To Do", count: 12, color: "bg-muted-foreground" },
  { status: "In Progress", count: 8, color: "bg-warning" },
  { status: "Done", count: 47, color: "bg-success" },
];

export default function Dashboard() {
  const totalTasks = tasksByStatus.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        stat.changeType === "increase"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {stat.changeType === "increase" ? (
                        <ArrowUpRight className="mr-0.5 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-0.5 h-3 w-3" />
                      )}
                      {stat.change}
                    </Badge>
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
                  value={(task.count / totalTasks) * 100}
                  className="h-2"
                />
              </div>
            ))}
            <div className="pt-2 text-center text-sm text-muted-foreground">
              {totalTasks} total tasks
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>
                      {activity.target && (
                        <span className="font-medium"> {activity.target}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Summary */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-success/10 p-4 text-center">
              <p className="text-2xl font-bold text-success">18</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
            <div className="rounded-lg bg-destructive/10 p-4 text-center">
              <p className="text-2xl font-bold text-destructive">3</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
            <div className="rounded-lg bg-warning/10 p-4 text-center">
              <p className="text-2xl font-bold text-warning">2</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
            <div className="rounded-lg bg-info/10 p-4 text-center">
              <p className="text-2xl font-bold text-info">1</p>
              <p className="text-sm text-muted-foreground">On Leave</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
