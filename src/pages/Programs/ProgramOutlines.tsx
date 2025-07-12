import React, { useState, useEffect } from "react";
import {
  programService,
  type ProgramResponse,
  type ProgramOutlineResponse,
} from "../../services/programService";
import type { CourseResponse } from "../../types";

const ProgramOutlines: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ProgramResponse | null>(null);
  const [outline, setOutline] = useState<ProgramOutlineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOutline, setIsLoadingOutline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load programs on component mount
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch from backend API first
        try {
          const data = await programService.getPublicPrograms();
          setPrograms(data);
        } catch (apiError) {
          console.warn("API failed, using fallback data:", apiError);
          
          // Fallback to mock data if API fails
          const mockPrograms: ProgramResponse[] = [
            {
              id: 1,
              type: "BSc",
              name: "Computer Science and Engineering",
              duration: 4,
              description: "Bachelor of Science in Computer Science and Engineering",
              is_active: 1
            },
            {
              id: 2,
              type: "MSc", 
              name: "Computer Science and Engineering",
              duration: 2,
              description: "Master of Science in Computer Science and Engineering",
              is_active: 1
            },
            {
              id: 3,
              type: "PhD",
              name: "Computer Science and Engineering", 
              duration: 4,
              description: "Doctor of Philosophy in Computer Science and Engineering",
              is_active: 1
            }
          ];
          
          setPrograms(mockPrograms);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load programs"
        );
        console.error("Error loading programs:", err);
      } finally {
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
        const data = await programService.getProgramOutline(program.id);
        setOutline(data);
      } catch (apiError) {
        console.warn("API failed for program outline, using fallback data:", apiError);
        
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
                  description: "Basic concepts of computer science and programming fundamentals",
                  semester: 1,
                  year: 1,
                  batch: "2023"
                },
                {
                  id: 2,
                  name: "Mathematics I (Calculus)",
                  course_code: "MATH 101",
                  program_id: program.id,
                  credits: 3,
                  description: "Differential and integral calculus with applications",
                  semester: 1,
                  year: 1,
                  batch: "2023"
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
                  batch: "2023"
                }
              ],
              "2": [
                {
                  id: 4,
                  name: "Data Structures",
                  course_code: "CSE 201",
                  program_id: program.id,
                  credits: 3,
                  description: "Arrays, linked lists, stacks, queues, trees, and graphs",
                  semester: 2,
                  year: 1,
                  batch: "2023"
                },
                {
                  id: 5,
                  name: "Mathematics II (Linear Algebra)",
                  course_code: "MATH 201",
                  program_id: program.id,
                  credits: 3,
                  description: "Vector spaces, matrices, and linear transformations",
                  semester: 2,
                  year: 1,
                  batch: "2023"
                }
              ]
            },
            "2": {
              "1": [
                {
                  id: 6,
                  name: "Algorithm Analysis",
                  course_code: "CSE 301",
                  program_id: program.id,
                  credits: 3,
                  description: "Algorithm design techniques and complexity analysis",
                  semester: 1,
                  year: 2,
                  batch: "2023"
                },
                {
                  id: 7,
                  name: "Database Systems",
                  course_code: "CSE 302",
                  program_id: program.id,
                  credits: 3,
                  description: "Relational databases, SQL, and database design",
                  semester: 1,
                  year: 2,
                  batch: "2023"
                }
              ],
              "2": [
                {
                  id: 8,
                  name: "Software Engineering",
                  course_code: "CSE 401",
                  program_id: program.id,
                  credits: 3,
                  description: "Software development methodologies and project management",
                  semester: 2,
                  year: 2,
                  batch: "2023"
                }
              ]
            }
          }
        };
        
        setOutline(mockOutline);
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

  const renderCourseCard = (course: CourseResponse) => (
    <div
      key={course.id}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          🎓 Degree Outlines
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Explore program structures and course requirements
        </p>
      </div>

      {/* Program Selection */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📚 Select a Program
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => (
              <button
                key={program.id}
                onClick={() => handleProgramSelect(program)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedProgram?.id === program.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }`}>
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
              </button>
            ))}
          </div>
        )}
      </div>

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
                    <div className="text-gray-500 text-sm mt-1">
                      Course information may not be available yet
                    </div>
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
    </div>
  );
};

export default ProgramOutlines;
