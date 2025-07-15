import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  examScheduleService,
  type ExamScheduleCreateRequest,
  type ExamScheduleResponse,
} from "../../../services/examScheduleService";
import Button from "../../../components/Button";
import { ArrowLeft, Save } from "lucide-react";
import type { CourseResponse } from "../../../types";

const EditExamSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExamScheduleCreateRequest>({
    course_id: 0,
    exam_date: "",
    type: "",
    start_time: "",
    end_time: "",
    room: "",
    batch: "",
    semester: 1,
    year: 1,
  });

  // Load existing exam schedule data
  useEffect(() => {
    const loadData = async () => {
      if (!scheduleId) {
        setError("Schedule ID is required");
        setIsLoadingData(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        // Load existing schedule
        const schedule: ExamScheduleResponse =
          await examScheduleService.getExamScheduleById(
            token,
            parseInt(scheduleId)
          );

        // Convert API response to form data
        setFormData({
          course_id: schedule.course_id,
          exam_date: schedule.exam_date.split("T")[0], // Extract date part
          type: schedule.type,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          room: schedule.room,
          batch: schedule.batch,
          semester: schedule.semester,
          year: schedule.year,
        });

        // Load all courses for selection
        // This would need a courses API endpoint
        // For now, we'll use mock data
        const mockCourses: CourseResponse[] = [
          {
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
          {
            id: 2,
            name: "Database Systems",
            course_code: "CSE-3101",
            program_id: 1,
            credits: 3,
            description: "Database design and management",
            semester: 5,
            year: 3,
            batch: "20",
          },
        ];
        setCourses(mockCourses);
      } catch (error) {
        console.error("Failed to load exam schedule:", error);
        setError("Failed to load exam schedule data");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [scheduleId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "course_id" || name === "semester" || name === "year"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.course_id ||
      !formData.exam_date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!scheduleId) {
      setError("Schedule ID is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      await examScheduleService.updateExamSchedule(
        token,
        parseInt(scheduleId),
        formData
      );
      navigate("/exam-schedules");
    } catch (error) {
      console.error("Failed to update exam schedule:", error);
      setError("Failed to update exam schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <span className="ml-3 text-gray-600">Loading exam schedule...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Exam Schedule</h1>
          <Button
            onClick={() => navigate("/exam-schedules")}
            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <ArrowLeft size={20} />
            Back
          </Button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Selection */}
              <div>
                <label
                  htmlFor="course_id"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  id="course_id"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
                  <option value={0}>Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
                  <option value="">Select exam type</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              {/* Exam Date */}
              <div>
                <label
                  htmlFor="exam_date"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Date *
                </label>
                <input
                  type="date"
                  id="exam_date"
                  name="exam_date"
                  value={formData.exam_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* End Time */}
              <div>
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Room */}
              <div>
                <label
                  htmlFor="room"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Room *
                </label>
                <input
                  type="text"
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Room 301"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Batch */}
              <div>
                <label
                  htmlFor="batch"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Batch *
                </label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Semester */}
              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Semester *
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
                  {[1, 2, 3, 4, 5].map((yr) => (
                    <option key={yr} value={yr}>
                      Year {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                onClick={() => navigate("/exam-schedules")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition duration-200 disabled:opacity-50">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Update Schedule
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditExamSchedule;
