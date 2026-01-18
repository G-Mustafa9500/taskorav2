import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignees: string[];
  dueDate: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design System Update",
    description: "Update the design tokens and component library",
    status: "todo",
    priority: "high",
    assignees: ["SJ", "MC"],
    dueDate: "Jan 20",
  },
  {
    id: "2",
    title: "API Integration",
    description: "Connect frontend with backend APIs",
    status: "todo",
    priority: "medium",
    assignees: ["EW"],
    dueDate: "Jan 22",
  },
  {
    id: "3",
    title: "User Authentication",
    description: "Implement login and signup flows",
    status: "in_progress",
    priority: "high",
    assignees: ["MC", "EW"],
    dueDate: "Jan 18",
  },
  {
    id: "4",
    title: "Dashboard Analytics",
    description: "Add charts and data visualization",
    status: "in_progress",
    priority: "medium",
    assignees: ["AK"],
    dueDate: "Jan 25",
  },
  {
    id: "5",
    title: "Mobile Responsive",
    description: "Ensure all pages work on mobile devices",
    status: "in_progress",
    priority: "low",
    assignees: ["SJ"],
    dueDate: "Jan 28",
  },
  {
    id: "6",
    title: "Unit Tests",
    description: "Write tests for core components",
    status: "done",
    priority: "medium",
    assignees: ["MC"],
    dueDate: "Jan 15",
  },
  {
    id: "7",
    title: "Documentation",
    description: "Create technical documentation",
    status: "done",
    priority: "low",
    assignees: ["LP"],
    dueDate: "Jan 14",
  },
];

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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      setTasks(
        tasks.map((task) =>
          task.id === draggedTask.id ? { ...task, status } : task
        )
      );
    }
    setDraggedTask(null);
  };

  const handleCreateTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority as Task["priority"],
      assignees: [],
      dueDate: newTask.dueDate || "TBD",
    };
    setTasks([task, ...tasks]);
    setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
    setIsDialogOpen(false);
  };

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
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, priority: value })
                    }
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
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleCreateTask}
                disabled={!newTask.title}
              >
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
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
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
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          className={`${getPriorityColor(task.priority)} text-xs`}
                          variant="outline"
                        >
                          {task.priority}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      {task.assignees.length > 0 && (
                        <div className="mt-3 flex items-center gap-1">
                          <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                          <div className="flex -space-x-2">
                            {task.assignees.map((assignee, index) => (
                              <div
                                key={index}
                                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary/10 text-[10px] font-medium text-primary"
                              >
                                {assignee}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
