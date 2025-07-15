import React, { useState, useEffect } from "react";
import { examData } from "./examData";
import SearchBar from "./SearchBar";
import LevelFilter from "./LevelFilter";
import ExamFilterBar from "./ExamFilterBar";
import ExamTable from "./ExamTable";
import type {
  ExamScheduleItem,
  ExamScheduleResponse,
  ExamScheduleFilters,
} from "../../../types";
import { examScheduleService } from "../../../services/examScheduleService";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Button from "../../../components/Button";
import { Plus } from "lucide-react";

const ExamSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [examSchedules, setExamSchedules] = useState<ExamScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "personal">("all");
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<ExamScheduleFilters>({
    semester: undefined,
    year: undefined,
    batch: "",
    type: "",
    room: "",
    exam_date: "",
  });

  // Initialize user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    // Set default view mode based on role
    if (role === "student" || role === "faculty") {
      setViewMode("personal");
    }
  }, []);

  // Handle filter changes for advanced filters
  const handleFilterChange = (filterName: string, value: string) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [filterName]:
        value === ""
          ? undefined
          : filterName === "semester" || filterName === "year"
          ? parseInt(value)
          : value,
    }));
  };

  // Clear all advanced filters and reload original data
  const handleClearFilters = async () => {
    setAdvancedFilters({
      semester: undefined,
      year: undefined,
      batch: "",
      type: "",
      room: "",
      exam_date: "",
    });

    // Reload original data when filters are cleared
    try {
      const token = localStorage.getItem("token");
      let schedules: ExamScheduleItem[] = [];

      if (
        viewMode === "personal" &&
        token &&
        (userRole === "student" || userRole === "faculty")
      ) {
        const apiSchedules = await examScheduleService.getMyExamSchedule(token);
        schedules = convertApiToLegacyFormat(apiSchedules);
      } else if (userRole === "admin" && token) {
        const apiSchedules = await examScheduleService.getAllExamSchedules(
          token
        );
        schedules = convertApiToLegacyFormat(apiSchedules);
      } else {
        const apiSchedules = await examScheduleService.getPublicExamSchedules();
        schedules = convertApiToLegacyFormat(apiSchedules);
      }

      setExamSchedules(schedules);
      setUsingFallback(false);
    } catch (err) {
      console.warn("Failed to reload data after clearing filters:", err);
    }
  };

  // Load exam schedules from API with fallback to mock data
  useEffect(() => {
    const loadExamSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        let schedules: ExamScheduleItem[] = [];

        if (
          viewMode === "personal" &&
          token &&
          (userRole === "student" || userRole === "faculty")
        ) {
          // Load personal exam schedule for students/faculty
          const apiSchedules = await examScheduleService.getMyExamSchedule(
            token
          );
          schedules = convertApiToLegacyFormat(apiSchedules);
        } else if (userRole === "admin" && token) {
          // Load all exam schedules for admin
          const apiSchedules = await examScheduleService.getAllExamSchedules(
            token
          );
          schedules = convertApiToLegacyFormat(apiSchedules);
        } else {
          // Load public exam schedules for everyone else or fallback
          const apiSchedules =
            await examScheduleService.getPublicExamSchedules();
          schedules = convertApiToLegacyFormat(apiSchedules);
        }

        setExamSchedules(schedules);
        setUsingFallback(false);
      } catch (err) {
        console.warn(
          "Failed to load exam schedules from API, using fallback data:",
          err
        );
        setExamSchedules(examData);
        setUsingFallback(true);
        setError("Could not connect to server. Showing cached data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userRole !== null) {
      loadExamSchedules();
    }
  }, [userRole, viewMode]);

  // Handle filter changes separately to avoid flickering
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      // Check if any filters are actually applied
      const hasActiveFilters = Object.values(advancedFilters).some(
        (value) => value !== undefined && value !== ""
      );

      if (!hasActiveFilters) {
        return; // No filters applied, keep current data
      }

      try {
        // Use a subtle loading indicator for filter operations
        setIsFiltering(true);
        setError(null);
        const token = localStorage.getItem("token");

        let schedules: ExamScheduleItem[] = [];

        if (
          viewMode === "personal" &&
          token &&
          (userRole === "student" || userRole === "faculty")
        ) {
          // Apply filters to personal exam schedule
          const apiSchedules = await examScheduleService.getMyExamSchedule(
            token,
            advancedFilters
          );
          schedules = convertApiToLegacyFormat(apiSchedules);
        } else if (userRole === "admin" && token) {
          // Apply filters to all exam schedules for admin
          const apiSchedules = await examScheduleService.getAllExamSchedules(
            token,
            advancedFilters
          );
          schedules = convertApiToLegacyFormat(apiSchedules);
        } else {
          // Apply filters to public exam schedules
          const apiSchedules = await examScheduleService.getPublicExamSchedules(
            advancedFilters
          );
          schedules = convertApiToLegacyFormat(apiSchedules);
        }

        setExamSchedules(schedules);
        setUsingFallback(false);
      } catch (err) {
        console.warn("Failed to apply filters:", err);
        setError("Failed to apply filters. Please try again.");
      } finally {
        setIsFiltering(false);
      }
    }, 300); // 300ms debounce

    // Only apply filters if user role is set
    if (userRole === null) {
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [advancedFilters, userRole, viewMode]);

  // Helper function to convert API response to legacy format
  const convertApiToLegacyFormat = (
    apiSchedules: ExamScheduleResponse[]
  ): ExamScheduleItem[] => {
    return apiSchedules.map((schedule) => ({
      id: schedule.id,
      courseName: schedule.course?.name || "Unknown Course",
      examDate: schedule.exam_date,
      examTime: `${schedule.start_time} - ${schedule.end_time}`,
      roomNo: schedule.room || "TBA",
      level: schedule.course?.program_id === 1 ? "Undergraduate" : "Masters",
    }));
  };

  // Handle delete exam schedule (admin only)
  const handleDeleteExam = async (examId: number) => {
    if (
      !window.confirm("Are you sure you want to delete this exam schedule?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      await examScheduleService.deleteExamSchedule(token, examId);

      // Reload schedules after deletion
      const apiSchedules = await examScheduleService.getAllExamSchedules(token);
      const schedules = convertApiToLegacyFormat(apiSchedules);
      setExamSchedules(schedules);

      alert("Exam schedule deleted successfully");
    } catch (error) {
      console.error("Failed to delete exam schedule:", error);
      alert("Failed to delete exam schedule. Please try again.");
    }
  };

  // Filter exams by search term and selected level
  const filteredExams: ExamScheduleItem[] = examSchedules.filter((exam) => {
    const matchesSearch = exam.courseName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "All" || exam.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Generate PDF for filtered exam schedule
  const handleDownloadPDF = (exams: ExamScheduleItem[]) => {
    if (exams.length === 0) {
      alert("No exam data to export.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor("#1e3a8a"); // Tailwind blue-900
    doc.text("Exam Schedule", 14, 22);

    const tableColumn = ["Course Name", "Exam Date", "Exam Time", "Room No."];
    const tableRows = exams.map((exam) => [
      exam.courseName,
      new Date(exam.examDate).toLocaleDateString("en-US"),
      exam.examTime,
      exam.roomNo,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 11, cellPadding: 6, halign: "left" },
      headStyles: { fillColor: [30, 58, 138] }, // Tailwind blue-900
      margin: { left: 14, right: 14 },
      theme: "striped",
    });

    doc.save("exam_schedule.pdf");
  };

  return (
    <div className="max-w-full mx-auto px-2 sm:px-6 py-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-10 border-b-4 border-blue-900 pb-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 select-none">
          Exam Schedules
        </h1>

        {/* Admin Controls */}
        {userRole === "admin" && (
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/admin/exam-schedules/create")}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200">
              <Plus size={20} />
              Create Schedule
            </Button>
          </div>
        )}
      </div>

      {/* View Mode Toggle for Students/Faculty */}
      {(userRole === "student" || userRole === "faculty") && (
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("personal")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                viewMode === "personal"
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              My Exams
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                viewMode === "all"
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              All Exams
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <span className="ml-3 text-gray-600">Loading exam schedules...</span>
        </div>
      )}

      {/* Error/Fallback Notice */}
      {usingFallback && error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-400 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-yellow-800 text-sm">
              {error} The schedule below may not be current.
            </p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Advanced Filters */}
          <ExamFilterBar
            filters={{
              semester: advancedFilters.semester?.toString() || "",
              year: advancedFilters.year?.toString() || "",
              batch: advancedFilters.batch || "",
              type: advancedFilters.type || "",
              room: advancedFilters.room || "",
              exam_date: advancedFilters.exam_date || "",
            }}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            className="mb-6"
          />

          {/* Filtering Indicator */}
          {isFiltering && (
            <div className="mb-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                Applying filters...
              </span>
            </div>
          )}

          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
            <SearchBar
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              className="flex-grow md:max-w-md"
              inputClassName="shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-lg transition duration-200"
              placeholder="Search courses..."
            />

            <LevelFilter
              selectedLevel={selectedLevel}
              onChange={setSelectedLevel}
              className="mt-4 md:mt-0"
              buttonClassName="px-5 py-2 rounded-lg text-sm font-semibold transition duration-200"
              activeClassName="bg-blue-900 text-white shadow-lg hover:bg-blue-800"
              inactiveClassName="bg-gray-200 text-gray-700 hover:bg-gray-300"
              levels={["All", "Undergraduate", "Masters"]}
            />
          </div>

          <ExamTable
            exams={filteredExams}
            onDownload={handleDownloadPDF}
            userRole={userRole}
            onEdit={
              userRole === "admin"
                ? (examId: number) =>
                    navigate(`/admin/exam-schedules/edit/${examId}`)
                : undefined
            }
            onDelete={userRole === "admin" ? handleDeleteExam : undefined}
          />

          {/* Data Source Indicator */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {usingFallback ? (
              <p>⚠️ Showing cached data • Last updated: Demo data</p>
            ) : (
              <p>✅ Live data • Updated automatically</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamSchedule;
