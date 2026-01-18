import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Upload,
  FileText,
  FileImage,
  FileSpreadsheet,
  Download,
  Search,
  FolderOpen,
  MoreVertical,
  Eye,
  Trash2,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "document" | "image" | "spreadsheet" | "other";
  size: string;
  uploadedBy: string;
  uploadedByAvatar: string;
  date: string;
  subject: string;
  taskLinked?: string;
}

const files: FileItem[] = [
  {
    id: "1",
    name: "Q4 Report.pdf",
    type: "document",
    size: "2.4 MB",
    uploadedBy: "Mike Chen",
    uploadedByAvatar: "MC",
    date: "Jan 15, 2024",
    subject: "Quarterly Report",
    taskLinked: "Q4 Review",
  },
  {
    id: "2",
    name: "Homepage Design.png",
    type: "image",
    size: "4.1 MB",
    uploadedBy: "Sarah Johnson",
    uploadedByAvatar: "SJ",
    date: "Jan 14, 2024",
    subject: "Design Assets",
    taskLinked: "Design Homepage",
  },
  {
    id: "3",
    name: "Budget 2024.xlsx",
    type: "spreadsheet",
    size: "856 KB",
    uploadedBy: "Alex Kumar",
    uploadedByAvatar: "AK",
    date: "Jan 12, 2024",
    subject: "Finance",
  },
  {
    id: "4",
    name: "Meeting Notes.docx",
    type: "document",
    size: "124 KB",
    uploadedBy: "Lisa Park",
    uploadedByAvatar: "LP",
    date: "Jan 10, 2024",
    subject: "Meeting Summary",
  },
  {
    id: "5",
    name: "Brand Guidelines.pdf",
    type: "document",
    size: "8.2 MB",
    uploadedBy: "Sarah Johnson",
    uploadedByAvatar: "SJ",
    date: "Jan 8, 2024",
    subject: "Branding",
  },
  {
    id: "6",
    name: "Analytics Dashboard.png",
    type: "image",
    size: "1.8 MB",
    uploadedBy: "Emma Wilson",
    uploadedByAvatar: "EW",
    date: "Jan 6, 2024",
    subject: "Screenshots",
    taskLinked: "Dashboard Analytics",
  },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "document":
      return FileText;
    case "image":
      return FileImage;
    case "spreadsheet":
      return FileSpreadsheet;
    default:
      return FileText;
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case "document":
      return "bg-primary/10 text-primary";
    case "image":
      return "bg-success/10 text-success";
    case "spreadsheet":
      return "bg-warning/10 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Files() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Files</h1>
          <p className="text-muted-foreground">Manage uploaded files and documents</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 font-medium text-foreground">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  Browse Files
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Enter file subject" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Add a message..." />
              </div>
              <Button className="w-full" onClick={() => setIsUploadOpen(false)}>
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" />
            {files.length} files
          </span>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFiles.map((file) => {
          const FileIcon = getFileIcon(file.type);
          return (
            <Card
              key={file.id}
              className="group border-border shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${getFileColor(
                      file.type
                    )}`}
                  >
                    <FileIcon className="h-6 w-6" />
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium text-foreground truncate">{file.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{file.subject}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {file.uploadedByAvatar}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {file.uploadedBy}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                </div>

                {file.taskLinked && (
                  <div className="mt-3">
                    <Badge variant="secondary" className="text-xs">
                      📎 {file.taskLinked}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">No files found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or upload a new file
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
