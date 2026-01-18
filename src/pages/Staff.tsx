import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageCircle,
  MoreVertical,
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  status: "online" | "offline" | "away";
  taskCount: number;
  completedTasks: number;
  phone: string;
  location: string;
  joinDate: string;
}

const staffData: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@taskora.com",
    role: "UI Designer",
    department: "Design",
    avatar: "SJ",
    status: "online",
    taskCount: 8,
    completedTasks: 5,
    phone: "+1 234 567 890",
    location: "New York, USA",
    joinDate: "Jan 15, 2024",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@taskora.com",
    role: "Frontend Developer",
    department: "Engineering",
    avatar: "MC",
    status: "online",
    taskCount: 12,
    completedTasks: 9,
    phone: "+1 234 567 891",
    location: "San Francisco, USA",
    joinDate: "Mar 02, 2024",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@taskora.com",
    role: "Backend Developer",
    department: "Engineering",
    avatar: "EW",
    status: "away",
    taskCount: 6,
    completedTasks: 4,
    phone: "+1 234 567 892",
    location: "Austin, USA",
    joinDate: "Feb 10, 2024",
  },
  {
    id: "4",
    name: "Alex Kumar",
    email: "alex@taskora.com",
    role: "Product Manager",
    department: "Product",
    avatar: "AK",
    status: "online",
    taskCount: 15,
    completedTasks: 11,
    phone: "+1 234 567 893",
    location: "Seattle, USA",
    joinDate: "Dec 05, 2023",
  },
  {
    id: "5",
    name: "Lisa Park",
    email: "lisa@taskora.com",
    role: "Marketing Lead",
    department: "Marketing",
    avatar: "LP",
    status: "offline",
    taskCount: 9,
    completedTasks: 7,
    phone: "+1 234 567 894",
    location: "Los Angeles, USA",
    joinDate: "Jan 20, 2024",
  },
  {
    id: "6",
    name: "David Brown",
    email: "david@taskora.com",
    role: "DevOps Engineer",
    department: "Engineering",
    avatar: "DB",
    status: "online",
    taskCount: 7,
    completedTasks: 6,
    phone: "+1 234 567 895",
    location: "Chicago, USA",
    joinDate: "Apr 01, 2024",
  },
];

const staffTasks = [
  { id: "1", title: "Design Homepage Mockup", status: "done", priority: "high" },
  { id: "2", title: "Create Icon Set", status: "in_progress", priority: "medium" },
  { id: "3", title: "Update Brand Guidelines", status: "todo", priority: "low" },
];

const attendanceHistory = [
  { date: "Jan 16, 2024", status: "present", checkIn: "9:00 AM", checkOut: "6:00 PM" },
  { date: "Jan 15, 2024", status: "present", checkIn: "9:15 AM", checkOut: "6:30 PM" },
  { date: "Jan 14, 2024", status: "absent", checkIn: "-", checkOut: "-" },
  { date: "Jan 13, 2024", status: "present", checkIn: "8:45 AM", checkOut: "5:45 PM" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-success";
    case "away":
      return "bg-warning";
    default:
      return "bg-muted-foreground";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive";
    case "medium":
      return "bg-warning/10 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case "done":
      return "bg-success/10 text-success";
    case "in_progress":
      return "bg-warning/10 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Staff() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStaff = staffData.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, role, or department..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Staff Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((staff) => (
          <Card
            key={staff.id}
            className="cursor-pointer border-border shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            onClick={() => setSelectedStaff(staff)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                      {staff.avatar}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${getStatusColor(
                        staff.status
                      )}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{staff.name}</h3>
                    <p className="text-sm text-muted-foreground">{staff.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Badge variant="secondary" className="text-xs">
                  {staff.department}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>
                    {staff.completedTasks}/{staff.taskCount} tasks
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <Progress
                  value={(staff.completedTasks / staff.taskCount) * 100}
                  className="h-1.5"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff Detail Panel */}
      <Sheet open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedStaff && (
            <>
              <SheetHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                      {selectedStaff.avatar}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${getStatusColor(
                        selectedStaff.status
                      )}`}
                    />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">{selectedStaff.name}</SheetTitle>
                    <p className="text-muted-foreground">{selectedStaff.role}</p>
                    <Badge variant="secondary" className="mt-1">
                      {selectedStaff.department}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              {/* Contact Info */}
              <div className="space-y-3 border-b border-border pb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStaff.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStaff.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStaff.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Joined {selectedStaff.joinDate}</span>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="tasks" className="mt-6">
                <TabsList className="w-full">
                  <TabsTrigger value="tasks" className="flex-1">
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="flex-1">
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger value="files" className="flex-1">
                    Files
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="mt-4 space-y-3">
                  {staffTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <div className="mt-1 flex gap-2">
                          <Badge className={getTaskStatusColor(task.status)} variant="secondary">
                            {task.status.replace("_", " ")}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)} variant="secondary">
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="attendance" className="mt-4 space-y-3">
                  {attendanceHistory.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{record.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {record.checkIn} - {record.checkOut}
                        </p>
                      </div>
                      <Badge
                        className={
                          record.status === "present"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }
                        variant="secondary"
                      >
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="files" className="mt-4">
                  <div className="rounded-lg border border-dashed border-border p-8 text-center">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No files uploaded yet</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button className="flex-1">
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4" />
                  Assign Task
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
