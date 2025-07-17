import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { RoomService, type RoomCreateInput } from "@/services/roomService";

export default function AddRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<RoomCreateInput>({
    room_number: "",
    purpose: "",
    capacity: 1,
    location: "",
    description: "",
    status: "available",
    operating_start_time: "08:00:00",
    operating_end_time: "20:00:00",
  });

  // Check authentication
  // React.useEffect(() => {
  //   if (!isAuthenticated || !user) {
  //     navigate('/auth');
  //     return;
  //   }
  //   // Check if user is admin
  //   if (user.role !== 'admin') {
  //     navigate('/auth');
  //     return;
  //   }
  // }, [isAuthenticated, user, navigate]);

  const handleInputChange = (
    field: keyof RoomCreateInput,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error and success messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = (): string | null => {
    if (!formData.room_number.trim()) return "Room number is required";
    if (!formData.purpose.trim()) return "Purpose is required";
    if (formData.capacity < 1) return "Capacity must be at least 1";

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(formData.operating_start_time!)) {
      return "Start time must be in HH:MM:SS format";
    }
    if (!timeRegex.test(formData.operating_end_time!)) {
      return "End time must be in HH:MM:SS format";
    }

    // Validate that start time is before end time
    const startTime = new Date(`1970-01-01T${formData.operating_start_time}`);
    const endTime = new Date(`1970-01-01T${formData.operating_end_time}`);
    if (startTime >= endTime) {
      return "Start time must be before end time";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newRoom = await RoomService.createRoom(formData);
      setSuccess(`Room "${newRoom.room_number}" created successfully!`);

      // Reset form
      setFormData({
        room_number: "",
        purpose: "",
        capacity: 1,
        location: "",
        description: "",
        status: "available",
        operating_start_time: "08:00:00",
        operating_end_time: "20:00:00",
      });

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate("/admin/room-management");
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Failed to create room";
      setError(errorMessage);
      console.error("Error creating room:", err);
    } finally {
      setLoading(false);
    }
  };

  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00`;
      const displayTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeOptions.push({ value: timeString, label: displayTime });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
              <p className="text-gray-600">Create a new room in the system</p>
            </div>
            <Button
              onClick={() => navigate("/admin/room-management")}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Room Management
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={formData.room_number}
                    onChange={(e) =>
                      handleInputChange("room_number", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., A101, B202"
                    required
                  />
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose *
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) =>
                      handleInputChange("purpose", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select purpose</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Lab">Lab</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Conference Room">Conference Room</option>
                    <option value="Study Room">Study Room</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.capacity}
                    onChange={(e) =>
                      handleInputChange(
                        "capacity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>

                {/* Operating Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Start Time
                  </label>
                  <select
                    value={formData.operating_start_time}
                    onChange={(e) =>
                      handleInputChange("operating_start_time", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timeOptions
                      .slice(0, timeOptions.length - 1)
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Operating End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating End Time
                  </label>
                  <select
                    value={formData.operating_end_time}
                    onChange={(e) =>
                      handleInputChange("operating_end_time", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timeOptions.slice(1).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Main Building, 2nd Floor"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional details about the room..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/room-management")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Room
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
