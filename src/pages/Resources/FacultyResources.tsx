import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  RoomService,
  type Room,
  type RoomBooking,
  type SystemStatus,
} from "@/services/roomService";
import {
  FileText,
  BookOpen,
  Search,
  Calendar,
  Settings,
  Plus,
  Eye,
  Users,
  CheckCircle,
  MapPin,
  Clock,
  BarChart2,
  Star,
} from "lucide-react";

export default function FacultyResources() {
  const navigate = useNavigate();
  const { authenticationFlag } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recentRequests, setRecentRequests] = useState<number>(0);

  // Room booking state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [myBookings, setMyBookings] = useState<RoomBooking[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Check authentication and redirect if needed

  // Fetch faculty dashboard data
  const fetchFacultyData = async () => {
    if (authenticationFlag) return;
    const id = localStorage.getItem("id");

    setLoading(true);
    try {
      // Fetch room booking data
      const [statusData, roomsData, bookingsData] = await Promise.all([
        RoomService.getSystemStatus(),
        RoomService.getAllRooms({ include_schedule: false, limit: 6 }),
        RoomService.getBookings({
          user_id: id ? parseInt(id.toString()) : undefined,
          limit: 5,
        }),
      ]);

      setSystemStatus(statusData);
      setRooms(roomsData.slice(0, 6)); // Show only first 6 rooms
      setMyBookings(
        bookingsData.filter(
          (b) =>
            new Date(`${b.booking_date}T${b.start_time}`) > new Date() &&
            b.status === "scheduled"
        )
      );

      // TODO: Replace with actual equipment requests API when available
      // For now, set mock data for equipment requests
      setRecentRequests(Math.floor(Math.random() * 3) + 1);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      // Set fallback values
      setRecentRequests(0);
      setRooms([]);
      setMyBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Faculty Resources
                </h1>
                <p className="text-gray-600">
                  Teaching tools, course management, and academic resources for
                  faculty members.
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search faculty resources..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>{" "}
          </Card>

          {/* Quick Actions & Recent Activity */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions & Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {loading
                        ? "Loading..."
                        : `${recentRequests} Equipment Requests`}
                    </h3>
                    <p className="text-sm text-gray-600">Pending & recent</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/faculty/equipment?tab=current")}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Quick Room Booking
                    </h3>
                    <p className="text-sm text-gray-600">
                      Find and book available rooms
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate("/room-booking/book")}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Quick Book Room
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Faculty Resource Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Management */}

            {/* Room Booking System */}
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-teal-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  Room Booking System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Reserve classrooms, labs, and meeting rooms with 30-minute
                  slot precision
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-teal-50"
                    onClick={() => navigate("/room-booking/available")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Browse Available Rooms
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-teal-50"
                    onClick={() => navigate("/room-booking/my-bookings")}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Upcoming Booking
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-teal-50"
                    onClick={() => navigate("/room-booking/my-bookings")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Booking History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student Management */}

            {/* Assignment & Grading */}
            <Card
              className="hover:shadow-lg transition-shadow"
              onClick={() => navigate("/assignments")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  View, submit, and track your assignments
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Assignments
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submitted Assignments
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Graded Assignments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Grades */}
            <Card
              className="hover:shadow-lg transition-shadow"
              onClick={() => navigate("/grades")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-green-600" />
                  Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Check your academic performance and transcript
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    View Grades
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Transcript
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Semester-wise Results
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Requests */}
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  Equipment Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Request and manage laboratory equipment for teaching and
                  research
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-orange-50"
                    onClick={() => navigate("/faculty/equipment")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Browse Equipment Catalog
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-orange-50"
                    onClick={() => navigate("/faculty/equipment")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit New Request
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-orange-50"
                    onClick={() => navigate("/faculty/equipment?tab=current")}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Track My Requests
                  </Button>
                </div>
                {/* <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <strong>Status:</strong>{" "}
                    {loading
                      ? "Loading..."
                      : `${recentRequests} active requests`}
                  </p>
                </div> */}
              </CardContent>
            </Card>

            {/* Research Resources */}
            <Card
              className="hover:shadow-lg transition-shadow"
              onClick={() => navigate("/research-gallery")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Research Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access research tools, publications, and collaboration
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Research Papers
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Research
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Collaborations
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Schedule & Meetings */}
            <Card
              className="hover:shadow-lg transition-shadow"
              onClick={() => navigate("/meetings")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  Schedule & Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage class schedules, office hours, and meetings
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Class Schedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Office Hours
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Resources */}
          </div>
        </div>
      </main>
    </div>
  );
}
