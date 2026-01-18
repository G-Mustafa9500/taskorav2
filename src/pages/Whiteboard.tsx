import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eraser,
  Pencil,
  Square,
  Circle,
  Type,
  Undo2,
  Redo2,
  Download,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";

type Tool = "pencil" | "eraser" | "rectangle" | "circle" | "text";

const colors = [
  "#3B82F6", // primary blue
  "#22C55E", // success green
  "#F59E0B", // warning yellow
  "#EF4444", // destructive red
  "#8B5CF6", // purple
  "#000000", // black
];

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#3B82F6");
  const [brushSize, setBrushSize] = useState(4);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        // Fill with white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPosition({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    setLastPosition({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const tools = [
    { id: "pencil" as Tool, icon: Pencil, label: "Pencil" },
    { id: "eraser" as Tool, icon: Eraser, label: "Eraser" },
  ];

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Whiteboard</h1>
          <p className="text-muted-foreground">
            Collaborate and share ideas with your team
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearCanvas}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button onClick={downloadCanvas}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="border-border shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-4 p-3">
          {/* Tools */}
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {tools.map((t) => (
              <Button
                key={t.id}
                variant={tool === t.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTool(t.id)}
                className={tool === t.id ? "bg-card shadow-sm" : ""}
              >
                <t.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Separator */}
          <div className="h-8 w-px bg-border" />

          {/* Colors */}
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-6 w-6 rounded-full transition-all ${
                  color === c ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Separator */}
          <div className="h-8 w-px bg-border" />

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setBrushSize(Math.max(1, brushSize - 2))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm text-foreground">
              {brushSize}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setBrushSize(Math.min(20, brushSize + 2))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card className="flex-1 overflow-hidden border-border shadow-sm">
        <CardContent className="h-full p-0">
          <canvas
            ref={canvasRef}
            className="h-full w-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </CardContent>
      </Card>
    </div>
  );
}
