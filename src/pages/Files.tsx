import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Search,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Presentation,
  Download,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FileItem {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  subject: string | null;
  task_id: string | null;
  created_at: string;
  uploader_name?: string;
}

function getFileIcon(type: string) {
  const iconMap: Record<string, typeof FileText> = {
    pdf: FileText,
    doc: FileText,
    docx: FileText,
    xls: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    csv: FileSpreadsheet,
    ppt: Presentation,
    pptx: Presentation,
    jpg: Image,
    jpeg: Image,
    png: Image,
    gif: Image,
    webp: Image,
    svg: Image,
  };
  const ext = type.split("/").pop()?.toLowerCase() || "";
  return iconMap[ext] || File;
}

function getFileColor(type: string): string {
  const colorMap: Record<string, string> = {
    pdf: "bg-destructive/10 text-destructive",
    doc: "bg-primary/10 text-primary",
    docx: "bg-primary/10 text-primary",
    xls: "bg-success/10 text-success",
    xlsx: "bg-success/10 text-success",
    csv: "bg-success/10 text-success",
    ppt: "bg-warning/10 text-warning",
    pptx: "bg-warning/10 text-warning",
    jpg: "bg-info/10 text-info",
    jpeg: "bg-info/10 text-info",
    png: "bg-info/10 text-info",
    gif: "bg-info/10 text-info",
  };
  const ext = type.split("/").pop()?.toLowerCase() || "";
  return colorMap[ext] || "bg-muted text-muted-foreground";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Files() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [subject, setSubject] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("file_metadata")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch uploader names
      const userIds = [...new Set(data?.map((f) => f.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const filesWithNames = data?.map((file) => ({
        ...file,
        uploader_name:
          profiles?.find((p) => p.user_id === file.user_id)?.full_name ||
          "Unknown",
      }));

      setFiles(filesWithNames || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || !user) return;

    setUploading(true);

    try {
      for (const file of Array.from(selectedFiles)) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}-${file.name}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save metadata
        const { error: metadataError } = await supabase
          .from("file_metadata")
          .insert({
            user_id: user.id,
            file_name: file.name,
            file_type: file.type || `application/${fileExt}`,
            file_size: file.size,
            storage_path: filePath,
            subject: subject || null,
          });

        if (metadataError) throw metadataError;
      }

      toast.success("File(s) uploaded successfully");
      setUploadDialogOpen(false);
      setSubject("");
      fetchFiles();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .download(file.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleView = async (file: FileItem) => {
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .createSignedUrl(file.storage_path, 3600);

      if (error) throw error;

      window.open(data.signedUrl, "_blank");
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Failed to view file");
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("files")
        .remove([fileToDelete.storage_path]);

      if (storageError) throw storageError;

      // Delete metadata
      const { error: metadataError } = await supabase
        .from("file_metadata")
        .delete()
        .eq("id", fileToDelete.id);

      if (metadataError) throw metadataError;

      toast.success("File deleted successfully");
      setDeleteDialogOpen(false);
      setFileToDelete(null);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const filteredFiles = files.filter(
    (file) =>
      file.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploader_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Files</h1>
          <p className="text-muted-foreground">
            Manage and share your team's files
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Project Report, Meeting Notes"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={uploading}
                  multiple
                />
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
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
        <p className="text-sm text-muted-foreground">
          {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 text-lg font-medium text-foreground">
              No files found
            </p>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "Upload your first file to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles.map((file) => {
            const Icon = getFileIcon(file.file_type);
            return (
              <Card
                key={file.id}
                className="group relative overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${getFileColor(
                        file.file_type
                      )}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {file.file_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </p>
                      {file.subject && (
                        <Badge variant="secondary" className="mt-1">
                          {file.subject}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{file.uploader_name}</span>
                    <span>
                      {new Date(file.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Action buttons on hover */}
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center gap-1 bg-gradient-to-t from-background to-transparent p-2 transition-transform group-hover:translate-y-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleView(file)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {file.user_id === user?.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setFileToDelete(file);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{fileToDelete?.file_name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}