import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Mail,
  Calendar,
  Trash2,
  UserPlus,
  Users,
  Loader2,
  Shield,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AddUserDialog } from "@/components/admin/AddUserDialog";

interface StaffMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  manager_id: string | null;
}

interface Manager {
  user_id: string;
  full_name: string;
}

export default function Staff() {
  const { role: userRole } = useAuth();
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);

  const isSuperAdmin = userRole === "super_admin";

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

      // Extract managers for team assignment
      const managerList = combined
        .filter((m) => m.role === "manager")
        .map((m) => ({ user_id: m.user_id, full_name: m.full_name }));
      setManagers(managerList);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const handleDeleteClick = (staff: StaffMember, e: React.MouseEvent) => {
    e.stopPropagation();
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;

    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke("delete-user", {
        body: { userId: staffToDelete.user_id },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "User deleted",
        description: `${staffToDelete.full_name} has been removed.`,
      });

      setDeleteDialogOpen(false);
      setStaffToDelete(null);
      setSelectedStaff(null);
      fetchStaffMembers();
    } catch (error: any) {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleAssignManager = async (staffUserId: string, managerId: string | null) => {
    setAssigning(staffUserId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ manager_id: managerId === "none" ? null : managerId })
        .eq("user_id", staffUserId);

      if (error) throw error;

      toast({
        title: "Team updated",
        description: managerId && managerId !== "none"
          ? "Staff assigned to manager"
          : "Staff removed from team",
      });

      fetchStaffMembers();
    } catch (error: any) {
      toast({
        title: "Failed to assign team",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAssigning(null);
    }
  };

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Shield className="h-4 w-4" />;
      case "manager":
        return <Users className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "default";
      case "manager":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getManagerName = (managerId: string | null) => {
    if (!managerId) return null;
    return managers.find((m) => m.user_id === managerId)?.full_name;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => setShowAddUser(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or role..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-4 text-muted-foreground">
            {searchQuery ? "No staff members match your search" : "No team members yet"}
          </p>
          {isSuperAdmin && !searchQuery && (
            <Button className="mt-4" onClick={() => setShowAddUser(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add your first team member
            </Button>
          )}
        </div>
      ) : (
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                      {staff.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{staff.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{staff.email}</p>
                    </div>
                  </div>
                  {isSuperAdmin && staff.role !== "super_admin" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleDeleteClick(staff, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(staff.role) as any} className="gap-1">
                    {getRoleIcon(staff.role)}
                    {staff.role.replace("_", " ").toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(staff.created_at)}
                  </span>
                </div>

                {/* Team assignment indicator */}
                {staff.role === "staff" && staff.manager_id && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Team: {getManagerName(staff.manager_id)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Staff Detail Panel */}
      <Sheet open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedStaff && (
            <>
              <SheetHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                    {selectedStaff.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <SheetTitle className="text-xl">{selectedStaff.full_name}</SheetTitle>
                    <Badge variant={getRoleBadgeVariant(selectedStaff.role) as any} className="mt-1 gap-1">
                      {getRoleIcon(selectedStaff.role)}
                      {selectedStaff.role.replace("_", " ").toUpperCase()}
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
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Joined {formatDate(selectedStaff.created_at)}</span>
                </div>
              </div>

              {/* Team Assignment (Super Admin only, for staff members) */}
              {isSuperAdmin && selectedStaff.role === "staff" && managers.length > 0 && (
                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium">Assign to Manager</label>
                  <Select
                    value={selectedStaff.manager_id || "none"}
                    onValueChange={(value) => handleAssignManager(selectedStaff.user_id, value)}
                    disabled={assigning === selectedStaff.user_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Manager</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager.user_id} value={manager.user_id}>
                          {manager.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {assigning === selectedStaff.user_id && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {isSuperAdmin && selectedStaff.role !== "super_admin" && (
                <div className="mt-6">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      setStaffToDelete(selectedStaff);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove User
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add User Dialog */}
      <AddUserDialog
        open={showAddUser}
        onOpenChange={setShowAddUser}
        onUserAdded={fetchStaffMembers}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {staffToDelete?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user's account and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}