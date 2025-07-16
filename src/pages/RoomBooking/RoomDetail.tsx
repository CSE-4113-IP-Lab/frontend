import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoomService, type Room, type WeeklySchedule, type DaySchedule } from "@/services/roomService";
import { Calendar, MapPin, Clock, Users, CheckCircle, XCircle, ArrowLeft, ShoppingCart } from "lucide-react";



export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- Multi-slot booking state ---
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
  const [multiBookingPurpose, setMultiBookingPurpose] = useState('');
  const [multiBookingNotes, setMultiBookingNotes] = useState('');
  const [multiBookingLoading, setMultiBookingLoading] = useState(false);
  const [multiBookingError, setMultiBookingError] = useState<string | null>(null);
  const [multiBookingSuccess, setMultiBookingSuccess] = useState<string | null>(null);
  const [showMultiBookingDialog, setShowMultiBookingDialog] = useState(false);

  // --- Single slot checkout state ---
  const [checkoutSlot, setCheckoutSlot] = useState<any | null>(null);
  const [checkoutPurpose, setCheckoutPurpose] = useState('');
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  const [room, setRoom] = useState<Room | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | null>(null);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [daySchedule, setDaySchedule] = useState<DaySchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRoomData();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDaySchedule();
    }
  }, [id, selectedDayOffset]);

  const fetchRoomData = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const [roomData, scheduleData] = await Promise.all([
        RoomService.getRoom(parseInt(id)),
        RoomService.getRoomWeeklySchedule(parseInt(id))
      ]);
      setRoom(roomData);
      setWeeklySchedule(scheduleData);
    } catch (err) {
      console.error('Error fetching room data:', err);
      setError('Failed to fetch room data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDaySchedule = async () => {
    if (!id) return;

    try {
      const schedule = await RoomService.getRoomDaySchedule(parseInt(id), selectedDayOffset);
      setDaySchedule(schedule);
    } catch (err) {
      console.error('Error fetching day schedule:', err);
      setError('Failed to fetch day schedule');
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      timeZone: 'Asia/Dhaka',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayName = (offset: number) => {
    const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));
    const date = new Date(today.getTime() + offset * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-BD', { 
      timeZone: 'Asia/Dhaka',
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Multi-slot booking functions
  const handleSlotSelection = (slot: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedSlots(prev => [...prev, slot]);
    } else {
      setSelectedSlots(prev => prev.filter(s => s.slot_time !== slot.slot_time));
    }
  };

  const handleMultiBookingSubmit = async () => {
    if (selectedSlots.length === 0 || !room || !daySchedule) return;
    
    setMultiBookingLoading(true);
    setMultiBookingError(null);
    setMultiBookingSuccess(null);
    
    try {
      const bookingPromises = selectedSlots.map(slot => {
        const bookingData = {
          room_id: room.id,
          booking_date: daySchedule.date,
          start_time: slot.slot_time,
          end_time: getNextSlotTime(slot.slot_time),
          purpose: multiBookingPurpose,
          notes: multiBookingNotes,
        };
        return RoomService.bookRoom(bookingData);
      });
      
      await Promise.all(bookingPromises);
      setMultiBookingSuccess(`Successfully booked ${selectedSlots.length} slots!`);
      
      setTimeout(() => {
        setShowMultiBookingDialog(false);
        setSelectedSlots([]);
        setMultiBookingPurpose('');
        setMultiBookingNotes('');
        setIsMultiMode(false);
        fetchDaySchedule();
      }, 1500);
    } catch (err: any) {
      setMultiBookingError(err?.response?.data?.detail || 'Multi-slot booking failed');
    } finally {
      setMultiBookingLoading(false);
    }
  };

  const toggleMultiMode = () => {
    setIsMultiMode(!isMultiMode);
    setSelectedSlots([]);
    setMultiBookingError(null);
    setMultiBookingSuccess(null);
  };

  function handleOpenCheckout(slot: any) {
    setCheckoutSlot(slot);
    setCheckoutPurpose('');
    setCheckoutNotes('');
    setCheckoutError(null);
    setCheckoutSuccess(null);
  }

  function getNextSlotTime(slotTime: string) {
    // slotTime: '09:00:00' => returns '09:30:00'
    const [h, m] = slotTime.split(':').map(Number);
    let minutes = h * 60 + m + 30;
    let nh = Math.floor(minutes / 60);
    let nm = minutes % 60;
    return `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}:00`;
  }

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkoutSlot || !room || !daySchedule) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);
    try {
      const bookingData = {
        room_id: room.id,
        booking_date: daySchedule.date,
        start_time: checkoutSlot.slot_time,
        end_time: getNextSlotTime(checkoutSlot.slot_time),
        purpose: checkoutPurpose,
        notes: checkoutNotes,
      };
      await RoomService.bookRoom(bookingData);
      setCheckoutSuccess('Booking successful!');
      setTimeout(() => {
        setCheckoutSlot(null);
        fetchDaySchedule();
      }, 1200);
    } catch (err: any) {
      setCheckoutError(err?.response?.data?.detail || 'Booking failed');
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Room not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/room-booking/available')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Rooms</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Room {room.room_number}</h1>
          </div>
        </div>
      </div>

      {/* Room Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Room Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">{room.room_number}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Purpose: {room.purpose}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Capacity: {room.capacity} people</span>
                </div>
                {room.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Location: {room.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Operating Hours: {formatTime(room.operating_start_time)} - {formatTime(room.operating_end_time)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  room.status === 'available' ? 'bg-green-100 text-green-800' :
                  room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {room.status}
                </span>
              </div>
              {room.description && (
                <p className="text-gray-600 text-sm">{room.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Select Date (Next 7 Days)</span>
            <div className="flex items-center space-x-2">
              {daySchedule && daySchedule.slots.some(slot => slot.is_available) && (
                <>
                  <Button
                    variant={isMultiMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleMultiMode}
                    className="flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{isMultiMode ? "Exit Multi-Select" : "Multi-Select"}</span>
                  </Button>
                  {isMultiMode && selectedSlots.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => setShowMultiBookingDialog(true)}
                      className="flex items-center space-x-2"
                    >
                      <span>Book {selectedSlots.length} Slots</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((offset) => (
              <Button
                key={offset}
                variant={selectedDayOffset === offset ? "default" : "outline"}
                className="p-3 h-auto flex flex-col"
                onClick={() => setSelectedDayOffset(offset)}
              >
                <span className="text-xs font-normal">
                  {offset === 0 ? "Today" : getDayName(offset)}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day Schedule Display */}
      {daySchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Schedule for {formatDate(daySchedule.date)}</span>
              <span className="text-sm font-normal text-gray-500">
                Room: {room.room_number}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {daySchedule.slots.map((slot, index) => {
                const isSelected = selectedSlots.some(s => s.slot_time === slot.slot_time);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 flex flex-col gap-2 ${
                      slot.is_available
                        ? isSelected && isMultiMode
                          ? "border-blue-500 bg-blue-50 cursor-pointer"
                          : isMultiMode
                          ? "border-green-200 bg-green-50 cursor-pointer hover:border-blue-300 hover:bg-blue-25"
                          : "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                    onClick={() => {
                      if (isMultiMode && slot.is_available) {
                        handleSlotSelection(slot, !isSelected);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {isMultiMode && slot.is_available && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by div onClick
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
                        />
                      )}
                      {slot.is_available ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {formatTime(slot.slot_time)}
                      </span>
                    </div>
                    <div className="text-xs">
                      {slot.is_available ? (
                        <span className="text-green-600 font-medium">Available</span>
                      ) : (
                        <span className="text-red-600">
                          Booked (ID: {slot.booking_id})
                        </span>
                      )}
                    </div>
                    {slot.is_available && !isMultiMode && (
                      <Button size="sm" className="mt-2" onClick={() => handleOpenCheckout(slot)}>
                        Book Slot
                      </Button>
                    )}
                  </div>
                );
              })}
      {/* Checkout Dialog */}
      <Dialog open={!!checkoutSlot} onOpenChange={() => setCheckoutSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Slot</DialogTitle>
          </DialogHeader>
          {checkoutSlot && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <div className="font-medium mb-1">Time: {formatTime(checkoutSlot.slot_time)} - {formatTime(getNextSlotTime(checkoutSlot.slot_time))}</div>
                <div className="text-sm text-gray-500 mb-2">Date: {daySchedule?.date}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purpose</label>
                <input type="text" value={checkoutPurpose} onChange={e => setCheckoutPurpose(e.target.value)} required className="w-full border px-3 py-2 rounded" placeholder="Purpose" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={checkoutNotes} onChange={e => setCheckoutNotes(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Notes (optional)" />
              </div>
              {checkoutError && <div className="text-red-600 text-sm">{checkoutError}</div>}
              {checkoutSuccess && <div className="text-green-600 text-sm">{checkoutSuccess}</div>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCheckoutSlot(null)} disabled={checkoutLoading}>Cancel</Button>
                <Button type="submit" disabled={checkoutLoading}>{checkoutLoading ? 'Booking...' : 'Confirm Booking'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Multi-Slot Booking Dialog */}
      <Dialog open={showMultiBookingDialog} onOpenChange={setShowMultiBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Multiple Slots</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Selected Slots ({selectedSlots.length}):</div>
              <div className="text-sm text-gray-600 space-y-1">
                {selectedSlots.map((slot, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{formatTime(slot.slot_time)} - {formatTime(getNextSlotTime(slot.slot_time))}</span>
                    <span>{daySchedule?.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purpose</label>
              <input 
                type="text" 
                value={multiBookingPurpose} 
                onChange={e => setMultiBookingPurpose(e.target.value)} 
                required 
                className="w-full border px-3 py-2 rounded" 
                placeholder="Purpose for all selected slots" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea 
                value={multiBookingNotes} 
                onChange={e => setMultiBookingNotes(e.target.value)} 
                className="w-full border px-3 py-2 rounded" 
                placeholder="Notes (optional, will apply to all slots)" 
              />
            </div>
            {multiBookingError && <div className="text-red-600 text-sm">{multiBookingError}</div>}
            {multiBookingSuccess && <div className="text-green-600 text-sm">{multiBookingSuccess}</div>}
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowMultiBookingDialog(false)} 
                disabled={multiBookingLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleMultiBookingSubmit} 
                disabled={multiBookingLoading || selectedSlots.length === 0 || !multiBookingPurpose.trim()}
              >
                {multiBookingLoading ? 'Booking...' : `Book ${selectedSlots.length} Slots`}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
            </div>

            {daySchedule.slots.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No time slots available for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Weekly Overview */}
      {weeklySchedule && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview - {weeklySchedule.room_number}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {weeklySchedule.week_schedule.map((day) => {
                const availableSlots = day.slots.filter(slot => slot.is_available).length;
                const totalSlots = day.slots.length;
                const bookedSlots = totalSlots - availableSlots;
                return (
                  <div key={day.day_offset} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      {getDayName(day.day_offset)}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">
                      {formatDate(day.date)}
                    </p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-green-600">Available:</span>
                        <span className="font-medium">{availableSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Booked:</span>
                        <span className="font-medium">{bookedSlots}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 text-xs"
                      onClick={() => setSelectedDayOffset(day.day_offset)}
                    >
                      View Details
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
