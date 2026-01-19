import { useState, useRef, useEffect, useCallback } from "react";
import {
  Pencil,
  Eraser,
  Download,
  Trash2,
  Save,
  FolderOpen,
  Plus,
  Share2,
  Loader2,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Tool = "pencil" | "eraser";

interface WhiteboardItem {
  id: string;
  user_id: string;
  name: string;
  canvas_data: string | null;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

const colors = [
  "#000000",
  "#374151",
  "#DC2626",
  "#EA580C",
  "#CA8A04",
  "#16A34A",
  "#0EA5E9",
  "#8B5CF6",
  "#EC4899",
];

export default function Whiteboard() {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  // Database state
  const [whiteboards, setWhiteboards] = useState<WhiteboardItem[]>([]);
  const [currentWhiteboard, setCurrentWhiteboard] =
    useState<WhiteboardItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isShared, setIsShared] = useState(false);

  // Auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    fetchWhiteboards();

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const fetchWhiteboards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("whiteboards")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setWhiteboards(data || []);
    } catch (error) {
      console.error("Error fetching whiteboards:", error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (currentWhiteboard) {
      autoSaveTimerRef.current = setTimeout(() => {
        saveCurrentWhiteboard();
      }, 3000);
    }
  }, [currentWhiteboard]);

  const saveCurrentWhiteboard = async () => {
    if (!currentWhiteboard || !canvasRef.current) return;

    try {
      const canvasData = canvasRef.current.toDataURL();
      const { error } = await supabase
        .from("whiteboards")
        .update({
          canvas_data: canvasData,
          is_shared: isShared,
        })
        .eq("id", currentWhiteboard.id);

      if (error) throw error;
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  };

  const handleSaveNew = async () => {
    if (!user || !canvasRef.current || !newName.trim()) {
      toast.error("Please enter a name for the whiteboard");
      return;
    }

    setSaving(true);
    try {
      const canvasData = canvasRef.current.toDataURL();
      const { data, error } = await supabase
        .from("whiteboards")
        .insert({
          user_id: user.id,
          name: newName.trim(),
          canvas_data: canvasData,
          is_shared: isShared,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentWhiteboard(data);
      setWhiteboards([data, ...whiteboards]);
      setSaveDialogOpen(false);
      setNewName("");
      toast.success("Whiteboard saved");
    } catch (error: any) {
      console.error("Error saving whiteboard:", error);
      toast.error(error.message || "Failed to save whiteboard");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!currentWhiteboard) {
      setSaveDialogOpen(true);
      return;
    }

    setSaving(true);
    try {
      const canvasData = canvasRef.current?.toDataURL();
      const { error } = await supabase
        .from("whiteboards")
        .update({
          canvas_data: canvasData,
          is_shared: isShared,
        })
        .eq("id", currentWhiteboard.id);

      if (error) throw error;
      toast.success("Whiteboard saved");
      fetchWhiteboards();
    } catch (error: any) {
      console.error("Error saving whiteboard:", error);
      toast.error(error.message || "Failed to save whiteboard");
    } finally {
      setSaving(false);
    }
  };

  const loadWhiteboard = async (whiteboard: WhiteboardItem) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (whiteboard.canvas_data) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = whiteboard.canvas_data;
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    setCurrentWhiteboard(whiteboard);
    setIsShared(whiteboard.is_shared);
    setLoadDialogOpen(false);
    toast.success(`Loaded "${whiteboard.name}"`);
  };

  const deleteWhiteboard = async (id: string) => {
    try {
      const { error } = await supabase.from("whiteboards").delete().eq("id", id);

      if (error) throw error;

      setWhiteboards(whiteboards.filter((w) => w.id !== id));
      if (currentWhiteboard?.id === id) {
        setCurrentWhiteboard(null);
        clearCanvas();
      }
      toast.success("Whiteboard deleted");
    } catch (error: any) {
      console.error("Error deleting whiteboard:", error);
      toast.error(error.message || "Failed to delete whiteboard");
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPos({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? brushSize * 3 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPos(null);
      scheduleAutoSave();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setClearDialogOpen(false);
    scheduleAutoSave();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${currentWhiteboard?.name || "whiteboard"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const createNewWhiteboard = () => {
    setCurrentWhiteboard(null);
    setIsShared(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    toast.info("New whiteboard created");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {currentWhiteboard ? currentWhiteboard.name : "Whiteboard"}
          </h1>
          <p className="text-muted-foreground">
            {currentWhiteboard
              ? isShared
                ? "Shared with team"
                : "Private"
              : "Create or load a whiteboard"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={createNewWhiteboard}>
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderOpen className="mr-2 h-4 w-4" />
                Load
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Load Whiteboard</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-80">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : whiteboards.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No saved whiteboards
                  </p>
                ) : (
                  <div className="space-y-2">
                    {whiteboards.map((wb) => (
                      <div
                        key={wb.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{wb.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(wb.updated_at).toLocaleDateString()}
                            {wb.is_shared && " • Shared"}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => loadWhiteboard(wb)}
                          >
                            Open
                          </Button>
                          {wb.user_id === user?.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteWhiteboard(wb.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setClearDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCanvas}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          {/* Tools */}
          <div className="flex gap-1">
            <Toggle
              pressed={tool === "pencil"}
              onPressedChange={() => setTool("pencil")}
              aria-label="Pencil"
            >
              <Pencil className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={tool === "eraser"}
              onPressedChange={() => setTool("eraser")}
              aria-label="Eraser"
            >
              <Eraser className="h-4 w-4" />
            </Toggle>
          </div>

          {/* Colors */}
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  color === c ? "scale-110 border-primary" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Size:</span>
            <Slider
              value={[brushSize]}
              onValueChange={(v) => setBrushSize(v[0])}
              min={1}
              max={20}
              step={1}
              className="w-24"
            />
            <span className="w-6 text-sm">{brushSize}</span>
          </div>

          {/* Share toggle */}
          <div className="ml-auto flex items-center gap-2">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <Switch checked={isShared} onCheckedChange={setIsShared} />
            <span className="text-sm text-muted-foreground">Share</span>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            className="w-full cursor-crosshair bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </CardContent>
      </Card>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Whiteboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My Whiteboard"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isShared} onCheckedChange={setIsShared} />
              <Label>Share with team</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNew} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Confirmation */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Canvas</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear the canvas? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearCanvas}>Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}