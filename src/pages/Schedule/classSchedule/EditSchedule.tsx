import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Users,
  Save,
  X,
} from "lucide-react";
import Card from "../../../components/Card";
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
      <div className="px-4 pr-2 py-12">
        <Card cornerStyle="tl" className="mb-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-yellow"></div>
            <div className="ml-4 text-text-secondary">
              Loading schedule data...
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 pr-2 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          EDIT SCHEDULE
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Update the schedule entry. Modify course assignments, time slots,
          rooms, and batch information as needed.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card cornerStyle="tl" className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600 font-medium">Error</div>
            <div className="text-red-500 text-sm mt-1">{error}</div>
          </div>
        </Card>
      )}

      {/* Form */}
      <Card cornerStyle="tl" className="w-full p-2">
        <form onSubmit={handleSubmit} className="space-y-6 w-full p-2">
          {/* Current Schedule Info */}
          {schedule && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 w-full">
              <h3 className="font-bold text-blue-900 mb-2 w-full p-2">Current Schedule</h3>
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

          {/* Course Selection */}
          <div className="space-y-2 w-full p-2">
            <label className="block text-sm font-bold text-primary-dark mb-2">
              <BookOpen className="inline w-4 h-4 mr-2" />
              COURSE *
            </label>
            <select
              value={formData.course_id}
              onChange={(e) => handleInputChange("course_id", e.target.value)}
              className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required>
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Day and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-2">
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                DAY OF WEEK *
              </label>
              <select
                value={formData.day_of_week}
                onChange={(e) =>
                  handleInputChange("day_of_week", e.target.value)
                }
                className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                <option value="">Select day</option>
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                START TIME *
              </label>
              <select
                value={formData.start_time}
                onChange={(e) =>
                  handleInputChange("start_time", e.target.value)
                }
                className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                <option value="">Select start time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                END TIME *
              </label>
              <select
                value={formData.end_time}
                onChange={(e) => handleInputChange("end_time", e.target.value)}
                className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                <option value="">Select end time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room and Batch Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-2">
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                ROOM
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => handleInputChange("room", e.target.value)}
                placeholder="e.g., Room 301, Lab 1, Auditorium"
                className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                <Users className="inline w-4 h-4 mr-2" />
                BATCH
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => handleInputChange("batch", e.target.value)}
                placeholder="e.g., 20, 21, 22"
                className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-2">
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                SEMESTER
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleInputChange("semester", e.target.value)}
                className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                YEAR
              </label>
              <select
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select year</option>
                {[1, 2, 3, 4].map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                STATUS
              </label>
              <select
                value={formData.is_active}
                onChange={(e) =>
                  handleInputChange("is_active", parseInt(e.target.value))
                }
                className="w-full border border-gray-300 rounded-tl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 w-full p-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/schedule")}
              disabled={isLoading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" cornerStyle="br" disabled={isLoading} className="bg-[#14244c] text-white hover:bg-[#ecb31d] cursor-pointer">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Schedule
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditSchedule;
