import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoomService, type Room, type WeeklySchedule, type DaySchedule } from "@/services/roomService";
import { Calendar, MapPin, Clock, Users, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function RoomScheduleCalendar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomIdParam = searchParams.get('roomId');
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
    roomIdParam ? parseInt(roomIdParam) : null
  );
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | null>(null);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [daySchedule, setDaySchedule] = useState<DaySchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await RoomService.getAllRooms();
        setRooms(roomsData);
        
        // If no room selected and rooms available, select first room
        if (!selectedRoomId && roomsData.length > 0) {
          setSelectedRoomId(roomsData[0].id);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to fetch rooms');
      }
    };

    fetchRooms();
  }, [selectedRoomId]);

  // Fetch weekly schedule when room is selected
  useEffect(() => {
    if (selectedRoomId) {
      fetchWeeklySchedule();
    }
  }, [selectedRoomId]);

  // Fetch specific day schedule when day offset changes
  useEffect(() => {
    if (selectedRoomId) {
      fetchDaySchedule();
    }
  }, [selectedRoomId, selectedDayOffset]);

  const fetchWeeklySchedule = async () => {
    if (!selectedRoomId) return;

    setLoading(true);
    setError(null);
    try {
      const schedule = await RoomService.getRoomWeeklySchedule(selectedRoomId);
      setWeeklySchedule(schedule);
    } catch (err) {
      console.error('Error fetching weekly schedule:', err);
      setError('Failed to fetch weekly schedule');
    } finally {
      setLoading(false);
    }
  };

  const fetchDaySchedule = async () => {
    if (!selectedRoomId) return;

    setLoading(true);
    setError(null);
    try {
      const schedule = await RoomService.getRoomDaySchedule(selectedRoomId, selectedDayOffset);
      setDaySchedule(schedule);
    } catch (err) {
      console.error('Error fetching day schedule:', err);
      setError('Failed to fetch day schedule');
    } finally {
      setLoading(false);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayName = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const selectedRoom = rooms.find(room => room.id === selectedRoomId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/resources/faculty')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Resources</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Room Schedule Calendar</h1>
          </div>
        </div>
      </div>

      {/* Room Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Select Room</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedRoomId?.toString() || ""}
            onValueChange={(value) => setSelectedRoomId(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a room to view schedule" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id.toString()}>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{room.room_number}</span>
                    <span className="text-gray-500">- {room.purpose}</span>
                    <span className="text-sm text-gray-400">
                      <Users className="h-3 w-3 inline mr-1" />
                      {room.capacity}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRoom && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg">{selectedRoom.room_number}</h3>
              <p className="text-gray-600">{selectedRoom.purpose}</p>
              <div className="mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Capacity: {selectedRoom.capacity}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {selectedRoom.operating_start_time} - {selectedRoom.operating_end_time}
                  </span>
                  {selectedRoom.location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedRoom.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day Selection */}
      {selectedRoomId && (
        <Card>
          <CardHeader>
            <CardTitle>Select Date (Next 7 Days)</CardTitle>
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
      )}

      {/* Loading and Error States */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading schedule...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day Schedule Display */}
      {!loading && !error && daySchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Schedule for {formatDate(daySchedule.date)}</span>
              <span className="text-sm font-normal text-gray-500">
                Room: {selectedRoom?.room_number}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {daySchedule.slots.map((slot, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                    slot.is_available
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
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
                </div>
              ))}
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

      {/* Weekly Overview (if weekly schedule is loaded) */}
      {!loading && !error && weeklySchedule && (
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
