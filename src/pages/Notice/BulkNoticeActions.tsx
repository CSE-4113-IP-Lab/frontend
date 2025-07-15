import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Trash2,
  Archive,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import { NoticeService } from "@/services/noticeService";
import type { Post, UserRole } from "@/types";

export default function BulkNoticeActions() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Post[]>([]);
  const [selectedNotices, setSelectedNotices] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [actionResult, setActionResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role") as UserRole;
    setUserRole(role);

    if (role !== "admin") {
      navigate("/notice");
      return;
    }

    loadNotices();
  }, [navigate]);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const allNotices = await NoticeService.getNotices(true); // Include archived
      setNotices(allNotices);
    } catch (error) {
      console.error("Error loading notices:", error);
      setActionResult({
        type: "error",
        message: "Failed to load notices. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter((notice) => {
    // Filter by type
    if (filterType !== "all" && notice.type !== filterType) {
      return false;
    }

    // Filter by date
    if (filterDate !== "all") {
      const noticeDate = new Date(notice.created_at);
      const now = new Date();
      const cutoffDate = new Date();

      switch (filterDate) {
        case "last-week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "last-month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "last-3-months":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "older":
          cutoffDate.setMonth(now.getMonth() - 6);
          return noticeDate < cutoffDate;
        default:
          return true;
      }

      if (filterDate !== "older") {
        return noticeDate >= cutoffDate;
      }
    }

    return true;
  });

  const handleSelectAll = () => {
    if (selectedNotices.size === filteredNotices.length) {
      setSelectedNotices(new Set());
    } else {
      setSelectedNotices(new Set(filteredNotices.map((notice) => notice.id)));
    }
  };

  const handleSelectNotice = (noticeId: number) => {
    const newSelected = new Set(selectedNotices);
    if (newSelected.has(noticeId)) {
      newSelected.delete(noticeId);
    } else {
      newSelected.add(noticeId);
    }
    setSelectedNotices(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedNotices.size === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedNotices.size} notice(s)? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setProcessing(true);
    setActionResult(null);

    let successCount = 0;
    let errorCount = 0;

    try {
      const deletePromises = Array.from(selectedNotices).map(
        async (noticeId) => {
          try {
            await NoticeService.deleteNotice(noticeId);
            successCount++;
          } catch (error) {
            console.error(`Error deleting notice ${noticeId}:`, error);
            errorCount++;
          }
        }
      );

      await Promise.all(deletePromises);

      if (errorCount === 0) {
        setActionResult({
          type: "success",
          message: `Successfully deleted ${successCount} notice(s).`,
        });
      } else {
        setActionResult({
          type: "error",
          message: `Deleted ${successCount} notice(s), but ${errorCount} failed.`,
        });
      }

      setSelectedNotices(new Set());
      await loadNotices(); // Reload data
    } catch (error) {
      console.error("Bulk delete error:", error);
      setActionResult({
        type: "error",
        message: "Failed to delete notices. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <Button onClick={() => navigate("/notice")} className="mt-4">
            Go to Notices
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/notice/management")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Management
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bulk Notice Actions
            </h1>
            <p className="text-gray-600 mt-2">
              Manage multiple notices at once
            </p>
          </div>
        </div>

        {/* Action Result */}
        {actionResult && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              actionResult.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
            <div className="flex items-center gap-2">
              {actionResult.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{actionResult.message}</span>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters and Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Type:</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="notice">Notice</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Date:</label>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="older">Older than 6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">
                  {selectedNotices.size} of {filteredNotices.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={filteredNotices.length === 0}>
                  {selectedNotices.size === filteredNotices.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            </div>

            {selectedNotices.size > 0 && (
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={processing}>
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected ({selectedNotices.size})
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notices List */}
        <Card>
          <CardHeader>
            <CardTitle>Notices ({filteredNotices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNotices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notices found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more notices.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg ${
                      selectedNotices.has(notice.id)
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    }`}>
                    <Checkbox
                      checked={selectedNotices.has(notice.id)}
                      onCheckedChange={() => handleSelectNotice(notice.id)}
                      className="mt-1"
                    />
                    <FileText className="w-5 h-5 text-gray-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(notice.type)}>
                          {notice.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(notice.date)}
                        </span>
                        {notice.attachments.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {notice.attachments.length} file(s)
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {notice.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created {formatDate(notice.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          ID: {notice.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
