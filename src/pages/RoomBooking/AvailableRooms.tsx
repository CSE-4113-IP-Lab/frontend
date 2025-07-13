import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Card from '../../components/Card';
import { RoomService, type Room, type AvailableRoomsParams, type BookRoomRequest } from '../../services/roomService';
import { setTestToken } from '../../utils/auth';

interface AvailableRoomsProps {}

const AvailableRooms: React.FC<AvailableRoomsProps> = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<AvailableRoomsParams>({
    start_datetime: '',
    end_datetime: '',
    purpose: '',
    capacity: undefined
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingData, setBookingData] = useState<BookRoomRequest>({
    room_id: 0,
    purpose: '',
    start_datetime: '',
    duration_hours: 1,
    duration_minutes: 0,
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Load all rooms on component mount
  useEffect(() => {
    // Set test token for development
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0YWhzaW5AaG90LmNvbSIsInJvbGUiOiJmYWN1bHR5IiwiZXhwIjoxNzUyNDU2NDc1fQ.PhzVW9ot9OwU-eZBa1ymjC53ZRc8f6m2-sJyhRPhS5s';
    localStorage.setItem('accessToken', testToken);
    
    loadAllRooms();
  }, []);

  const loadAllRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await RoomService.getAllRooms({ 
        skip: 0, 
        limit: 100
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
    if (!searchParams.start_datetime || !searchParams.end_datetime) {
      alert('Please select both start and end date/time');
      return;
    }

    try {
      setLoading(true);
      const availableRooms = await RoomService.getAvailableRooms(searchParams);
      setRooms(availableRooms);
      setError(null);
    } catch (err) {
      setError('Failed to search available rooms');
      console.error('Error searching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AvailableRoomsParams, value: string | number | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openBookingModal = (room: Room) => {
    setSelectedRoom(room);
    setBookingData(prev => ({
      ...prev,
      room_id: room.id
    }));
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
    setBookingData({
      room_id: 0,
      purpose: '',
      start_datetime: '',
      duration_hours: 1,
      duration_minutes: 0,
      notes: ''
    });
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.purpose || !bookingData.start_datetime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setBookingLoading(true);
      await RoomService.bookRoom(bookingData);
      alert('Room booked successfully!');
      closeBookingModal();
      // Refresh the room list
      loadAllRooms();
    } catch (err) {
      alert('Failed to book room. Please try again.');
      console.error('Error booking room:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBookingInputChange = (field: keyof BookRoomRequest, value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Rooms</h1>
          <div className="flex justify-center">
            <div className="text-lg">Loading rooms...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Rooms</h1>
        
        {/* Search Filters */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Search Available Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={searchParams.start_datetime}
                  onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={searchParams.end_datetime}
                  onChange={(e) => handleInputChange('end_datetime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Meeting, Class"
                  value={searchParams.purpose || ''}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Capacity (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 20"
                  value={searchParams.capacity || ''}
                  onChange={(e) => handleInputChange('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-4">
              <button
                onClick={searchAvailableRooms}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search Available Rooms
              </button>
              <button
                onClick={loadAllRooms}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Show All Rooms
              </button>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                    <p className="text-sm text-gray-600">Room {room.room_number}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    room.status === 'AVAILABLE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {room.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Capacity:</span> {room.capacity} people
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Purpose:</span> {room.purpose}
                  </p>
                  {room.location && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {room.location}
                    </p>
                  )}
                  {room.description && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Description:</span> {room.description}
                    </p>
                  )}
                </div>

                {/* Available Slots */}
                {room.available_slots && room.available_slots.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Today's Available Slots:</h4>
                    <div className="space-y-1">
                      {room.available_slots.slice(0, 3).map((slot, index) => (
                        <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {formatDateTime(slot.start_datetime)} - {formatDateTime(slot.end_datetime)}
                        </div>
                      ))}
                      {room.available_slots.length > 3 && (
                        <p className="text-xs text-gray-500">+ {room.available_slots.length - 3} more slots</p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => openBookingModal(room)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={room.status !== 'AVAILABLE'}
                >
                  {room.status === 'AVAILABLE' ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No rooms found</div>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Book Room: {selectedRoom.room_number}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <input
                  type="text"
                  value={bookingData.purpose}
                  onChange={(e) => handleBookingInputChange('purpose', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Meeting, Class, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.start_datetime}
                  onChange={(e) => handleBookingInputChange('start_datetime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={bookingData.duration_hours}
                    onChange={(e) => handleBookingInputChange('duration_hours', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minutes
                  </label>
                  <select
                    value={bookingData.duration_minutes}
                    onChange={(e) => handleBookingInputChange('duration_minutes', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>0</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={45}>45</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={bookingData.notes || ''}
                  onChange={(e) => handleBookingInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Additional notes (optional)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeBookingModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={bookingLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : 'Book Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableRooms;
