import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Plus,
  Settings,
  BarChart3,
  Clock,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { Link } from "react-router-dom";

interface AdminStats {
  totalCourses: number;
  totalPrograms: number;
  totalClassSchedules: number;
  totalExamSchedules: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalCourses: 0,
    totalPrograms: 0,
    totalClassSchedules: 0,
    totalExamSchedules: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const adminStats = await adminService.getAdminStats();
        setStats(adminStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics");
        console.error("Error loading admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const quickActions = [
    {
      title: "Add New Course",
      description: "Create a new course in the system",
      icon: BookOpen,
      color: "bg-blue-500",
      href: "/admin/courses"
    },
    {
      title: "Schedule Class",
      description: "Add a new class schedule",
      icon: Calendar,
      color: "bg-green-500",
      href: "/admin/schedules"
    },
    {
      title: "Create Program",
      description: "Add a new degree program",
      icon: GraduationCap,
      color: "bg-purple-500",
      href: "/admin/programs"
    },
    {
      title: "Exam Schedule",
      description: "Manage exam schedules",
      icon: FileText,
      color: "bg-orange-500",
      href: "/admin/exam-schedules"
    }
  ];

  const managementSections = [
    {
      title: "Course Management",
      description: "Manage courses, credits, and prerequisites",
      icon: BookOpen,
      count: stats.totalCourses,
      href: "/admin/courses",
      color: "border-blue-200 bg-blue-50"
    },
    {
      title: "Class Schedules",
      description: "Manage weekly class timetables",
      icon: Calendar,
      count: stats.totalClassSchedules,
      href: "/admin/schedules",
      color: "border-green-200 bg-green-50"
    },
    {
      title: "Program Management",
      description: "Manage degree programs and structures",
      icon: GraduationCap,
      count: stats.totalPrograms,
      href: "/admin/programs",
      color: "border-purple-200 bg-purple-50"
    },
    {
      title: "Exam Schedules",
      description: "Manage examination timetables",
      icon: FileText,
      count: stats.totalExamSchedules,
      href: "/admin/exam-schedules",
      color: "border-orange-200 bg-orange-50"
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error Loading Dashboard</div>
            <div className="text-red-500 text-sm">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage academic programs, courses, and schedules</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? "..." : stats.totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Class Schedules</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? "..." : stats.totalClassSchedules}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Programs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? "..." : stats.totalPrograms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Exam Schedules</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? "..." : stats.totalExamSchedules}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 ${action.color} rounded-lg mr-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Management Sections */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Link
                  key={index}
                  to={section.href}
                  className={`group ${section.color} rounded-lg border-2 p-6 hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <Icon className="w-6 h-6 text-gray-700 mr-3" />
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {section.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        {isLoading ? "Loading..." : `${section.count} items`}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-lg font-bold text-gray-700">{isLoading ? "..." : section.count}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Activity Log Coming Soon</h3>
              <p className="text-gray-500">Track recent changes and updates to your academic data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
