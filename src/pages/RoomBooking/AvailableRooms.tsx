import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { RoomService, type Room, type AvailableRoomsRequest } from '@/services/roomService';
import { useAuth } from '@/contexts/AuthContext';
import { getBookingDateRange } from '@/utils/dateUtils';

interface AvailableRoomsProps {}

const AvailableRooms: React.FC<AvailableRoomsProps> = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<AvailableRoomsRequest>({
    booking_date: '',
    start_time: '',
    end_time: '',
    purpose: '',
    capacity: undefined
  });

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }
    
    loadAllRooms();
  }, [isAuthenticated, user, navigate]);

  const loadAllRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await RoomService.getAllRooms({ 
        skip: 0, 
        limit: 100,
        status: 'available'
      });
      setRooms(roomsData);
      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchAvailableRooms = async () => {
    const validationError = validateSearchForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const response = await RoomService.searchAvailableRooms(searchParams);
      setAvailableRooms(response.available_rooms);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to search rooms';
      setError(errorMessage);
      console.error('Error searching rooms:', err);
    } finally {
      setSearching(false);
    }
  };

  const validateSearchForm = (): string | null => {
    if (!searchParams.booking_date) return 'Please select booking date';
    if (!searchParams.start_time) return 'Please select start time';
    if (!searchParams.end_time) return 'Please select end time';
    
    const bookingDate = new Date(searchParams.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    if (bookingDate < today) return 'Booking date cannot be in the past';
    if (bookingDate >= oneWeekFromNow) return 'Booking date must be within the next 7 days';
    
    const [startHour, startMinute] = searchParams.start_time.split(':').map(Number);
    const [endHour, endMinute] = searchParams.end_time.split(':').map(Number);
    
    if (startHour < 8 || startHour >= 20) {
      return 'Start time must be between 8:00 AM and 8:00 PM';
    }
    
    if (endHour < 8 || endHour > 20) {
      return 'End time must be between 8:00 AM and 8:00 PM';
    }
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (endMinutes <= startMinutes) {
      return 'End time must be after start time';
    }
    
    // Check if times are 30-minute aligned
    if (startMinute % 30 !== 0 || endMinute % 30 !== 0) {
      return 'Times must be in 30-minute slots (e.g., 9:00, 9:30, 10:00)';
    }
    
    return null;
  };

  const handleInputChange = (field: keyof AvailableRoomsRequest, value: string | number | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const bookRoom = (roomId: number) => {
    const queryParams = new URLSearchParams({
      room_id: roomId.toString(),
      ...(searchParams.booking_date && { booking_date: searchParams.booking_date }),
      ...(searchParams.start_time && { start_time: searchParams.start_time }),
      ...(searchParams.end_time && { end_time: searchParams.end_time })
    });
    navigate(`/room-booking/book?${queryParams.toString()}`);
  };

  // Generate time options in 30-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 0) break; // Don't go past 20:00
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Rooms</h1>
          <div className="flex justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Rooms</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/room-booking/my-bookings')}>
              My Bookings
            </Button>
            <Button onClick={() => navigate('/room-booking/book')}>
              Book Room
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Available Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={searchParams.booking_date}
                  onChange={(e) => handleInputChange('booking_date', e.target.value)}
                  min={getBookingDateRange().min}
                  max={getBookingDateRange().max}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={searchParams.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select time</option>
                  {timeOptions.slice(0, -1).map(time => (
                    <option key={time} value={time}>{RoomService.formatTime(time)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={searchParams.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select time</option>
                  {timeOptions.slice(1).map(time => (
                    <option key={time} value={time}>{RoomService.formatTime(time)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Capacity
                </label>
                <input
                  type="number"
                  value={searchParams.capacity || ''}
                  onChange={(e) => handleInputChange('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Any"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={searchAvailableRooms} 
                  disabled={searching}
                  className="w-full"
                >
                  {searching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose (Optional)
              </label>
              <input
                type="text"
                value={searchParams.purpose || ''}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                placeholder="e.g., Meeting, Lecture"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {availableRooms.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Results ({availableRooms.length} rooms available)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRooms.map((room) => (
                  <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">Room {room.room_number}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Available
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{room.purpose}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{room.capacity} people</span>
                      </div>
                      {room.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{room.location}</span>
                        </div>
                      )}
                    </div>

                    {searchParams.booking_date && searchParams.start_time && searchParams.end_time && (
                      <div className="bg-blue-50 p-3 rounded-md mb-4">
                        <p className="text-sm text-blue-700">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {RoomService.formatDate(searchParams.booking_date)}
                          {' '}{RoomService.formatTime(searchParams.start_time)} - {RoomService.formatTime(searchParams.end_time)}
                        </p>
                      </div>
                    )}

                    <Button 
                      onClick={() => bookRoom(room.id)}
                      className="w-full"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book This Room
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Rooms */}
        <Card>
          <CardHeader>
            <CardTitle>All Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">Room {room.room_number}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' :
                      room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{room.purpose}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{room.capacity} people</span>
                    </div>
                    {room.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{room.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{RoomService.formatTime(room.operating_start_time)} - {RoomService.formatTime(room.operating_end_time)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => bookRoom(room.id)}
                      disabled={room.status !== 'available'}
                      className="flex-1"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/room-booking/room/${room.id}`)}
                      className="flex-1"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {rooms.length === 0 && !loading && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rooms Available</h3>
                <p className="text-gray-600">Check back later or contact administration.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AvailableRooms;
