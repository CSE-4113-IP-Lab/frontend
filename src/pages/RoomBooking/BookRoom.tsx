import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../components/Card';
import { RoomService, type Room, type BookRoomRequest } from '../../services/roomService';

interface BookRoomProps {}

const BookRoom: React.FC<BookRoomProps> = () => {
  const [searchParams] = useSearchParams();
  const roomIdParam = searchParams.get('room_id');
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [bookingForm, setBookingForm] = useState<BookRoomRequest>({
    room_id: roomIdParam ? parseInt(roomIdParam) : 0,
    purpose: '',
    start_datetime: '',
    duration_hours: 1,
    duration_minutes: 0,
    notes: ''
  });

  useEffect(() => {
    // Set test token for development
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0YWhzaW5AaG90LmNvbSIsInJvbGUiOiJmYWN1bHR5IiwiZXhwIjoxNzUyNDU2NDc1fQ.PhzVW9ot9OwU-eZBa1ymjC53ZRc8f6m2-sJyhRPhS5s';
    localStorage.setItem('accessToken', testToken);
    
    loadRooms();
    if (roomIdParam) {
      loadSelectedRoom(parseInt(roomIdParam));
    }
  }, [roomIdParam]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await RoomService.getAllRooms({ status: 'AVAILABLE' });
      setRooms(roomsData);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedRoom = async (roomId: number) => {
    try {
      const roomData = await RoomService.getRoom(roomId);
      setSelectedRoom(roomData);
      setBookingForm(prev => ({ ...prev, room_id: roomId }));
    } catch (err) {
      setError('Failed to load room details');
      console.error('Error loading room:', err);
    }
  };

  const handleInputChange = (field: keyof BookRoomRequest, value: string | number) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setBookingForm(prev => ({ ...prev, room_id: room.id }));
  };

  const calculateEndDateTime = () => {
    if (!bookingForm.start_datetime) return '';
    
    const startDate = new Date(bookingForm.start_datetime);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + bookingForm.duration_hours);
    endDate.setMinutes(endDate.getMinutes() + bookingForm.duration_minutes);
    
    return endDate.toLocaleString();
  };

  const validateForm = (): string | null => {
    if (!bookingForm.room_id) return 'Please select a room';
    if (!bookingForm.purpose.trim()) return 'Please enter the purpose of booking';
    if (!bookingForm.start_datetime) return 'Please select start date and time';
    
    const startDate = new Date(bookingForm.start_datetime);
    const now = new Date();
    if (startDate <= now) return 'Start time must be in the future';
    
    const startTime = startDate.getHours();
    if (startTime < 8 || startTime >= 20) {
      return 'Booking time must be between 8:00 AM and 8:00 PM';
    }
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + bookingForm.duration_hours);
    endDate.setMinutes(endDate.getMinutes() + bookingForm.duration_minutes);
    
    if (endDate.getHours() > 20) {
      return 'Booking cannot extend beyond 8:00 PM';
    }
    
    if (bookingForm.duration_hours === 0 && bookingForm.duration_minutes === 0) {
      return 'Duration must be at least 1 minute';
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
      setSubmitting(true);
      setError(null);
      
      const booking = await RoomService.bookRoom(bookingForm);
      setSuccess(`Room booked successfully! Booking ID: ${booking.id}`);
      
      // Reset form
      setBookingForm({
        room_id: 0,
        purpose: '',
        start_datetime: '',
        duration_hours: 1,
        duration_minutes: 0,
        notes: ''
      });
      setSelectedRoom(null);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to book room';
      setError(errorMessage);
      console.error('Error booking room:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Room</h1>
          <div className="flex justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Room</h1>

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
          {/* Room Selection */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Room</h2>
              
              {selectedRoom ? (
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-blue-900">{selectedRoom.name}</h3>
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-blue-700">Room {selectedRoom.room_number}</p>
                  <p className="text-sm text-blue-700">Capacity: {selectedRoom.capacity} people</p>
                  <p className="text-sm text-blue-700">Purpose: {selectedRoom.purpose}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => handleRoomSelect(room)}
                      className="border border-gray-200 p-3 rounded-md cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{room.name}</h3>
                          <p className="text-sm text-gray-600">Room {room.room_number}</p>
                          <p className="text-sm text-gray-600">Capacity: {room.capacity}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          room.status === 'AVAILABLE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {room.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Booking Form */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookingForm.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="e.g., Team meeting, Class lecture"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingForm.start_datetime}
                    onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Available hours: 8:00 AM - 8:00 PM</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Hours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={bookingForm.duration_hours}
                      onChange={(e) => handleInputChange('duration_hours', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Minutes)
                    </label>
                    <select
                      value={bookingForm.duration_minutes}
                      onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>0</option>
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={45}>45</option>
                    </select>
                  </div>
                </div>

                {bookingForm.start_datetime && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">End Time:</span> {calculateEndDateTime()}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional information..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedRoom}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Booking...' : 'Book Room'}
                </button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
