import React from "react";
import { Link } from "react-router-dom";
import { Calendar, FileText, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NoticeCardProps {
  notice: {
    id: number;
    title: string;
    category: string;
    date: string;
    urgent: boolean;
    attachment: boolean;
    content: string;
    author: string;
    views: number;
    isArchived: boolean;
  };
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      academic: "bg-blue-100 text-blue-800",
      research: "bg-green-100 text-green-800",
      event: "bg-purple-100 text-purple-800",
      facility: "bg-orange-100 text-orange-800",
      admin: "bg-gray-100 text-gray-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {notice.urgent && (
                    <Badge className="bg-red-500 text-white animate-pulse">
                      URGENT
                    </Badge>
                  )}
                  <Badge className={getCategoryColor(notice.category)}>
                    {notice.category.toUpperCase()}
                  </Badge>
                  {notice.attachment && (
                    <FileText
                      className="w-4 h-4 text-primary-yellow"
                      //   title="Has attachment"
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-2">
                  {notice.title}
                </h3>
                <div className="flex items-center space-x-4 text-text-secondary text-sm mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(notice.date).toLocaleDateString()}</span>
                  </div>
                  <span>By {notice.author}</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{notice.views} views</span>
                  </div>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {notice.content}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-6">
            <Link to={`/notices/${notice.id}`}>
              <Button size="sm" className="w-full">
                READ MORE
              </Button>
            </Link>
            {notice.attachment && (
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-1" />
                DOWNLOAD
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoticeCard;
