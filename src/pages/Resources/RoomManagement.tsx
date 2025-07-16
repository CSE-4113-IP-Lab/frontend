import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus,
  MapPin,
  Calendar,
  Clock,
  Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { RoomService, type Room, type RoomBooking, type SystemStatus } from "@/services/roomService";

export default function RoomManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'rooms');
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Update active tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load data based on active tab
  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    }
  }, [isAuthenticated, user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always load system status
      const status = await RoomService.getSystemStatus();
      setSystemStatus(status);

      if (activeTab === 'rooms') {
        const roomsData = await RoomService.getAllRooms({ include_schedule: false });
        setRooms(roomsData);
      } else if (activeTab === 'bookings') {
        const bookingsData = await RoomService.getBookings({ limit: 50 });
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRollDailySlots = async () => {
    if (!confirm('Are you sure you want to roll daily slots? This will move room schedules forward by one day.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, rollSlots: true }));
      const result = await RoomService.rollDailySlots();
      
      if (result.success) {
        alert(`Success! ${result.message}\nDeleted slots: ${result.deleted_slots}\nNew slots: ${result.new_slots}`);
        // Reload data to reflect changes
        await loadData();
      } else {
        throw new Error(result.message || 'Failed to roll daily slots');
      }
    } catch (error: any) {
      console.error('Error rolling daily slots:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to roll daily slots';
      alert(`Error: ${errorMessage}`);
    } finally {
      setActionLoading(prev => ({ ...prev, rollSlots: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
              <p className="text-gray-600">Manage rooms, schedules, and bookings</p>
            </div>
            <Button
              onClick={() => navigate('/admin/resources')}
              variant="outline"
            >
              Back to Admin Resources
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Bookings
            </TabsTrigger>
          </TabsList>

          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Room Management</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleRollDailySlots}
                      disabled={actionLoading.rollSlots}
                      variant="outline"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {actionLoading.rollSlots ? 'Rolling...' : 'Roll Daily Slots'}
                    </Button>
                    <Button onClick={() => navigate('/admin/add-room')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Room
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <p>Loading rooms...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                      {error}
                    </div>
                  </div>
                ) : rooms.length > 0 ? (
                  <div className="space-y-4">
                    {/* System Status Summary */}
                    {systemStatus && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">Total Rooms</h3>
                          <p className="text-2xl font-bold text-blue-600">{systemStatus.total_rooms}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">Available</h3>
                          <p className="text-2xl font-bold text-green-600">{systemStatus.available_rooms}</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">Today's Bookings</h3>
                          <p className="text-2xl font-bold text-orange-600">{systemStatus.today_bookings}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">Active Bookings</h3>
                          <p className="text-2xl font-bold text-purple-600">{systemStatus.active_bookings}</p>
                        </div>
                      </div>
                    )}

                    {/* Rooms List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rooms.map((room) => (
                        <div key={room.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">
                              Room {room.room_number}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              room.status === 'available' ? 'bg-green-100 text-green-800' :
                              room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {room.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Purpose:</strong> {room.purpose}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Capacity:</strong> {room.capacity} people
                          </p>
                          {room.location && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Location:</strong> {room.location}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Hours:</strong> {RoomService.formatTime(room.operating_start_time)} - {RoomService.formatTime(room.operating_end_time)}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/room-booking/book?room_id=${room.id}`)}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Book
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/room-booking/room/${room.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Rooms Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get started by adding your first room to the system.
                    </p>
                    <Button onClick={() => navigate('/room-booking/book')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Room
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Booking Management</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => loadData()}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/room-booking/my-bookings')}
                    >
                      My Bookings
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <p>Loading bookings...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                      {error}
                    </div>
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                Room {booking.room?.room_number || 'Unknown'}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                booking.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                booking.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Purpose:</strong> {booking.purpose}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Date:</strong> {RoomService.formatDate(booking.booking_date)}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Time:</strong> {RoomService.formatTime(booking.start_time)} - {RoomService.formatTime(booking.end_time)}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Duration:</strong> {booking.duration_slots * 30} minutes
                            </p>
                            {booking.user_name && (
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Booked by:</strong> {booking.user_name}
                              </p>
                            )}
                            {booking.notes && (
                              <p className="text-sm text-gray-600">
                                <strong>Notes:</strong> {booking.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {booking.status !== 'cancelled' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to cancel this booking?')) {
                                    try {
                                      await RoomService.cancelBooking(booking.id);
                                      loadData(); // Refresh data
                                    } catch (error) {
                                      console.error('Error cancelling booking:', error);
                                    }
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Bookings Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No room bookings have been made yet.
                    </p>
                    <Button onClick={() => navigate('/room-booking/book')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Make First Booking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
