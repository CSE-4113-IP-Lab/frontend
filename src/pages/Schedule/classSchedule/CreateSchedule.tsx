import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import Button from "../../../components/Button";
import { scheduleService } from "../../../services/scheduleService";
import type { CourseResponse, DayOfWeek } from "../../../types";
import axios from "axios";

const CreateSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);

  const [formData, setFormData] = useState({
    course_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    room: "",
    batch: "",
    semester: "",
    year: "",
    is_active: 1,
  });

  const daysOfWeek = [
    { value: "sunday", label: "Sunday" },
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
  ];

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
  ];

  // Check admin access
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "admin") {
      navigate("/schedule");
      return;
    }

    loadCourses();
  }, [navigate]);

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setError("Failed to load courses. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const scheduleData = {
        course_id: parseInt(formData.course_id),
        day_of_week: formData.day_of_week as DayOfWeek,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room,
        batch: formData.batch,
        semester: parseInt(formData.semester),
        year: parseInt(formData.year),
        is_active: formData.is_active,
      };

      await scheduleService.createSchedule(token, scheduleData);
      navigate("/schedule");
    } catch (err) {
      console.error("Failed to create schedule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create schedule"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-[#14244c] text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Class Schedule</h1>
          <Button
            onClick={() => navigate("/schedule")}
            className="bg-[#14244c] hover:bg-[#14244c] text-white px-4 py-2 rounded-lg flex items-center gap-2">
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
                  onChange={(e) =>
                    handleInputChange("course_id", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c] focus:border-[#14244c]">
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day of Week */}
              <div>
                <label
                  htmlFor="day_of_week"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week *
                </label>
                <select
                  id="day_of_week"
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={(e) =>
                    handleInputChange("day_of_week", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c] focus:border-[#14244c]">
                  <option value="">Select day</option>
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <select
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={(e) =>
                    handleInputChange("start_time", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c] focus:border-[#14244c]">
                  <option value="">Select start time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* End Time */}
              <div>
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <select
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={(e) =>
                    handleInputChange("end_time", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c] focus:border-[#14244c]">
                  <option value="">Select end time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label
                  htmlFor="room"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Room
                </label>
                <input
                  type="text"
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={(e) => handleInputChange("room", e.target.value)}
                  placeholder="e.g., Room 301, Lab 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Batch */}
              <div>
                <label
                  htmlFor="batch"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Batch
                </label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={(e) => handleInputChange("batch", e.target.value)}
                  placeholder="e.g., 20, 21, 22"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Semester */}
              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={(e) =>
                    handleInputChange("semester", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c] focus:border-[#14244c]">
                  <option value="">Select semester</option>
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
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c]focus:border-[#14244c]">
                  <option value="">Select year</option>
                  {[1, 2, 3, 4].map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                onClick={() => navigate("/schedule")}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Schedule
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

export default CreateSchedule;
