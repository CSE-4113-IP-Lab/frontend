import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoomService, type Room, type BookRoomRequest } from '@/services/roomService';
import { useAuth } from '@/contexts/AuthContext';
import { getBookingDateRange } from '@/utils/dateUtils';

interface BookRoomProps {}

const BookRoom: React.FC<BookRoomProps> = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const roomIdParam = searchParams.get('room_id');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  const [bookingForm, setBookingForm] = useState<BookRoomRequest>({
    room_id: roomIdParam ? parseInt(roomIdParam) : 0,
    booking_date: '',
    start_time: '',
    end_time: '',
    purpose: '',
    notes: ''
  });

  // Check authentication
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (roomIdParam) {
      loadSelectedRoom(parseInt(roomIdParam));
    }
    loadAllRooms();
  }, [roomIdParam]);

  const loadAllRooms = async () => {
    try {
      setLoadingRooms(true);
      const roomsData = await RoomService.getAllRooms({ 
        limit: 100, 
        status: 'available',
        include_schedule: false 
      });
      setRooms(roomsData);
    } catch (err) {
      console.error('Error loading rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const loadSelectedRoom = async (roomId: number) => {
    try {
      await RoomService.getRoom(roomId);
      setBookingForm(prev => ({ ...prev, room_id: roomId }));
    } catch (err) {
      setError('Failed to load room details');
      console.error('Error loading room:', err);
    }
  };

  const validateBookingForm = (): string | null => {
    if (!bookingForm.room_id) return 'Please enter room ID';
    if (!bookingForm.purpose.trim()) return 'Please enter the purpose of booking';
    if (!bookingForm.booking_date) return 'Please select booking date';
    if (!bookingForm.start_time) return 'Please select start time';
    if (!bookingForm.end_time) return 'Please select end time';
    
    const bookingDate = new Date(bookingForm.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    if (bookingDate < today) return 'Booking date cannot be in the past';
    if (bookingDate >= oneWeekFromNow) return 'Booking date must be within the next 7 days';
    
    const [startHour, startMinute] = bookingForm.start_time.split(':').map(Number);
    const [endHour, endMinute] = bookingForm.end_time.split(':').map(Number);
    
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

  const handleBookingFormChange = (field: keyof BookRoomRequest, value: string | number) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoomSelect = (room: Room) => {
    setBookingForm(prev => ({
      ...prev,
      room_id: room.id
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateBookingForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const booking = await RoomService.bookRoom(bookingForm);
      setSuccess(`Room booked successfully! Booking ID: ${booking.id}`);
      
      // Reset form
      setBookingForm({
        room_id: 0,
        booking_date: '',
        start_time: '',
        end_time: '',
        purpose: '',
        notes: ''
      });
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to book room';
      setError(errorMessage);
      console.error('Error booking room:', err);
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Room</h1>
          <Button variant="outline" onClick={() => navigate('/room-booking/my-bookings')}>
            Booking History
          </Button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book Room</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bookingForm.room_id || ''}
                      onChange={e => handleBookingFormChange('room_id', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={bookingForm.booking_date}
                      onChange={e => handleBookingFormChange('booking_date', e.target.value)}
                      min={getBookingDateRange().min}
                      max={getBookingDateRange().max}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={bookingForm.start_time}
                        onChange={e => handleBookingFormChange('start_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select time</option>
                        {timeOptions.slice(0, -1).map((time) => (
                          <option key={time} value={time}>{RoomService.formatTime(time)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={bookingForm.end_time}
                        onChange={e => handleBookingFormChange('end_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select time</option>
                        {timeOptions.slice(1).map((time) => (
                          <option key={time} value={time}>{RoomService.formatTime(time)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingForm.purpose}
                      onChange={e => handleBookingFormChange('purpose', e.target.value)}
                      placeholder="e.g., Team meeting, Class lecture"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={bookingForm.notes || ''}
                      onChange={e => handleBookingFormChange('notes', e.target.value)}
                      placeholder="Any additional information..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Booking...' : 'Book Room'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Room List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRooms ? (
                  <div className="text-center py-4">Loading rooms...</div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-blue-50 hover:border-blue-300 ${
                          bookingForm.room_id === room.id 
                            ? 'bg-blue-100 border-blue-500' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Room {room.room_number}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Purpose: {room.purpose}
                            </p>
                            <p className="text-sm text-gray-600">
                              Capacity: {room.capacity} people
                            </p>
                            {room.location && (
                              <p className="text-sm text-gray-500">
                                Location: {room.location}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {room.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {rooms.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No rooms available
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
