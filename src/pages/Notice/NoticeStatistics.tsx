import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  Archive,
  Calendar,
  TrendingUp,
  Clock,
  Activity,
} from "lucide-react";
import { NoticeService } from "@/services/noticeService";
import type { Post } from "@/types";

interface ArchiveStats {
  total_posts: number;
  active_posts: number;
  archived_posts: number;
  archive_days: number;
  archive_cutoff_date: string;
}

interface PostStats {
  total: number;
  byType: Record<string, number>;
  byMonth: Record<string, number>;
  recent: Post[];
  withAttachments: number;
}

export default function NoticeStatistics() {
  const [archiveStats, setArchiveStats] = useState<ArchiveStats | null>(null);
  const [postStats, setPostStats] = useState<PostStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [archive, allPosts] = await Promise.all([
        NoticeService.getArchiveStats(),
        NoticeService.getNotices(true), // Include archived
      ]);

      setArchiveStats(archive);

      // Calculate post statistics
      const typeCount: Record<string, number> = {};
      const monthCount: Record<string, number> = {};
      let withAttachments = 0;

      allPosts.forEach((post) => {
        // Count by type
        typeCount[post.type] = (typeCount[post.type] || 0) + 1;

        // Count by month
        const month = new Date(post.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
        monthCount[month] = (monthCount[month] || 0) + 1;

        // Count posts with attachments
        if (post.attachments.length > 0) {
          withAttachments++;
        }
      });

      setPostStats({
        total: allPosts.length,
        byType: typeCount,
        byMonth: monthCount,
        recent: allPosts
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5),
        withAttachments,
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
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
    color,
  }: {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${color || "text-gray-900"}`}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Notice Statistics
          </h1>
          <p className="text-gray-600 mt-2">
            Analytics and insights for notice management
          </p>
        </div>

        {/* Overview Stats */}
        {archiveStats && postStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Posts"
              value={archiveStats.total_posts}
              icon={FileText}
              description="All notices created"
              color="text-blue-600"
            />
            <StatsCard
              title="Active Posts"
              value={archiveStats.active_posts}
              icon={Activity}
              description="Currently visible"
              color="text-green-600"
            />
            <StatsCard
              title="Archived Posts"
              value={archiveStats.archived_posts}
              icon={Archive}
              description="Automatically archived"
              color="text-orange-600"
            />
            <StatsCard
              title="With Attachments"
              value={postStats.withAttachments}
              icon={FileText}
              description="Posts with files"
              color="text-purple-600"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Posts by Type */}
          {postStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Posts by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(postStats.byType).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(type)}>{type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(count / postStats.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts by Month */}
          {postStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Posts by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(postStats.byMonth)
                    .sort(
                      ([a], [b]) =>
                        new Date(b).getTime() - new Date(a).getTime()
                    )
                    .slice(0, 6)
                    .map(([month, count]) => (
                      <div
                        key={month}
                        className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{month}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (count /
                                    Math.max(
                                      ...Object.values(postStats.byMonth)
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Posts */}
          {postStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {postStats.recent.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start gap-3 p-3 border rounded-lg">
                      <FileText className="w-5 h-5 text-gray-500 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getTypeColor(post.type)}>
                            {post.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                        <p className="font-medium text-sm truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Archive Information */}
          {archiveStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Archive Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {archiveStats.archive_days}
                    </p>
                    <p className="text-sm text-gray-600">
                      Days until archiving
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {(
                        (archiveStats.active_posts / archiveStats.total_posts) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                    <p className="text-sm text-gray-600">Posts are active</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Archive cutoff date:</span>{" "}
                    {formatDate(archiveStats.archive_cutoff_date)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posts older than this date are automatically archived
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
