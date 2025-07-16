import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Settings,
  Plus,
  Eye,
  CheckCircle,
  Shield,
  Calendar,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { equipmentService } from "@/services/equipmentService";
import { RoomService, type SystemStatus } from "@/services/roomService";

export default function AdminResources() {
  const navigate = useNavigate();
  const { user, isAuthenticated, authenticationFlag } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [todayBookingsCount, setTodayBookingsCount] = useState<number>(0);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and redirect if needed

  // Fetch admin dashboard data
  const fetchAdminData = async () => {
    if (!authenticationFlag) return;

    setLoading(true);
    setError(null);
    try {
      // Fetch pending equipment requests count
      const requests = await equipmentService.getEquipmentRequests("pending");
      setPendingRequestsCount(requests.length);

      // Fetch room booking system status
      const status = await RoomService.getSystemStatus();
      setSystemStatus(status);
      setTodayBookingsCount(status.today_bookings);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("Failed to load dashboard data");
      // Set fallback values
      setTodayBookingsCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
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
                  Admin Resources
                </h1>
                <p className="text-gray-600">
                  Administrative tools and management interfaces for university
                  operations.
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
                    placeholder="Search admin resources..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Management Activities */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Management Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {loading
                        ? "Loading..."
                        : `${pendingRequestsCount} Equipment Requests Pending`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      New requests awaiting approval
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        "/admin/equipment-management?tab=requests&filter=pending"
                      )
                    }
                  >
                    Review
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Add New Equipment
                    </h3>
                    <p className="text-sm text-gray-600">
                      Click to add new equipment to inventory
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      sessionStorage.setItem("openAddDialog", "true");
                      navigate("/admin/equipment-management");
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {loading
                        ? "Loading..."
                        : `${todayBookingsCount} Room Bookings Today`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      View and manage today's room bookings
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        "/admin/room-management?tab=bookings&filter=today"
                      )
                    }
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {loading
                        ? "Loading..."
                        : `${
                            systemStatus?.available_rooms || 0
                          } Available Rooms`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Out of {systemStatus?.total_rooms || 0} total rooms
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/admin/room-management")}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Statistics */}
          {systemStatus && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Room Booking System Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Today's Statistics */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Today's Usage
                    </h3>
                    {systemStatus.today ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Slots:
                          </span>
                          <span className="text-sm font-medium">
                            {systemStatus.today.total_slots}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Booked:</span>
                          <span className="text-sm font-medium">
                            {systemStatus.today.booked_slots}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Available:
                          </span>
                          <span className="text-sm font-medium">
                            {systemStatus.today.available_slots}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Utilization:
                          </span>
                          <span className="text-sm font-medium">
                            {systemStatus.today.utilization_percent}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No data available</p>
                    )}
                  </div>

                  {/* Week's Statistics */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      This Week's Usage
                    </h3>
                    {systemStatus.week ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Slots:
                          </span>
                          <span className="text-sm font-medium">
                            {systemStatus.week.total_slots}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Booked:</span>
                          <span className="text-sm font-medium">
                            {systemStatus.week.booked_slots}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Available:
                          </span>
                          <span className="text-sm font-medium">
                            {systemStatus.week.available_slots}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Utilization:
                          </span>
                          <span className="text-sm font-medium">
                            {systemStatus.week.utilization_percent}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No data available</p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Admin Resource Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Equipment Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Equipment Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage all laboratory equipment
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => navigate("/admin/equipment-management")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All Equipment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      sessionStorage.setItem("openAddDialog", "true");
                      navigate("/admin/equipment-management");
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Equipment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => navigate("/admin/equipment-management")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Inventory
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Room Booking Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Room Booking Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage rooms and booking schedules
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => navigate("/admin/room-management")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Manage Rooms
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      navigate("/admin/room-management?tab=bookings")
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All Bookings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await RoomService.rollDailySlots();
                        fetchAdminData(); // Refresh data
                      } catch (error) {
                        console.error("Error rolling daily slots:", error);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Roll Daily Slots
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* View & Approve Requests */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  View & Approve Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Review and approve equipment requests
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      navigate(
                        "/admin/equipment-management?tab=requests&filter=pending"
                      )
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Pending Requests
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      navigate("/admin/equipment-management?tab=requests")
                    }
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Requests
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      navigate("/admin/equipment-management?tab=requests")
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Request History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  System Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  System administration and user management
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    User Management
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    System Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
