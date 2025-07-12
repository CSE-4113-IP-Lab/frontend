import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Download,
  Edit,
  Trash2,
} from "lucide-react";
import { NoticeService } from "@/services/noticeservice";
import type { Post, PostType, FileAttachment, UserRole } from "@/types";

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (id) {
      loadNotice(parseInt(id));
    }
    // Get user role from authentication context
    const role = localStorage.getItem("userRole") as UserRole;
    setUserRole(role);
  }, [id]);

  const loadNotice = async (noticeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const noticeData = await NoticeService.getNotice(noticeId);
      setNotice(noticeData);
    } catch (error) {
      console.error("Error loading notice:", error);
      setError(
        "Failed to load notice. It may not exist or you may not have permission to view it."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (notice) {
      navigate(`/notice/edit/${notice.id}`);
    }
  };

  const handleDelete = async () => {
    if (
      notice &&
      window.confirm("Are you sure you want to delete this notice?")
    ) {
      try {
        await NoticeService.deleteNotice(notice.id);
        navigate("/notice");
      } catch (error) {
        console.error("Error deleting notice:", error);
        alert("Failed to delete notice. Please try again.");
      }
    }
  };

  const getTypeColor = (type: PostType) => {
    switch (type) {
      case "notice":
        return "bg-blue-100 text-blue-800";
      case "announcement":
        return "bg-green-100 text-green-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeDisplayName = (type: PostType) => {
    switch (type) {
      case "notice":
        return "Notice";
      case "announcement":
        return "Announcement";
      case "event":
        return "Event";
      default:
        return type;
    }
  };

  const handleDownload = (attachment: FileAttachment) => {
    window.open(attachment.url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notice...</p>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Notice Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
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
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/notice")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              Back to Notices
            </Button>

            {userRole === "admin" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Notice Header */}
          <Card className="mb-6">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {notice.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge className={getTypeColor(notice.type)}>
                      {getTypeDisplayName(notice.type)}
                    </Badge>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Published:{" "}
                        {new Date(notice.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Notice Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: notice.content.replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {notice.attachments && notice.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Attachments ({notice.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notice.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {attachment.filename}
                          </p>
                          {attachment.size && (
                            <p className="text-sm text-gray-500">
                              {(attachment.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(attachment)}
                        className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(notice.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(notice.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
