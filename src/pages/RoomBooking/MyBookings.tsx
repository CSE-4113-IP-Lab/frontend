import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { RoomService, type RoomBooking, type RoomBookingsParams } from '../../services/roomService';
import { useAuth } from '../../contexts/AuthContext';

interface MyBookingsProps {}

const MyBookings: React.FC<MyBookingsProps> = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});
  
  const [filters, setFilters] = useState<RoomBookingsParams>({
    status: undefined,
    limit: 50
  });

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadBookings();
    }
  }, [filters, isAuthenticated, user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await RoomService.getBookings(filters);
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      await RoomService.cancelBooking(bookingId);
      
      // Update the booking status locally
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to cancel booking';
      setError(errorMessage);
      console.error('Error cancelling booking:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'ONGOING':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const canCancelBooking = (booking: RoomBooking) => {
    return booking.status === 'scheduled';
  };

  const isUpcoming = (booking: RoomBooking) => {
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    return bookingDateTime > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
          <div className="flex justify-center">
            <div className="text-lg">Loading bookings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        
        {/* Filters */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Filter Bookings</h2>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    status: (e.target.value as 'scheduled' | 'ongoing' | 'completed' | 'cancelled') || undefined 
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={loadBookings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.room?.room_number || `Room ID: ${booking.room_id}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Room {booking.room?.room_number || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Booking ID: #{booking.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isUpcoming(booking) && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Upcoming
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Purpose:</span> {booking.purpose}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Start:</span> {formatDateTime(`${booking.booking_date}T${booking.start_time}`)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">End:</span> {formatDateTime(`${booking.booking_date}T${booking.end_time}`)}
                    </p>
                  </div>
                  
                  <div>
                    {booking.room && (
                      <>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Capacity:</span> {booking.room.capacity} people
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Room Purpose:</span> {booking.room.purpose}
                        </p>
                      </>
                    )}
                    {booking.approved_by_name && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Approved by:</span> {booking.approved_by_name}
                      </p>
                    )}
                  </div>
                </div>

                {booking.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Booked on {formatDateTime(booking.created_at)}
                  </div>
                  
                  <div className="flex gap-2">
                    {canCancelBooking(booking) && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={actionLoading[booking.id]}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[booking.id] ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => window.location.href = `/room-booking/booking/${booking.id}`}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {bookings.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No bookings found</div>
            <p className="text-gray-400 mt-2">You haven't made any room bookings yet</p>
            <button
              onClick={() => window.location.href = '/room-booking/book'}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Book a Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
