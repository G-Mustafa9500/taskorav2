import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckSquare,
  User,
  FileText,
  MessageCircle,
  Check,
  X,
} from "lucide-react";

interface Notification {
  id: string;
  type: "task" | "user" | "file" | "message";
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "task",
    title: "Task Assigned",
    description: 'You have been assigned to "Design Homepage"',
    time: "5 min ago",
    read: false,
    avatar: "SJ",
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    description: "Sarah Johnson sent you a message",
    time: "12 min ago",
    read: false,
    avatar: "SJ",
  },
  {
    id: "3",
    type: "task",
    title: "Task Completed",
    description: 'Mike Chen completed "API Integration"',
    time: "1 hour ago",
    read: false,
    avatar: "MC",
  },
  {
    id: "4",
    type: "file",
    title: "File Uploaded",
    description: "Emma Wilson uploaded Q4 Report.pdf",
    time: "2 hours ago",
    read: true,
    avatar: "EW",
  },
  {
    id: "5",
    type: "user",
    title: "Profile Updated",
    description: "Alex Kumar updated their profile",
    time: "3 hours ago",
    read: true,
    avatar: "AK",
  },
  {
    id: "6",
    type: "task",
    title: "Task Status Changed",
    description: '"Dashboard Analytics" moved to In Progress',
    time: "5 hours ago",
    read: true,
  },
  {
    id: "7",
    type: "message",
    title: "New Message",
    description: "Lisa Park sent you a message",
    time: "1 day ago",
    read: true,
    avatar: "LP",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "task":
      return CheckSquare;
    case "user":
      return User;
    case "file":
      return FileText;
    case "message":
      return MessageCircle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "task":
      return "bg-primary/10 text-primary";
    case "user":
      return "bg-success/10 text-success";
    case "file":
      return "bg-warning/10 text-warning";
    case "message":
      return "bg-info/10 text-info";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={`border-border shadow-sm transition-all duration-200 ${
                    !notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    {notification.avatar && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {notification.avatar}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {filteredNotifications.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium text-foreground">
                    No notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
