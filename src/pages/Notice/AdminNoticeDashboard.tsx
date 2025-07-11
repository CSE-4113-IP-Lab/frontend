import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, FileText, Plus, Calendar, TrendingUp } from "lucide-react";
import { NoticeService } from "@/services/noticeService";

interface ArchiveStats {
  total_posts: number;
  active_posts: number;
  archived_posts: number;
  archive_days: number;
  archive_cutoff_date: string;
}

export default function AdminNoticeDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const archiveStats = await NoticeService.getArchiveStats();
      setStats(archiveStats);
    } catch (error) {
      console.error("Error loading archive stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage notices and view statistics
              </p>
            </div>
            <Button
              onClick={() => navigate("/notice/create")}
              className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Notice
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Notices
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.total_posts || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time notices
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Notices
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.active_posts || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently visible
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Archived Notices
                </CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.archived_posts || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Moved to archive
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Archive Period
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.archive_days || 30} days
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-archive threshold
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Archive Information */}
          {stats && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Archive Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                      Archive Policy
                    </h3>
                    <p className="text-blue-800 text-sm">
                      Notices older than {stats.archive_days} days are
                      automatically moved to the archive. Archives cutoff date:{" "}
                      {new Date(stats.archive_cutoff_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Archive Percentage
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-orange-600">
                          {stats.total_posts > 0
                            ? Math.round(
                                (stats.archived_posts / stats.total_posts) * 100
                              )
                            : 0}
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          of total notices
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Active Percentage
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-green-600">
                          {stats.total_posts > 0
                            ? Math.round(
                                (stats.active_posts / stats.total_posts) * 100
                              )
                            : 0}
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          of total notices
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/notices")}
                  className="flex items-center gap-2 h-auto p-4 flex-col">
                  <FileText className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">View Active Notices</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Manage current notices
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/notices/archived")}
                  className="flex items-center gap-2 h-auto p-4 flex-col">
                  <Archive className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">View Archive</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Browse archived notices
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate("/notice/create")}
                  className="flex items-center gap-2 h-auto p-4 flex-col">
                  <Plus className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Create New Notice</div>
                    <div className="text-sm text-white/80 mt-1">
                      Add a new notice
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
