import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X, FileText } from "lucide-react";
import { NoticeService } from "@/services/noticeService";
import type { Post, PostType, FileAttachment, UserRole } from "@/types";

export default function EditNotice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingNotice, setLoadingNotice] = useState(true);
  const [notice, setNotice] = useState<Post | null>(null);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>(
    []
  );
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    type: "notice" as PostType,
    title: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    // Get user role from localStorage (consistent with Assignments component)
    const role = localStorage.getItem("role") as UserRole;
    setUserRole(role);

    // Redirect non-admin users
    if (role !== "admin") {
      navigate("/notice");
      return;
    }

    const fetchNotice = async () => {
      if (!id) return;

      try {
        const noticeData = await NoticeService.getNotice(parseInt(id));
        setNotice(noticeData);
        setFormData({
          type: noticeData.type,
          title: noticeData.title,
          content: noticeData.content,
          date: noticeData.date,
        });
      } catch (error) {
        console.error("Error fetching notice:", error);
        alert("Failed to load notice. Please try again.");
        navigate("/notice");
      } finally {
        setLoadingNotice(false);
      }
    };

    fetchNotice();
  }, [id, navigate]);

  // Show loading or redirect for non-admin users
  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access Denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);

    try {
      const updatedNotice = await NoticeService.updateNotice(
        parseInt(id),
        formData
      );

      // Remove deleted attachments
      for (const attachmentId of deletedAttachmentIds) {
        await NoticeService.removeAttachment(parseInt(id), attachmentId);
      }

      // Upload new attachments if any
      for (const file of newAttachments) {
        await NoticeService.addAttachment(updatedNotice.id, file);
      }

      navigate(`/notice/${updatedNotice.id}`);
    } catch (error) {
      console.error("Error updating notice:", error);
      alert("Failed to update notice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewAttachments((prev) => [...prev, ...files]);
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (fileId: number) => {
    // Mark attachment for deletion instead of immediately deleting
    setDeletedAttachmentIds((prev) => [...prev, fileId]);
  };

  const restoreExistingAttachment = (fileId: number) => {
    // Remove from deletion list to restore the attachment
    setDeletedAttachmentIds((prev) => prev.filter((id) => id !== fileId));
  };

  if (loadingNotice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notice...</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Notice not found
          </h2>
          <p className="text-gray-600 mb-4">
            The notice you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/notice")}>Back to Notices</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 p-0 h-auto text-gray-600 hover:text-gray-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notice
          </Button>

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Notice</h1>

          <Card>
            <CardHeader>
              <CardTitle>Notice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 w-full p-2">
                {/* Notice Type */}
                <div className="space-y-2 w-full p-2">
                  <Label htmlFor="type">Notice Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: PostType) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select notice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notice">Notice</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div className="space-y-2 w-full p-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter notice title"
                    required
                  />
                </div>

                {/* Date */}
                <div className="space-y-2 w-full p-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                </div>

                {/* Content */}
                <div className="space-y-2 w-full p-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Enter notice content"
                    rows={10}
                    required
                  />
                </div>

                {/* Existing Attachments */}
                {notice.attachments && notice.attachments.length > 0 && (
                  <div className="space-y-2 w-full p-2">
                    <Label>Current Attachments</Label>
                    <div className="space-y-2">
                      {notice.attachments.map((attachment: FileAttachment) => {
                        const isMarkedForDeletion =
                          deletedAttachmentIds.includes(attachment.id);
                        return (
                          <div
                            key={attachment.id}
                            className={`flex items-center justify-between p-3 rounded ${
                              isMarkedForDeletion
                                ? "bg-red-50 border border-red-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <FileText
                                className={`w-5 h-5 ${
                                  isMarkedForDeletion
                                    ? "text-red-400"
                                    : "text-gray-600"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  isMarkedForDeletion
                                    ? "text-red-500 line-through"
                                    : "text-gray-700"
                                }`}
                              >
                                {attachment.filename ||
                                  attachment.url.split("/").pop() ||
                                  "Download File"}
                              </span>
                              {isMarkedForDeletion && (
                                <span className="text-xs text-red-500 font-medium">
                                  (Will be deleted)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {isMarkedForDeletion ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="cursor-pointer text-green-600 hover:text-green-800"
                                  onClick={() =>
                                    restoreExistingAttachment(attachment.id)
                                  }
                                >
                                  Restore
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    removeExistingAttachment(attachment.id)
                                  }
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* New Attachments */}
                <div className="space-y-2 w-full p-2">
                  <Label>Add New Attachments</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload files
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Display new uploaded files */}
                  {newAttachments.length > 0 && (
                    <div className="mt-4 space-y-2 w-full p-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        New Files to Upload:
                      </h4>
                      {newAttachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-blue-50 rounded"
                        >
                          <span className="text-sm text-blue-700">
                            {file.name || "File"}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNewAttachment(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 w-full p-2">
                  <Button
                    type="button"
                    // variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#14244c] text-white hover:bg-[#ecb31d] cursor-pointer"
                  >
                    {loading ? "Updating..." : "Update Notice"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
