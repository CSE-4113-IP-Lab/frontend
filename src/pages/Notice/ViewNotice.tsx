import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Edit, Trash2, Calendar } from "lucide-react";
import { NoticeService } from "@/services/noticeService";
import type { Post, PostType, UserRole } from "@/types";

export default function ViewNotice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (id) {
      loadNotice(parseInt(id));
    }
    // Get user role from auth context/localStorage
    const role = localStorage.getItem("userRole") as UserRole;
    setUserRole(role);
  }, [id]);

  const loadNotice = async (noticeId: number) => {
    try {
      setLoading(true);
      const noticeData = await NoticeService.getNotice(noticeId);
      setNotice(noticeData);
    } catch (error) {
      console.error("Error loading notice:", error);
      alert(
        "Failed to load notice. It may not exist or you may not have permission to view it."
      );
      navigate("/notices");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (notice) {
      navigate(`/notice/${notice.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!notice) return;

    if (
      window.confirm(
        "Are you sure you want to delete this notice? This action cannot be undone."
      )
    ) {
      try {
        await NoticeService.deleteNotice(notice.id);
        alert("Notice deleted successfully.");
        navigate("/notices");
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
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
      <main className="bg-orange-50 min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 p-0 h-auto text-gray-600 hover:text-gray-800"
            onClick={() => navigate("/notice")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notices
          </Button>

          {/* Admin Actions */}
          {userRole === "admin" && (
            <div className="flex justify-end gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}

          {/* Notice Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getTypeColor(notice.type)}>
                {getTypeDisplayName(notice.type)}
              </Badge>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Posted on: {formatDate(notice.date)}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {notice.title}
            </h1>
          </div>

          {/* Notice Content */}
          <div className="space-y-6 text-gray-800 leading-relaxed">
            <div className="whitespace-pre-wrap">{notice.content}</div>
          </div>

          {/* Attachments Section */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Attachments
              </h2>
              <div className="space-y-4">
                {notice.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center space-x-3 p-4 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      window.open(
                        `${import.meta.env.VITE_SERVER_URL}/${attachment.url}`,
                        "_blank"
                      )
                    }
                  >
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800">
                      {attachment.filename ||
                        attachment.url.split("/").pop() ||
                        "Download File"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 space-y-1">
              <p>Created: {new Date(notice.created_at).toLocaleString()}</p>
              {notice.updated_at !== notice.created_at && (
                <p>
                  Last updated: {new Date(notice.updated_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
