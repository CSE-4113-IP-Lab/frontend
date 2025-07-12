import React, { useState, useEffect, useMemo } from "react";
import {
  programService,
  type ProgramResponse,
} from "../../services/programService";
import type { CourseResponse } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

interface CourseFilters {
  program_id: string;
  semester: string;
  year: string;
  batch: string;
  search: string;
  enrolled_only: boolean;
}

const CourseList: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CourseFilters>({
    program_id: "",
    semester: "",
    year: "",
    batch: "",
    search: "",
    enrolled_only: false,
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use mock data for now to avoid API issues
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCourses: CourseResponse[] = [
          {
            id: 1,
            name: "Introduction to Computer Science",
            course_code: "CSE 101",
            program_id: 1,
            credits: 3,
            description: "Basic concepts of computer science and programming",
            semester: 1,
            year: 1,
            batch: "2023"
          },
          {
            id: 2,
            name: "Data Structures and Algorithms",
            course_code: "CSE 201",
            program_id: 1,
            credits: 3,
            description: "Fundamental data structures and algorithms",
            semester: 1,
            year: 2,
            batch: "2023"
          },
          {
            id: 3,
            name: "Database Systems",
            course_code: "CSE 301",
            program_id: 1,
            credits: 3,
            description: "Database design and management systems",
            semester: 1,
            year: 3,
            batch: "2023"
          }
        ];

        const mockPrograms: ProgramResponse[] = [
          {
            id: 1,
            type: "BSc",
            name: "Computer Science and Engineering",
            duration: 4,
            description: "Bachelor of Science in Computer Science and Engineering",
            is_active: 1
          }
        ];

        setCourses(mockCourses);
        setPrograms(mockPrograms);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Error loading course data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter courses by search term locally
  const filteredCourses = useMemo(() => {
    let result = courses;

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm) ||
          course.course_code?.toLowerCase().includes(searchTerm) ||
          course.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply role-based filtering
    if (user?.role === "student" && user?.courses) {
      result = result.map((course) => ({
        ...course,
        isEnrolled: user.courses?.includes(course.course_code || ""),
      }));

      if (filters.enrolled_only) {
        result = result.filter(
          (course) =>
            "isEnrolled" in course &&
            (course as CourseResponse & { isEnrolled: boolean }).isEnrolled
        );
      }
    }

    return result;
  }, [courses, filters.search, filters.enrolled_only, user]);

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "enrolled_only" ? value === "true" : value,
    }));
  };

  const CourseCard: React.FC<{
    course: CourseResponse & { isEnrolled?: boolean };
  }> = ({ course }) => (
    <div
      className={`bg-white rounded-lg border p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group ${
        course.isEnrolled ? "border-green-300 bg-green-50" : "border-gray-200"
      }`}
      onClick={() => setSelectedCourse(course)}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {course.name}
            </h3>
            {course.isEnrolled && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Enrolled
              </span>
            )}
          </div>
          {course.course_code && (
            <span className="inline-block mt-1 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
              {course.course_code}
            </span>
          )}
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">
            {course.credits}
          </div>
          <div className="text-xs text-gray-500">credits</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {course.semester && (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Semester {course.semester}
          </span>
        )}

        {course.year && (
          <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
            </svg>
            Year {course.year}
          </span>
        )}

        {course.batch && (
          <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Batch {course.batch}
          </span>
        )}
      </div>

      {course.description && (
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Click to view details</span>
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );

  const CourseDetailModal: React.FC<{
    course: CourseResponse;
    onClose: () => void;
  }> = ({ course, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {course.name}
              </h2>
              {course.course_code && (
                <span className="inline-block mt-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono">
                  {course.course_code}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {course.credits}
              </div>
              <div className="text-sm text-gray-600">Credits</div>
            </div>

            {course.semester && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {course.semester}
                </div>
                <div className="text-sm text-gray-600">Semester</div>
              </div>
            )}

            {course.year && (
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {course.year}
                </div>
                <div className="text-sm text-gray-600">Year</div>
              </div>
            )}

            {course.batch && (
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">
                  {course.batch}
                </div>
                <div className="text-sm text-gray-600">Batch</div>
              </div>
            )}
          </div>

          {course.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Course Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">
            Error Loading Courses
          </div>
          <div className="text-red-500 text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          📚 Course Catalog
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          {isAuthenticated
            ? `Browse courses ${
                user?.role === "student"
                  ? "and track your enrollment"
                  : "and manage academic content"
              }`
            : "Browse courses with detailed descriptions and requirements"}
        </p>
        {user?.role === "student" && user?.courses && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            You are enrolled in {user.courses.length} courses
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          🔍 Filter Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, code, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {user?.role === "student" && (
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.enrolled_only}
                  onChange={(e) =>
                    handleFilterChange(
                      "enrolled_only",
                      e.target.checked.toString()
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Show only enrolled courses
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredCourses.length} courses
          </div>

          {Object.values(filters).some((value) => value !== "" && value !== false) && (
            <button
              onClick={() => setFilters({
                program_id: "",
                semester: "",
                year: "",
                batch: "",
                search: "",
                enrolled_only: false,
              })}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200 mb-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading courses...</div>
        </div>
      )}

      {/* Course Grid */}
      {!isLoading && (
        <div>
          {filteredCourses.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow border border-gray-200 text-center">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <div className="text-gray-600 text-xl font-medium mb-2">
                No courses found
              </div>
              <div className="text-gray-500 text-sm">
                Try adjusting your search or check back later
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

export default CourseList;
