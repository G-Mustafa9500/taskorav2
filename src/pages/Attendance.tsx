import { useState, useEffect } from "react";
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
import { Calendar, ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";

interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  profile?: {
    full_name: string;
    email: string;
  };
}

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

export default function Attendance() {
  const { user, role } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("daily");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { full_name: string; email: string }>>({});
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchAttendance = async () => {
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", dateStr);

      if (attendanceError) throw attendanceError;

      // Fetch profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email");

      if (profilesError) throw profilesError;

      const profilesMap: Record<string, { full_name: string; email: string }> = {};
      profilesData?.forEach((p) => {
        profilesMap[p.user_id] = { full_name: p.full_name, email: p.email };
      });
      setProfiles(profilesMap);

      // Merge attendance with profiles
      const merged = attendanceData?.map((a) => ({
        ...a,
        profile: profilesMap[a.user_id],
      })) || [];

      setAttendance(merged);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const handleCheckIn = async () => {
    if (!user) return;
    setCheckingIn(true);
    
    try {
      const now = new Date();
      const dateStr = format(now, "yyyy-MM-dd");
      const isLate = now.getHours() >= 10; // After 10 AM is late
      
      const { error } = await supabase.from("attendance").upsert({
        user_id: user.id,
        date: dateStr,
        check_in: now.toISOString(),
        status: isLate ? "late" : "present",
      }, { onConflict: "user_id,date" });

      if (error) throw error;
      
      toast.success(`Checked in at ${format(now, "h:mm a")}`);
      fetchAttendance();
    } catch (error: any) {
      console.error("Check-in error:", error);
      toast.error(error.message || "Failed to check in");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    setCheckingOut(true);
    
    try {
      const now = new Date();
      const dateStr = format(now, "yyyy-MM-dd");
      
      const { error } = await supabase
        .from("attendance")
        .update({ check_out: now.toISOString() })
        .eq("user_id", user.id)
        .eq("date", dateStr);

      if (error) throw error;
      
      toast.success(`Checked out at ${format(now, "h:mm a")}`);
      fetchAttendance();
    } catch (error: any) {
      console.error("Check-out error:", error);
      toast.error(error.message || "Failed to check out");
    } finally {
      setCheckingOut(false);
    }
  };

  const myAttendance = attendance.find((a) => a.user_id === user?.id);
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  const summaryData = {
    total: Object.keys(profiles).length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: Object.keys(profiles).length - attendance.length,
    late: attendance.filter((a) => a.status === "late").length,
    leave: attendance.filter((a) => a.status === "leave").length,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "-";
    return format(new Date(isoString), "h:mm a");
  };

  const calculateHours = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn) return "-";
    if (!checkOut) return "In Progress";
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
          {isToday && (
            <div className="flex gap-2">
              {!myAttendance?.check_in ? (
                <Button onClick={handleCheckIn} disabled={checkingIn}>
                  {checkingIn ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
                  Check In
                </Button>
              ) : !myAttendance?.check_out ? (
                <Button variant="outline" onClick={handleCheckOut} disabled={checkingOut}>
                  {checkingOut ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
                  Check Out
                </Button>
              ) : (
                <Badge variant="secondary" className="py-2 px-3">
                  ✓ Completed for today
                </Badge>
              )}
            </div>
          )}
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Navigation */}
      <Card className="border-border shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-lg font-medium text-foreground">
              {format(selectedDate, "MMMM d, yyyy")}
            </span>
            {isToday && <Badge variant="secondary">Today</Badge>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Staff</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Check In</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Check Out</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length > 0 ? (
                    attendance.map((record) => (
                      <tr key={record.id} className="border-b border-border last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {getInitials(record.profile?.full_name || "?")}
                            </div>
                            <span className="font-medium text-foreground">
                              {record.profile?.full_name || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className={`${getStatusStyles(record.status)} capitalize`} variant="outline">
                            {record.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            {record.check_in && <Clock className="h-4 w-4 text-muted-foreground" />}
                            {formatTime(record.check_in)}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            {record.check_out && <Clock className="h-4 w-4 text-muted-foreground" />}
                            {formatTime(record.check_out)}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-muted-foreground">
                            {calculateHours(record.check_in, record.check_out)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No attendance records for this date
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}