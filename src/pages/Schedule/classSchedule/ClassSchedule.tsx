import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Filter,
  Download,
  Users,
  Plus,
  Pencil,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  scheduleService,
  type ScheduleFilters,
  type ProgramResponse,
} from "../../../services/scheduleService";
import type { ClassScheduleResponse } from "../../../types";
import Card from "../../../components/Card";
import Button from "../../../components/Button";

const timeSlots = [
  "08:00-09:30",
  "09:45-11:15",
  "11:30-13:00",
  "14:00-15:30",
  "15:45-17:15",
];

const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday"];

const ClassSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "personal">("all");

  const [filters, setFilters] = useState<ScheduleFilters>({
    batch: "",
    semester: undefined,
    year: undefined,
    room: "",
    day_of_week: "",
    program_id: undefined,
  });

  const [schedules, setSchedules] = useState<ClassScheduleResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"table" | "grid">("table");

  // Initialize user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    // Set default view mode based on role
    if (role === "student" || role === "faculty") {
      setViewMode("personal");
    }
  }, []);

  // Initialize user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    // Set default view mode based on role
    if (role === "student" || role === "faculty") {
      setViewMode("personal");
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        // Load programs data
        try {
          const programsData = await scheduleService.getPublicPrograms();
          setPrograms(programsData);
        } catch (programError) {
          console.warn("Failed to load programs:", programError);
          // Use fallback program data
          const mockPrograms: ProgramResponse[] = [
            {
              id: 1,
              type: "BSc",
              name: "Computer Science and Engineering",
              duration: 4,
              description:
                "Bachelor of Science in Computer Science and Engineering",
              is_active: 1,
            },
            {
              id: 2,
              type: "MSc",
              name: "Computer Science and Engineering",
              duration: 2,
              description:
                "Master of Science in Computer Science and Engineering",
              is_active: 1,
            },
          ];
          setPrograms(mockPrograms);
        }

        // Load schedules based on role and view mode
        try {
          let schedulesData: ClassScheduleResponse[] = [];

          if (
            viewMode === "personal" &&
            token &&
            (userRole === "student" || userRole === "faculty")
          ) {
            // Load personal schedule for students/faculty
            schedulesData = await scheduleService.getMySchedule(token);
          } else if (userRole === "admin" && token) {
            // Load all schedules for admin
            schedulesData = await scheduleService.getAllSchedules(token);
          } else {
            // Load public schedules for everyone else or fallback
            schedulesData = await scheduleService.getPublicSchedules();
          }

          setSchedules(schedulesData);
        } catch (apiError) {
          console.warn("API failed, using fallback data:", apiError);

          // Fallback to mock data if API fails
          const mockSchedules: ClassScheduleResponse[] = [
            {
              id: 1,
              course_id: 1,
              day_of_week: "sunday",
              start_time: "08:00",
              end_time: "09:30",
              room: "Room 301",
              batch: "20",
              semester: 3,
              year: 2,
              is_active: 1,
              course: {
                id: 1,
                name: "Data Structures",
                course_code: "CSE-2101",
                program_id: 1,
                credits: 3,
                description: "Fundamental data structures and algorithms",
                semester: 3,
                year: 2,
                batch: "20",
              },
            },
            {
              id: 2,
              course_id: 2,
              day_of_week: "sunday",
              start_time: "09:45",
              end_time: "11:15",
              room: "Lab 1",
              batch: "20",
              semester: 3,
              year: 2,
              is_active: 1,
              course: {
                id: 2,
                name: "Data Structures Lab",
                course_code: "CSE-2102",
                program_id: 1,
                credits: 1,
                description: "Laboratory work for data structures",
                semester: 3,
                year: 2,
                batch: "20",
              },
            },
            {
              id: 3,
              course_id: 3,
              day_of_week: "monday",
              start_time: "08:00",
              end_time: "09:30",
              room: "Room 302",
              batch: "20",
              semester: 3,
              year: 2,
              is_active: 1,
              course: {
                id: 3,
                name: "Algorithms",
                course_code: "CSE-2201",
                program_id: 1,
                credits: 3,
                description: "Algorithm design and analysis",
                semester: 3,
                year: 2,
                batch: "20",
              },
            },
            {
              id: 4,
              course_id: 4,
              day_of_week: "monday",
              start_time: "09:45",
              end_time: "11:15",
              room: "Lab 2",
              batch: "19",
              semester: 5,
              year: 3,
              is_active: 1,
              course: {
                id: 4,
                name: "Software Engineering",
                course_code: "CSE-3101",
                program_id: 1,
                credits: 3,
                description: "Software development methodologies",
                semester: 5,
                year: 3,
                batch: "19",
              },
            },
          ];

          const mockPrograms: ProgramResponse[] = [
            {
              id: 1,
              type: "BSc",
              name: "Computer Science and Engineering",
              duration: 4,
              description:
                "Bachelor of Science in Computer Science and Engineering",
              is_active: 1,
            },
            {
              id: 2,
              type: "MSc",
              name: "Computer Science and Engineering",
              duration: 2,
              description:
                "Master of Science in Computer Science and Engineering",
              is_active: 1,
            },
          ];

          setSchedules(mockSchedules);
          setPrograms(mockPrograms);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load schedules"
        );
        setError(
          err instanceof Error ? err.message : "Failed to load schedules"
        );
        console.error("Error loading schedule data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userRole, viewMode]);

  // Reload schedules when filters change
  useEffect(() => {
    const applyFilters = async () => {
      if (Object.values(filters).every((val) => !val)) {
        return; // No filters applied, keep current data
      }

      try {
        setIsLoading(true);
        setError(null);

        // Clean filters - remove empty values
        const cleanFilters = Object.entries(filters).reduce(
          (acc, [key, value]) => {
            if (value !== "" && value !== undefined && value !== null) {
              acc[key as keyof ScheduleFilters] = value;
            }
            return acc;
          },
          {} as ScheduleFilters
        );

        const token = localStorage.getItem("token");

        // Apply filters based on role and view mode
        try {
          let filteredSchedules: ClassScheduleResponse[] = [];

          if (
            viewMode === "personal" &&
            token &&
            (userRole === "student" || userRole === "faculty")
          ) {
            // Filter personal schedule
            const personalFilters = {
              day_of_week: cleanFilters.day_of_week,
              semester: cleanFilters.semester,
              year: cleanFilters.year,
            };
            filteredSchedules = await scheduleService.getMySchedule(
              token,
              personalFilters
            );
          } else if (userRole === "admin" && token) {
            // Filter all schedules for admin
            filteredSchedules = await scheduleService.getAllSchedules(
              token,
              cleanFilters
            );
          } else {
            // Filter public schedules
            filteredSchedules = await scheduleService.getPublicSchedules(
              cleanFilters
            );
          }

          setSchedules(filteredSchedules);
        } catch (apiError) {
          console.warn("Filter API failed, filtering locally:", apiError);
          // Filter locally as fallback
          // Note: This would be the full dataset loaded initially
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to filter schedules"
        );
        console.error("Error filtering schedules:", err);
      } finally {
        setIsLoading(false);
      }
    };

    applyFilters();
  }, [filters, userRole, viewMode]);

  // Get unique filter options from current schedules
  const filterOptions = useMemo(
    () => ({
      batches: [
        ...new Set(schedules.map((item) => item.batch).filter(Boolean)),
      ],
      semesters: [
        ...new Set(schedules.map((item) => item.semester).filter(Boolean)),
      ],
      years: [...new Set(schedules.map((item) => item.year).filter(Boolean))],
      rooms: [...new Set(schedules.map((item) => item.room).filter(Boolean))],
      programs: programs,
    }),
    [schedules, programs]
  );

  const handleFilterChange = (key: keyof ScheduleFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        value === ""
          ? undefined
          : key === "program_id" || key === "semester" || key === "year"
          ? parseInt(value)
          : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      batch: "",
      semester: undefined,
      year: undefined,
      room: "",
      day_of_week: "",
      program_id: undefined,
    });
  };

  const exportToPDF = () => {
    alert("Export to PDF functionality would be implemented here");
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    const token = localStorage.getItem("token");
    if (!token || userRole !== "admin") {
      alert("You don't have permission to delete schedules");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this schedule?")) {
      return;
    }

    try {
      await scheduleService.deleteSchedule(token, scheduleId);
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      alert("Failed to delete schedule. Please try again.");
    }
  };

  const renderScheduleGrid = () => {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">
                  Time
                </th>
                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className="border border-gray-200 p-3 text-left font-medium text-gray-700"
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium text-gray-700 bg-gray-50">
                    {timeSlot}
                  </td>
                  {daysOfWeek.map((day) => {
                    const schedule = schedules.find(
                      (s) =>
                        s.day_of_week === day &&
                        `${s.start_time}-${s.end_time}` === timeSlot
                    );

                    return (
                      <td
                        key={`${day}-${timeSlot}`}
                        className="border border-gray-200 p-2"
                      >
                        {schedule?.course ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors relative">
                            <div className="font-semibold text-blue-900 text-sm">
                              {schedule.course.course_code}
                            </div>
                            <div className="text-blue-700 text-xs mb-1">
                              {schedule.course.name}
                            </div>
                            {schedule.room && (
                              <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                                <MapPin className="w-3 h-3" />
                                <span>{schedule.room}</span>
                              </div>
                            )}
                            <div className="text-green-600 text-xs font-medium">
                              {schedule.batch ? `Batch ${schedule.batch}` : ""}
                              {schedule.semester
                                ? ` • ${schedule.semester} Semester`
                                : ""}
                            </div>

                            {/* Admin Actions */}
                            {userRole === "admin" && (
                              <div className="absolute top-1 right-1 flex gap-1">
                                <button
                                  onClick={() =>
                                    navigate(`/schedule/edit/${schedule.id}`)
                                  }
                                  className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                                  title="Edit Schedule"
                                >
                                  <Pencil className="w-3 h-3 text-blue-600" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSchedule(schedule.id)
                                  }
                                  className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                                  title="Delete Schedule"
                                >
                                  <Trash className="w-3 h-3 text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-20"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderScheduleList = () => {
    return (
      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {schedule.course?.course_code ||
                      `Course ${schedule.course_id}`}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {schedule.course?.name || "Course Name"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {schedule.day_of_week.charAt(0).toUpperCase() +
                        schedule.day_of_week.slice(1)}
                    </span>
                    <span>
                      {schedule.day_of_week.charAt(0).toUpperCase() +
                        schedule.day_of_week.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {schedule.start_time} - {schedule.end_time}
                    </span>
                  </div>
                  {schedule.room && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule.room}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {schedule.batch ? `Batch ${schedule.batch}` : ""}
                      {schedule.semester ? ` • ${schedule.semester} Sem` : ""}
                    </span>
                  </div>
                </div>

                {schedule.course?.description && (
                  <div className="mt-2 text-sm text-gray-600">
                    {schedule.course.description}
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              {userRole === "admin" && (
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/schedule/edit/${schedule.id}`)}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    <Trash className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {schedules.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No classes found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">
              Error Loading Schedule
            </div>
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
    <div className="w-full max-w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase text-primary-dark mb-2 sm:mb-4">
          CLASS SCHEDULE
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
          View and manage weekly class schedules.{" "}
          {userRole === "admin"
            ? "Create new schedules, assign rooms, and manage timetables."
            : userRole === "faculty"
            ? "View your teaching schedule and classroom assignments."
            : "Check your class times, room locations, and course schedule."}
        </p>
      </div>

      {/* Admin Tools */}
      {userRole === "admin" && (
        <Card cornerStyle="tl" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary-dark mb-2">
                ADMIN TOOLS
              </h2>
              <p className="text-text-secondary">
                Create new schedules, manage existing ones, and assign rooms.
              </p>
            </div>
            <Button
              cornerStyle="br"
              className="bg-[#14244c] text-white hover:bg-[#1a2b5c] transition-colors"
              onClick={() => navigate("/schedule/create")}
            >
              <Plus className="inline w-4 h-4 mr-2" />
              CREATE SCHEDULE
            </Button>
          </div>
        </Card>
      )}

      {/* View Mode Toggle for Students/Faculty */}
      {(userRole === "student" || userRole === "faculty") && (
        <Card cornerStyle="tl" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary-dark mb-2">
                SCHEDULE VIEW
              </h2>
              <p className="text-text-secondary">
                Choose between viewing your personal schedule or all public
                schedules.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "personal" ? "primary" : "outline"}
                cornerStyle="bl"
                onClick={() => setViewMode("personal")}
              >
                My Schedule
              </Button>
              <Button
                variant={viewMode === "all" ? "primary" : "outline"}
                cornerStyle="br"
                onClick={() => setViewMode("all")}
              >
                All Schedules
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card cornerStyle="tl" className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary-yellow" />
          <h2 className="text-lg font-semibold text-primary-dark">FILTERS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-4">
          <select
            value={filters.program_id || ""}
            onChange={(e) => handleFilterChange("program_id", e.target.value)}
            className="border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          >
            <option value="">All Programs</option>
            {filterOptions.programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>

          <select
            value={filters.batch || ""}
            onChange={(e) => handleFilterChange("batch", e.target.value)}
            className="border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          >
            <option value="">All Batches</option>
            {filterOptions.batches.map((batch) => (
              <option key={batch} value={batch}>
                Batch {batch}
              </option>
            ))}
          </select>

          <select
            value={filters.semester || ""}
            onChange={(e) => handleFilterChange("semester", e.target.value)}
            className="border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          >
            <option value="">All Semesters</option>
            {filterOptions.semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester} Semester
              </option>
            ))}
          </select>

          <select
            value={filters.year || ""}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          >
            <option value="">All Years</option>
            {filterOptions.years.map((year) => (
              <option key={year} value={year}>
                {year} Year
              </option>
            ))}
          </select>

          <select
            value={filters.day_of_week || ""}
            onChange={(e) => handleFilterChange("day_of_week", e.target.value)}
            className="border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          >
            <option value="">All Days</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.room || ""}
            onChange={(e) => handleFilterChange("room", e.target.value)}
            className="border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          >
            <option value="">All Rooms</option>
            {filterOptions.rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={clearFilters} size="sm">
            Clear All Filters
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">View:</span>
              <Button
                size="sm"
                variant={selectedView === "table" ? "primary" : "outline"}
                onClick={() => setSelectedView("table")}
              >
                Grid
              </Button>
              <Button
                size="sm"
                variant={selectedView === "grid" ? "primary" : "outline"}
                onClick={() => setSelectedView("grid")}
              >
                List
              </Button>
            </div>

            <Button
              onClick={exportToPDF}
              cornerStyle="br"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Classes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {schedules.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Batches
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(schedules.map((s) => s.batch).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rooms Used</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(schedules.map((s) => s.room).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Time Slots</p>
              <p className="text-2xl font-semibold text-gray-900">
                {timeSlots.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card cornerStyle="tl" className="mb-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-yellow"></div>
            <div className="ml-4 text-text-secondary">Loading schedules...</div>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card cornerStyle="tl" className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">
              Error Loading Schedules
            </div>
            <div className="text-red-500 text-sm">{error}</div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Schedule Content */}
      {!isLoading && !error && (
        <Card cornerStyle="tl" className="mb-8">
          <div className="p-6">
            {schedules.length > 0 ? (
              selectedView === "table" ? (
                renderScheduleGrid()
              ) : (
                renderScheduleList()
              )
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary text-lg mb-4">
                  No schedules found matching your criteria.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ClassSchedule;
