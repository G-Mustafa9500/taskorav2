import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  GripVertical,
  Calendar,
  Users,
  MoreHorizontal,
  Loader2,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  created_by: string;
  assignees?: string[];
}

const columns = [
  { id: "todo", title: "To Do", color: "bg-muted-foreground" },
  { id: "in_progress", title: "In Progress", color: "bg-warning" },
  { id: "done", title: "Done", color: "bg-success" },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks((data as Task[]) || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null);
      return;
    }

    // Optimistic update
    setTasks(tasks.map((task) =>
      task.id === draggedTask.id ? { ...task, status } : task
    ));

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", draggedTask.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task status");
      fetchTasks(); // Revert on error
    }
    
    setDraggedTask(null);
  };

  const handleCreateTask = async () => {
    if (!user || !newTask.title) return;
    setCreating(true);

    try {
      const { error } = await supabase.from("tasks").insert({
        title: newTask.title,
        description: newTask.description || null,
        priority: newTask.priority,
        due_date: newTask.dueDate || null,
        created_by: user.id,
        status: "todo",
      });

      if (error) throw error;

      toast.success("Task created successfully");
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast.error(error.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw error;
      
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground">
            Drag and drop tasks between columns
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleCreateTask}
                disabled={!newTask.title || creating}
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);
          return (
            <div
              key={column.id}
              className="flex flex-col rounded-xl bg-muted/30 p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as Task["status"])}
            >
              {/* Column Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex flex-1 flex-col gap-3">
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`cursor-grab border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md active:cursor-grabbing ${
                      draggedTask?.id === task.id ? "opacity-50" : ""
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <GripVertical className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          className={`${getPriorityColor(task.priority)} text-xs`}
                          variant="outline"
                        >
                          {task.priority}
                        </Badge>
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(task.due_date), "MMM d")}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Drop tasks here
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}