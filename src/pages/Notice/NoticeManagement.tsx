import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Archive,
  FileText,
  Calendar,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react";
import { NoticeService } from "@/services/noticeService";
import type { Post, UserRole } from "@/types";

interface ArchiveStats {
  total_posts: number;
  active_posts: number;
  archived_posts: number;
  archive_days: number;
  archive_cutoff_date: string;
}

export default function NoticeManagement() {
  const navigate = useNavigate();
  const [activeNotices, setActiveNotices] = useState<Post[]>([]);
  const [archivedNotices, setArchivedNotices] = useState<Post[]>([]);
  const [allNotices, setAllNotices] = useState<Post[]>([]);
  const [archiveStats, setArchiveStats] = useState<ArchiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role") as UserRole;
    setUserRole(role);

    if (role !== "admin") {
      navigate("/notice");
      return;
    }

    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [active, archived, all, stats] = await Promise.all([
        NoticeService.getActiveNotices(),
        NoticeService.getArchivedNotices(),
        NoticeService.getNotices(true), // Include archived
        NoticeService.getArchiveStats(),
      ]);

      setActiveNotices(active);
      setArchivedNotices(archived);
      setAllNotices(all);
      setArchiveStats(stats);
    } catch (error) {
      console.error("Error loading notice data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notice? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setDeleting(id);
    try {
      await NoticeService.deleteNotice(id);
      await loadAllData(); // Reload all data
    } catch (error) {
      console.error("Error deleting notice:", error);
    } finally {
      setDeleting(null);
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

  const StatsCard = ({
    title,
    value,
    icon: Icon,
    description,
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );

  const NoticeCard = ({
    notice,
    showArchived = false,
  }: {
    notice: Post;
    showArchived?: boolean;
  }) => (
    <Card key={notice.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(notice.type)}>{notice.type}</Badge>
              <span className="text-sm text-gray-500">
                {formatDate(notice.date)}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{notice.title}</h3>
            <p className="text-gray-600 mb-3 line-clamp-2">{notice.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created {formatDate(notice.created_at)}
              </div>
              {notice.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {notice.attachments.length} file(s)
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(
                  showArchived
                    ? `/notice/archived/${notice.id}`
                    : `/notice/${notice.id}`
                )
              }>
              <Eye className="w-4 h-4" />
            </Button>
            {!showArchived && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/notice/${notice.id}/edit`)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              disabled={deleting === notice.id}
              onClick={() => handleDelete(notice.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          <p className="mt-4 text-gray-600">
            Loading notice management dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Notice Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all notices, announcements, and events
            </p>
          </div>
          <Button onClick={() => navigate("/notice/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Notice
          </Button>
        </div>

        {/* Stats Cards */}
        {archiveStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Posts"
              value={archiveStats.total_posts}
              icon={FileText}
              description="All notices created"
            />
            <StatsCard
              title="Active Posts"
              value={archiveStats.active_posts}
              icon={Users}
              description="Currently visible"
            />
            <StatsCard
              title="Archived Posts"
              value={archiveStats.archived_posts}
              icon={Archive}
              description="Automatically archived"
            />
            <StatsCard
              title="Archive Days"
              value={archiveStats.archive_days}
              icon={Clock}
              description="Days before archiving"
            />
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active Notices ({activeNotices.length})
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived Notices ({archivedNotices.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Notices ({allNotices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Notices</h2>
              <p className="text-sm text-gray-500">
                These notices are currently visible to users
              </p>
            </div>
            {activeNotices.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No active notices
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create your first notice to get started.
                  </p>
                  <Button onClick={() => navigate("/notice/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Notice
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeNotices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Archived Notices</h2>
              <p className="text-sm text-gray-500">
                These notices have been automatically archived
              </p>
            </div>
            {archivedNotices.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No archived notices
                  </h3>
                  <p className="text-gray-500">
                    Notices will be archived automatically after{" "}
                    {archiveStats?.archive_days || 30} days.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {archivedNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    showArchived={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Notices</h2>
              <p className="text-sm text-gray-500">
                Complete list of all notices (active and archived)
              </p>
            </div>
            {allNotices.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notices found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create your first notice to get started.
                  </p>
                  <Button onClick={() => navigate("/notice/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Notice
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {allNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    showArchived={archivedNotices.some(
                      (archived) => archived.id === notice.id
                    )}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
