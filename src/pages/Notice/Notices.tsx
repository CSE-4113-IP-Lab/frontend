import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Archive, Calendar, FileText, Plus } from "lucide-react";
import { NoticeService } from "@/services/noticeService";
import type { Post, PostType, UserRole } from "@/types";

export function NoticeBoardPage() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Post[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all-types");
  const [selectedDate, setSelectedDate] = useState<string>("all-dates");
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    loadActiveNotices();
    // In a real app, you'd get the user role from authentication context
    // For now, we'll assume it's available in localStorage or context
    const role = localStorage.getItem("userRole") as UserRole;
    setUserRole(role);
  }, []);

  const filterNotices = useCallback(() => {
    let filtered = notices;

    // Filter by type
    if (selectedType !== "all-types") {
      filtered = filtered.filter(
        (notice) => notice.type.toLowerCase() === selectedType
      );
    }

    // Filter by date
    if (selectedDate !== "all-dates") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (selectedDate) {
        case "this-week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "this-month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "last-month":
          cutoffDate.setMonth(now.getMonth() - 2);
          break;
      }

      filtered = filtered.filter(
        (notice) => new Date(notice.date) >= cutoffDate
      );
    }

    setFilteredNotices(filtered);
  }, [notices, selectedType, selectedDate]);

  useEffect(() => {
    filterNotices();
  }, [filterNotices]);

  const loadActiveNotices = async () => {
    try {
      setLoading(true);
      const activeNotices = await NoticeService.getActiveNotices();
      setNotices(activeNotices);
    } catch (error) {
      console.error("Error loading notices:", error);
      // Fallback to sample data for demo purposes
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: PostType) => {
    switch (type) {
      case "notice":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "announcement":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "event":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
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

  const handleNoticeClick = (noticeId: number) => {
    navigate(`/notice/${noticeId}`);
  };

  const handleCreateNotice = () => {
    navigate("/notice/create");
  };

  const handleViewArchive = () => {
    navigate("/notice/archived");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">NOTICES</h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleViewArchive}
                className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                View Archive
              </Button>
              {userRole === "admin" && (
                <Button
                  onClick={handleCreateNotice}
                  className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Notice
                </Button>
              )}
            </div>
          </div>

          {/* Filter Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Filter by Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="notice">Notice</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Filter by Date
                  </label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All Dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-dates">All Dates</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notices Table */}
          <Card>
            <CardContent className="p-0">
              {filteredNotices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No notices found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {notices.length === 0
                      ? "No notices available at the moment"
                      : "Try adjusting your filters"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b font-medium text-gray-700">
                    <div className="col-span-6">Title</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Attachments</div>
                  </div>

                  {filteredNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleNoticeClick(notice.id)}>
                      <div className="col-span-6">
                        <span className="text-gray-900 hover:text-blue-600 font-medium">
                          {notice.title}
                        </span>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {notice.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Badge
                          variant="secondary"
                          className={getTypeColor(notice.type)}>
                          {getTypeDisplayName(notice.type)}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 text-sm">
                            {new Date(notice.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 text-sm">
                          {notice.attachments.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {notice.attachments.length} file
                              {notice.attachments.length !== 1 ? "s" : ""}
                            </div>
                          ) : (
                            "No attachments"
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
