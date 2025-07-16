import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import {
  programService,
  type ProgramResponse,
  type ProgramOutlineResponse,
} from "../../services/programService";
import type { CourseResponse } from "../../types";

const ProgramOutlines: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [selectedProgram, setSelectedProgram] =
    useState<ProgramResponse | null>(null);
  const [outline, setOutline] = useState<ProgramOutlineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOutline, setIsLoadingOutline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
    null
  );

  // Load programs on component mount
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);

    const loadPrograms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Starting to load programs...");

        // Try to fetch from backend API first
        try {
          console.log("Attempting to load programs from API...");
          const data = await programService.getPublicPrograms();

          if (data && data.length > 0) {
            console.log("API programs loaded successfully:", data.length, data);
            setPrograms(data);
            setUsingFallbackData(false);
          } else {
            throw new Error("No programs returned from API");
          }
        } catch (apiError) {
          console.warn("API failed, using fallback data:", apiError);

          // Always use fallback data when API fails
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
            {
              id: 3,
              type: "PhD",
              name: "Computer Science and Engineering",
              duration: 4,
              description:
                "Doctor of Philosophy in Computer Science and Engineering",
              is_active: 1,
            },
          ];

          setPrograms(mockPrograms);
          setUsingFallbackData(true);
          setError(null); // Clear any error since we have fallback data
          console.log(
            "Using mock programs as fallback:",
            mockPrograms.length,
            mockPrograms
          );
          console.log(
            "Current programs state after setting fallback:",
            mockPrograms
          );
        }
      } catch (err) {
        console.error("Critical error loading programs:", err);

        // Even on critical error, try to show fallback data
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
          {
            id: 3,
            type: "PhD",
            name: "Computer Science and Engineering",
            duration: 4,
            description:
              "Doctor of Philosophy in Computer Science and Engineering",
            is_active: 1,
          },
        ];

        setPrograms(mockPrograms);
        setUsingFallbackData(true);
        setError(null); // Clear error to show the fallback data
        console.log("Using mock programs after critical error");
      } finally {
        console.log("Finished loading programs, setting isLoading to false");
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, []);

  // Load program outline when program is selected
  const handleProgramSelect = async (program: ProgramResponse) => {
    try {
      setIsLoadingOutline(true);
      setSelectedProgram(program);
      setError(null);

      // Try to fetch from backend API first
      try {
        console.log(
          "Attempting to load program outline from API for program:",
          program.id
        );
        const data = await programService.getProgramOutline(program.id);
        console.log("API outline loaded successfully:", data);
        setOutline(data);
      } catch (apiError) {
        console.warn(
          "API failed for program outline, using fallback data:",
          apiError
        );

        // Fallback to mock data if API fails
        const mockOutline: ProgramOutlineResponse = {
          program: program,
          outline: {
            "1": {
              "1": [
                {
                  id: 1,
                  name: "Introduction to Computer Science",
                  course_code: "CSE 101",
                  program_id: program.id,
                  credits: 3,
                  description:
                    "Basic concepts of computer science and programming fundamentals",
                  semester: 1,
                  year: 1,
                  batch: "2023",
                },
                {
                  id: 2,
                  name: "Mathematics I (Calculus)",
                  course_code: "MATH 101",
                  program_id: program.id,
                  credits: 3,
                  description:
                    "Differential and integral calculus with applications",
                  semester: 1,
                  year: 1,
                  batch: "2023",
                },
                {
                  id: 3,
                  name: "Physics I",
                  course_code: "PHY 101",
                  program_id: program.id,
                  credits: 3,
                  description: "Classical mechanics and thermodynamics",
                  semester: 1,
                  year: 1,
                  batch: "2023",
                },
                {
                  id: 4,
                  name: "English Composition",
                  course_code: "ENG 101",
                  program_id: program.id,
                  credits: 3,
                  description: "Academic writing and communication skills",
                  semester: 1,
                  year: 1,
                  batch: "2023",
                },
              ],
              "2": [
                {
                  id: 5,
                  name: "Data Structures",
                  course_code: "CSE 201",
                  program_id: program.id,
                  credits: 3,
                  description:
                    "Arrays, linked lists, stacks, queues, trees, and graphs",
                  semester: 2,
                  year: 1,
                  batch: "2023",
                },
                {
                  id: 6,
                  name: "Mathematics II (Linear Algebra)",
                  course_code: "MATH 201",
                  program_id: program.id,
                  credits: 3,
                  description:
                    "Vector spaces, matrices, and linear transformations",
                  semester: 2,
                  year: 1,
                  batch: "2023",
                },
                {
                  id: 7,
                  name: "Digital Logic Design",
                  course_code: "CSE 202",
                  program_id: program.id,
                  credits: 3,
                  description: "Boolean algebra and digital circuit design",
                  semester: 2,
                  year: 1,
                  batch: "2023",
                },
              ],
            },
            "2": {
              "1": [
                {
                  id: 8,
                  name: "Algorithm Analysis",
                  course_code: "CSE 301",
                  program_id: program.id,
                  credits: 3,
                  description:
                    "Algorithm design techniques and complexity analysis",
                  semester: 1,
                  year: 2,
                  batch: "2023",
                },
                {
                  id: 9,
                  name: "Database Systems",
                  course_code: "CSE 302",
                  program_id: program.id,
                  credits: 3,
                  description: "Relational databases, SQL, and database design",
                  semester: 1,
                  year: 2,
                  batch: "2023",
                },
                {
                  id: 10,
                  name: "Computer Architecture",
                  course_code: "CSE 303",
                  program_id: program.id,
                  credits: 3,
                  description: "Processor design and computer organization",
                  semester: 1,
                  year: 2,
                  batch: "2023",
                },
              ],
              "2": [
                {
                  id: 11,
                  name: "Software Engineering",
                  course_code: "CSE 401",
                  program_id: program.id,
                  credits: 3,
                  description:
                    "Software development methodologies and project management",
                  semester: 2,
                  year: 2,
                  batch: "2023",
                },
                {
                  id: 12,
                  name: "Operating Systems",
                  course_code: "CSE 402",
                  program_id: program.id,
                  credits: 3,
                  description: "Process management, memory, and file systems",
                  semester: 2,
                  year: 2,
                  batch: "2023",
                },
              ],
            },
            ...(program.duration > 2 && {
              "3": {
                "1": [
                  {
                    id: 13,
                    name: "Computer Networks",
                    course_code: "CSE 501",
                    program_id: program.id,
                    credits: 3,
                    description: "Network protocols and distributed systems",
                    semester: 1,
                    year: 3,
                    batch: "2023",
                  },
                  {
                    id: 14,
                    name: "Machine Learning",
                    course_code: "CSE 502",
                    program_id: program.id,
                    credits: 3,
                    description:
                      "Supervised and unsupervised learning algorithms",
                    semester: 1,
                    year: 3,
                    batch: "2023",
                  },
                ],
                "2": [
                  {
                    id: 15,
                    name: "Artificial Intelligence",
                    course_code: "CSE 601",
                    program_id: program.id,
                    credits: 3,
                    description: "AI principles and intelligent systems",
                    semester: 2,
                    year: 3,
                    batch: "2023",
                  },
                ],
              },
            }),
            ...(program.duration > 3 && {
              "4": {
                "1": [
                  {
                    id: 16,
                    name: "Final Project I",
                    course_code: "CSE 701",
                    program_id: program.id,
                    credits: 3,
                    description: "Independent research project",
                    semester: 1,
                    year: 4,
                    batch: "2023",
                  },
                ],
                "2": [
                  {
                    id: 17,
                    name: "Final Project II",
                    course_code: "CSE 702",
                    program_id: program.id,
                    credits: 3,
                    description: "Continuation of research project",
                    semester: 2,
                    year: 4,
                    batch: "2023",
                  },
                ],
              },
            }),
          },
        };

        setOutline(mockOutline);
        console.log(
          "Using mock outline as fallback for program:",
          program.name
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load program outline"
      );
      console.error("Error loading program outline:", err);
    } finally {
      setIsLoadingOutline(false);
    }
  };

  const handleDeleteProgram = async (programId: number) => {
    try {
      await programService.deleteProgram(programId);
      setPrograms(programs.filter((p) => p.id !== programId));
      if (selectedProgram?.id === programId) {
        setSelectedProgram(null);
        setOutline(null);
      }
    } catch (error) {
      console.error("Failed to delete program:", error);
      alert("Failed to delete program. Please try again.");
    }
  };

  const renderCourseCard = (course: CourseResponse) => (
    <div
      key={course.id}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedCourse(course)}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800">{course.name}</h4>
        {course.course_code && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
            {course.course_code}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {course.credits} credits
        </span>

        {course.batch && (
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {course.description}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Click to view details</span>
        <svg
          className="w-4 h-4 text-gray-400 transition-colors"
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

  const renderSemester = (semesterNum: string, courses: CourseResponse[]) => {
    if (courses.length === 0) return null;

    return (
      <div key={semesterNum} className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {semesterNum}
          </div>
          Semester {semesterNum}
          <span className="text-sm text-gray-500 font-normal">
            ({courses.length} courses)
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(renderCourseCard)}
        </div>
      </div>
    );
  };

  const renderYear = (
    yearNum: string,
    semesters: Record<string, CourseResponse[]>
  ) => {
    const semesterKeys = Object.keys(semesters).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    if (semesterKeys.length === 0) return null;

    const totalCourses = semesterKeys.reduce(
      (sum, sem) => sum + semesters[sem].length,
      0
    );

    return (
      <div key={yearNum} className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex items-center justify-center text-lg font-bold">
            {yearNum}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Year {yearNum}</h3>
            <p className="text-sm text-gray-600">
              {totalCourses} total courses
            </p>
          </div>
        </div>

        <div className="ml-4 pl-8 border-l-2 border-gray-200">
          {semesterKeys.map((semesterNum) =>
            renderSemester(semesterNum, semesters[semesterNum])
          )}
        </div>
      </div>
    );
  };

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
            Error Loading Programs
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
    <div className="px-4 pr-2 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          DEGREE OUTLINES
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Explore program structures and course requirements. View detailed
          course outlines, semester breakdowns, and academic progression paths
          for each degree program.
        </p>

        {/* Data Source Indicator */}
        <div className="mt-4 text-xs text-gray-400">
          {programs.length > 0 && (
            <span>
              {programs.length} academic programs available
              {usingFallbackData && (
                <span className="ml-2 inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  Using demo data
                </span>
              )}
            </span>
          )}
        </div>
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
                Create new programs, manage existing ones, and access
                administrative features.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                cornerStyle="br"
                onClick={() => navigate("/programs/create")}>
                <Plus className="inline w-4 h-4 mr-2" />
                CREATE PROGRAM
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Program Selection */}
      <Card cornerStyle="tl" className="mb-8">
        <h2 className="text-xl font-bold text-primary-dark mb-4">
          SELECT A PROGRAM
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-yellow"></div>
            <div className="ml-4 text-text-secondary">Loading programs...</div>
          </div>
        ) : programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => (
              <div
                key={program.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedProgram?.id === program.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }`}>
                <div
                  onClick={() => handleProgramSelect(program)}
                  className="cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {program.type}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {program.type} in {program.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {program.duration} years
                      </p>
                    </div>
                  </div>

                  {program.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {program.description}
                    </p>
                  )}
                </div>

                {/* Admin Actions */}
                {userRole === "admin" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/programs/edit/${program.id}`);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "Are you sure you want to delete this program?"
                          )
                        ) {
                          handleDeleteProgram(program.id);
                        }
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                      <Trash className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">📚</div>
            <div className="text-gray-600 text-lg font-medium">
              No programs available
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Programs may not be loaded yet or there might be an API issue
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Reload
            </button>
          </div>
        )}
      </Card>

      {/* Program Outline */}
      {selectedProgram && (
        <div className="bg-white rounded-xl shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedProgram.type} in {selectedProgram.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedProgram.duration} year program • Complete course
                  outline
                </p>
              </div>

              {outline && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(outline.outline).reduce(
                      (total, semesters) =>
                        total +
                        Object.values(semesters).reduce(
                          (semTotal, courses) => semTotal + courses.length,
                          0
                        ),
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {isLoadingOutline ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-gray-600">
                  Loading program outline...
                </div>
              </div>
            ) : outline ? (
              <div>
                {/* Data source notice */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Course outline for {selectedProgram.type} program
                  </div>
                </div>

                {Object.keys(outline.outline)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((yearNum) =>
                    renderYear(yearNum, outline.outline[yearNum])
                  )}

                {Object.keys(outline.outline).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">📚</div>
                    <div className="text-gray-600 text-lg font-medium">
                      No courses found
                    </div>
                    <div className="text-gray-500 text-sm mt-1 mb-4">
                      Course information may not be available yet
                    </div>
                    {userRole === "admin" && (
                      <Button
                        cornerStyle="br"
                        onClick={() => navigate("/courses")}
                        size="sm">
                        Manage Courses
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">🎯</div>
                <div className="text-gray-600 text-lg font-medium">
                  Select a program above
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Choose a program to view its complete course outline
                </div>
              </div>
            )}
          </div>
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

export default ProgramOutlines;
