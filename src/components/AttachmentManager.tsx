import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Upload,
  Trash2,
  Download,
  AlertCircle,
  Check,
} from "lucide-react";
import { NoticeService } from "@/services/noticeService";
import type { Post } from "@/types";

interface AttachmentManagerProps {
  notice: Post;
  onUpdate: (updatedNotice: Post) => void;
  readOnly?: boolean;
}

export default function AttachmentManager({
  notice,
  onUpdate,
  readOnly = false,
}: AttachmentManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage({
        type: "error",
        text: "File size must be less than 10MB",
      });
      return;
    }

    setUploading(true);
    setUploadMessage(null);

    try {
      const updatedNotice = await NoticeService.addAttachment(notice.id, file);
      onUpdate(updatedNotice);
      setUploadMessage({
        type: "success",
        text: `File "${file.name}" uploaded successfully`,
      });
      // Clear the input
      event.target.value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage({
        type: "error",
        text: "Failed to upload file. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (fileId: number, filename: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    );
    if (!confirmDelete) return;

    setDeletingId(fileId);
    try {
      const updatedNotice = await NoticeService.removeAttachment(
        notice.id,
        fileId
      );
      onUpdate(updatedNotice);
      setUploadMessage({
        type: "success",
        text: `File "${filename}" deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting attachment:", error);
      setUploadMessage({
        type: "error",
        text: "Failed to delete file. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (contentType?: string) => {
    if (!contentType) return FileText;
    if (contentType.startsWith("image/")) return FileText;
    if (contentType.includes("pdf")) return FileText;
    if (contentType.includes("document") || contentType.includes("word"))
      return FileText;
    return FileText;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Attachments ({notice.attachments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        {!readOnly && (
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload New File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.ppt,.pptx"
              />
              <Button disabled={uploading} size="sm">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, XLS, XLSX,
              PPT, PPTX (Max 10MB)
            </p>
          </div>
        )}

        {/* Upload Message */}
        {uploadMessage && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              uploadMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
            {uploadMessage.type === "success" ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{uploadMessage.text}</span>
          </div>
        )}

        {/* Attachments List */}
        {notice.attachments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No attachments</p>
            {!readOnly && (
              <p className="text-sm">
                Upload files to attach them to this notice
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {notice.attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.content_type);
              return (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">
                        {attachment.filename}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {attachment.size && (
                          <>
                            <span>{formatFileSize(attachment.size)}</span>
                            <span>•</span>
                          </>
                        )}
                        {attachment.content_type && (
                          <Badge variant="outline" className="text-xs">
                            {attachment.content_type
                              .split("/")[1]
                              ?.toUpperCase() || "FILE"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {attachment.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(attachment.url, "_blank")}>
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    {!readOnly && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={deletingId === attachment.id}
                        onClick={() =>
                          handleDeleteAttachment(
                            attachment.id,
                            attachment.filename
                          )
                        }>
                        {deletingId === attachment.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
