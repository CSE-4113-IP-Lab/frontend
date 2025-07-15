import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { RoomService, type Room, type RoomBooking, type BookRoomRequest } from '@/services/roomService';

export default function RoomBookingTest() {
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [bookingForm, setBookingForm] = useState<BookRoomRequest>({
    room_id: 0,
    booking_date: '',
    start_time: '',
    end_time: '',
    purpose: '',
    notes: ''
  });

  // Set admin token for testing
  useEffect(() => {
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0YWhzaW5AeWFob28uY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUyNjgzMDc4fQ.zeCC41J16B2qVs8Uf6_WnDUwrcmT86ElyoZcxY75FG8';
    localStorage.setItem('accessToken', adminToken);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, bookingsData] = await Promise.all([
        RoomService.getAllRooms(),
        RoomService.getBookings()
      ]);
      setRooms(roomsData);
      setBookings(bookingsData);
      
      // Set first room as default
      if (roomsData.length > 0) {
        setBookingForm(prev => ({ ...prev, room_id: roomsData[0].id }));
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.room_id || !bookingForm.booking_date || !bookingForm.start_time || 
        !bookingForm.end_time || !bookingForm.purpose) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const booking = await RoomService.bookRoom(bookingForm);
      setSuccess(`Room booked successfully! Booking ID: ${booking.id}`);
      
      // Reset form
      setBookingForm({
        room_id: rooms[0]?.id || 0,
        booking_date: '',
        start_time: '',
        end_time: '',
        purpose: '',
        notes: ''
      });
      
      // Reload bookings
      const updatedBookings = await RoomService.getBookings();
      setBookings(updatedBookings);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to book room');
      console.error('Error booking room:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading room booking system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Room Booking System Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Book a Room</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <select
                    value={bookingForm.room_id}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, room_id: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.room_number} - {room.purpose} (Capacity: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <Input
                    type="date"
                    value={bookingForm.booking_date}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, booking_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <Input
                      type="time"
                      value={bookingForm.start_time}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, start_time: e.target.value }))}
                      step="1800" // 30 minutes
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <Input
                      type="time"
                      value={bookingForm.end_time}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, end_time: e.target.value }))}
                      step="1800" // 30 minutes
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <Input
                    type="text"
                    value={bookingForm.purpose}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="e.g., Team meeting, lecture, workshop"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <Textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-green-800 text-sm">{success}</p>
                  </div>
                )}
                
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Booking...' : 'Book Room'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Current Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Current Bookings ({bookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No bookings found</p>
                ) : (
                  bookings.map(booking => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">Booking #{booking.id}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          booking.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Room:</strong> {booking.room_id}</p>
                        <p><strong>Date:</strong> {booking.booking_date}</p>
                        <p><strong>Time:</strong> {booking.start_time} - {booking.end_time}</p>
                        <p><strong>Purpose:</strong> {booking.purpose}</p>
                        {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Rooms List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available Rooms ({rooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => (
                <div key={room.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{room.room_number}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Purpose:</strong> {room.purpose}</p>
                    <p><strong>Capacity:</strong> {room.capacity}</p>
                    <p><strong>Location:</strong> {room.location || 'N/A'}</p>
                    <p><strong>Operating Hours:</strong> {room.operating_start_time} - {room.operating_end_time}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' :
                      room.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
