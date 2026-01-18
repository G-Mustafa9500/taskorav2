import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const staffAttendance = [
  { id: "1", name: "Sarah Johnson", avatar: "SJ", status: "present", checkIn: "9:00 AM", checkOut: "6:00 PM" },
  { id: "2", name: "Mike Chen", avatar: "MC", status: "present", checkIn: "9:15 AM", checkOut: "-" },
  { id: "3", name: "Emma Wilson", avatar: "EW", status: "late", checkIn: "10:30 AM", checkOut: "-" },
  { id: "4", name: "Alex Kumar", avatar: "AK", status: "present", checkIn: "8:45 AM", checkOut: "-" },
  { id: "5", name: "Lisa Park", avatar: "LP", status: "absent", checkIn: "-", checkOut: "-" },
  { id: "6", name: "David Brown", avatar: "DB", status: "present", checkIn: "9:05 AM", checkOut: "-" },
  { id: "7", name: "Rachel Green", avatar: "RG", status: "leave", checkIn: "-", checkOut: "-" },
  { id: "8", name: "Tom Smith", avatar: "TS", status: "present", checkIn: "8:55 AM", checkOut: "-" },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "present":
      return "bg-success/10 text-success border-success/20";
    case "late":
      return "bg-warning/10 text-warning border-warning/20";
    case "absent":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "leave":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const weeklyData = [
  { day: "Mon", present: 22, absent: 2, late: 1 },
  { day: "Tue", present: 23, absent: 1, late: 1 },
  { day: "Wed", present: 21, absent: 2, late: 2 },
  { day: "Thu", present: 24, absent: 0, late: 1 },
  { day: "Fri", present: 20, absent: 3, late: 2 },
];

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState("today");
  const [viewMode, setViewMode] = useState("daily");

  const summaryData = {
    total: staffAttendance.length,
    present: staffAttendance.filter((s) => s.status === "present").length,
    absent: staffAttendance.filter((s) => s.status === "absent").length,
    late: staffAttendance.filter((s) => s.status === "late").length,
    leave: staffAttendance.filter((s) => s.status === "leave").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Track daily staff attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Navigation */}
      <Card className="border-border shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-lg font-medium text-foreground">
              January 16, 2024
            </span>
            <Badge variant="secondary">Today</Badge>
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">{summaryData.total}</p>
            <p className="text-sm text-muted-foreground">Total Staff</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{summaryData.present}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-destructive">{summaryData.absent}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-warning">{summaryData.late}</p>
            <p className="text-sm text-muted-foreground">Late</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-info">{summaryData.leave}</p>
            <p className="text-sm text-muted-foreground">On Leave</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Staff Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Staff
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Check In
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Check Out
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffAttendance.map((staff) => {
                  const hours =
                    staff.status === "present" && staff.checkOut !== "-"
                      ? "9h 00m"
                      : staff.status === "present"
                      ? "In Progress"
                      : "-";
                  return (
                    <tr
                      key={staff.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {staff.avatar}
                          </div>
                          <span className="font-medium text-foreground">
                            {staff.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge
                          className={`${getStatusStyles(staff.status)} capitalize`}
                          variant="outline"
                        >
                          {staff.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          {staff.checkIn !== "-" && (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {staff.checkIn}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          {staff.checkOut !== "-" && (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {staff.checkOut}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-muted-foreground">{hours}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {weeklyData.map((day) => (
              <div
                key={day.day}
                className="rounded-lg bg-muted/50 p-4 text-center"
              >
                <p className="mb-2 font-medium text-foreground">{day.day}</p>
                <div className="space-y-1 text-xs">
                  <p className="text-success">{day.present} present</p>
                  <p className="text-destructive">{day.absent} absent</p>
                  <p className="text-warning">{day.late} late</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
