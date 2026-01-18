import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  User,
  Bell,
  Shield,
  Palette,
  Users,
  Plus,
  Trash2,
} from "lucide-react";

const teamMembers = [
  { id: "1", name: "John Doe", email: "john@taskora.com", role: "Super Admin", avatar: "JD" },
  { id: "2", name: "Sarah Johnson", email: "sarah@taskora.com", role: "Manager", avatar: "SJ" },
  { id: "3", name: "Mike Chen", email: "mike@taskora.com", role: "Staff", avatar: "MC" },
  { id: "4", name: "Emma Wilson", email: "emma@taskora.com", role: "Staff", avatar: "EW" },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
              <CardDescription>
                Update your company details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Taskora Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" defaultValue="Technology" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://taskora.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="America/New_York" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing for more content
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Team Members</CardTitle>
                <CardDescription>
                  Manage your team and their roles
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          member.role === "Super Admin"
                            ? "default"
                            : member.role === "Manager"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {member.role}
                      </Badge>
                      {member.role !== "Super Admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Task Assignments", description: "When you're assigned to a task" },
                { title: "Task Updates", description: "When task status changes" },
                { title: "New Messages", description: "When you receive a new message" },
                { title: "File Uploads", description: "When someone uploads a file" },
                { title: "Team Changes", description: "When team members are added or removed" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <Label>{item.title}</Label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a code in addition to your password
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border border-destructive/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Workspace</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
