import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Button from "../../../components/Button";
import { scheduleService } from "../../../services/scheduleService";
import type {
  CourseResponse,
  DayOfWeek,
  ClassScheduleResponse,
} from "../../../types";
import axios from "axios";

const EditSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [schedule, setSchedule] = useState<ClassScheduleResponse | null>(null);

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

  // Check admin access and load data
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "admin") {
      navigate("/schedule");
      return;
    }

    if (!id) {
      navigate("/schedule");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        // Load courses and schedule details
        const [coursesResponse, scheduleResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/courses`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }),
          axios.get(
            `${import.meta.env.VITE_SERVER_URL}/class-schedules/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            }
          ),
        ]);

        setCourses(coursesResponse.data);
        const scheduleData = scheduleResponse.data;
        setSchedule(scheduleData);

        // Populate form with existing data
        setFormData({
          course_id: scheduleData.course_id.toString(),
          day_of_week: scheduleData.day_of_week,
          start_time: scheduleData.start_time,
          end_time: scheduleData.end_time,
          room: scheduleData.room || "",
          batch: scheduleData.batch || "",
          semester: scheduleData.semester?.toString() || "",
          year: scheduleData.year?.toString() || "",
          is_active: scheduleData.is_active,
        });
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load schedule data. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [navigate, id]);

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

      const updateData = {
        course_id: parseInt(formData.course_id),
        day_of_week: formData.day_of_week as DayOfWeek,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room,
        batch: formData.batch,
        semester: formData.semester ? parseInt(formData.semester) : undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        is_active: formData.is_active,
      };

      await scheduleService.updateSchedule(token, parseInt(id!), updateData);
      navigate("/schedule");
    } catch (err) {
      console.error("Failed to update schedule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update schedule"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <span className="ml-3 text-gray-600">Loading schedule data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Class Schedule</h1>
          <Button
            onClick={() => navigate("/schedule")}
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

          {/* Current Schedule Info */}
          {schedule && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-900 mb-2">Current Schedule</h3>
              <div className="text-sm text-blue-700">
                <p>
                  <strong>Course:</strong> {schedule.course?.course_code} -{" "}
                  {schedule.course?.name}
                </p>
                <p>
                  <strong>Day:</strong> {schedule.day_of_week}
                </p>
                <p>
                  <strong>Time:</strong> {schedule.start_time} -{" "}
                  {schedule.end_time}
                </p>
                <p>
                  <strong>Room:</strong> {schedule.room || "Not specified"}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Schedule Info */}
            {schedule && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 w-full">
                <h3 className="font-bold text-blue-900 mb-2 w-full p-2">
                  Current Schedule
                </h3>
                <div className="text-sm text-blue-700 w-full p-2">
                  <p>
                    <strong>Course:</strong> {schedule.course?.course_code} -{" "}
                    {schedule.course?.name}
                  </p>
                  <p>
                    <strong>Time:</strong> {schedule.day_of_week}{" "}
                    {schedule.start_time} - {schedule.end_time}
                  </p>
                  {schedule.room && (
                    <p>
                      <strong>Room:</strong> {schedule.room}
                    </p>
                  )}
                  {schedule.batch && (
                    <p>
                      <strong>Batch:</strong> {schedule.batch}
                    </p>
                  )}
                </div>
              </div>
            )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
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

export default EditSchedule;
