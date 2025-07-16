import { apiClient } from './apiClient';

// Updated Room Types for new slot-based system
export interface Room {
  id: number;
  room_number: string;
  purpose: string;
  capacity: number;
  location?: string;
  description?: string;
  status: 'available' | 'maintenance' | 'occupied';
  operating_start_time: string;
  operating_end_time: string;
  created_at: string;
  updated_at: string;
  weekly_schedule?: WeeklySchedule;
}

export interface RoomTimeSlot {
  day_offset: number;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  booking_id?: number;
}

export interface DaySchedule {
  day_offset: number;
  date: string;
  slots: RoomTimeSlot[];
}

export interface WeeklySchedule {
  room_id: number;
  room_number: string;
  week_schedule: DaySchedule[];
}

export interface RoomCreateInput {
  room_number: string;
  purpose: string;
  capacity: number;
  location?: string;
  description?: string;
  status?: 'available' | 'maintenance' | 'occupied';
  operating_start_time?: string;
  operating_end_time?: string;
}

export interface RoomUpdateInput {
  room_number?: string;
  purpose?: string;
  capacity?: number;
  location?: string;
  description?: string;
  status?: 'available' | 'maintenance' | 'occupied';
  operating_start_time?: string;
  operating_end_time?: string;
}

// Updated Booking Types for new slot-based system
export interface RoomBooking {
  id: number;
  room_id: number;
  user_id: number;
  purpose: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_slots: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  approved_by_id?: number;
  approved_at?: string;
  room?: Partial<Room>;
  user_name?: string;
  approved_by_name?: string;
}

export interface BookRoomRequest {
  room_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  notes?: string;
}

export interface AvailableRoomsRequest {
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose?: string;
  capacity?: number;
}

export interface AvailableRoom {
  id: number;
  room_number: string;
  purpose: string;
  capacity: number;
  location?: string;
  description?: string;
}

export interface AvailableRoomsResponse {
  booking_date: string;
  start_time: string;
  end_time: string;
  available_rooms: AvailableRoom[];
}

export interface SystemStatus {
  total_rooms: number;
  available_rooms: number;
  today_bookings: number;
  current_date: string;
  system_time: string;
  today?: {
    total_slots: number;
    booked_slots: number;
    available_slots: number;
    utilization_percent: number;
  };
  week?: {
    total_slots: number;
    booked_slots: number;
    available_slots: number;
    utilization_percent: number;
  };
  active_bookings: number;
}

export interface RoomBookingsParams {
  skip?: number;
  limit?: number;
  room_id?: number;
  user_id?: number;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  booking_date?: string;
}

// Updated Room Service Class
export class RoomService {
  // Room Management
  static async getAllRooms(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    purpose?: string;
    include_schedule?: boolean;
  }): Promise<Room[]> {
    const queryParams = {
      skip: params?.skip || 0,
      limit: params?.limit || 100,
      include_schedule: params?.include_schedule || false,
      ...(params?.status && { status: params.status }),
      ...(params?.purpose && { purpose: params.purpose })
    };
    
    const response = await apiClient.get('/rooms/', { params: queryParams });
    return response.data;
  }

  static async getRoom(roomId: number, includeSchedule: boolean = true): Promise<Room> {
    const response = await apiClient.get(`/rooms/${roomId}`, {
      params: { include_schedule: includeSchedule }
    });
    return response.data;
  }

  static async createRoom(roomData: RoomCreateInput): Promise<Room> {
    const response = await apiClient.post('/rooms/', roomData);
    return response.data;
  }

  static async updateRoom(roomId: number, roomData: RoomUpdateInput): Promise<Room> {
    const response = await apiClient.put(`/rooms/${roomId}`, roomData);
    return response.data;
  }

  static async deleteRoom(roomId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/rooms/${roomId}`);
    return response.data;
  }

  // Schedule Management
  static async getRoomWeeklySchedule(roomId: number): Promise<WeeklySchedule> {
    const response = await apiClient.get(`/rooms/${roomId}/schedule`);
    return response.data;
  }

  static async getRoomDaySchedule(roomId: number, dayOffset: number): Promise<DaySchedule> {
    const response = await apiClient.get(`/rooms/${roomId}/schedule/${dayOffset}`);
    return response.data;
  }

  // Room Search & Booking
  static async searchAvailableRooms(searchRequest: AvailableRoomsRequest): Promise<AvailableRoomsResponse> {
    const response = await apiClient.post('/rooms/search/available', searchRequest);
    return response.data;
  }

  static async bookRoom(bookingData: BookRoomRequest): Promise<RoomBooking> {
    const response = await apiClient.post('/rooms/book', bookingData);
    return response.data;
  }

  // Booking Management
  static async getBookings(params?: RoomBookingsParams): Promise<RoomBooking[]> {
    const response = await apiClient.get('/rooms/bookings/', { params });
    return response.data;
  }

  static async getBooking(bookingId: number): Promise<RoomBooking> {
    const response = await apiClient.get(`/rooms/bookings/${bookingId}`);
    return response.data;
  }

  static async cancelBooking(bookingId: number): Promise<{ message: string }> {
    const response = await apiClient.put(`/rooms/bookings/${bookingId}/cancel`);
    return response.data;
  }

  // Admin Utilities
  static async initializeAllSlots(): Promise<{ success: boolean; message: string; rooms_processed: number }> {
    const response = await apiClient.post('/rooms/admin/initialize-all-slots');
    return response.data;
  }

  static async rollDailySlots(): Promise<{ success: boolean; message: string; deleted_slots: number; new_slots: number }> {
    const response = await apiClient.post('/rooms/admin/roll-daily-slots');
    return response.data;
  }

  static async cleanupExpiredBookings(): Promise<{ success: boolean; message: string; cleaned_bookings: number }> {
    const response = await apiClient.post('/rooms/admin/cleanup-expired-bookings');
    return response.data;
  }

  static async getSlotStatistics(): Promise<{
    today: {
      total_slots: number;
      booked_slots: number;
      available_slots: number;
      utilization_percent: number;
    };
    week: {
      total_slots: number;
      booked_slots: number;
      available_slots: number;
      utilization_percent: number;
    };
    active_bookings: number;
  }> {
    const response = await apiClient.get('/rooms/admin/slot-statistics');
    return response.data;
  }

  static async validateSlots(): Promise<{
    valid: boolean;
    issues: string[];
    orphaned_slots: number;
    invalid_booking_refs: number;
    bookings_without_slots: number;
  }> {
    const response = await apiClient.get('/rooms/admin/validate-slots');
    return response.data;
  }

  static async getSystemStatus(): Promise<SystemStatus> {
    const response = await apiClient.get('/rooms/admin/system-status');
    return response.data;
  }

  // Helper methods
  static formatTime(time: string): string {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  static getNextAvailableSlots(schedule: WeeklySchedule, count: number = 5): Array<{
    date: string;
    time: string;
    room_id: number;
    room_number: string;
  }> {
    const availableSlots: Array<{
      date: string;
      time: string;
      room_id: number;
      room_number: string;
    }> = [];

    for (const daySchedule of schedule.week_schedule) {
      for (const slot of daySchedule.slots) {
        if (slot.is_available && availableSlots.length < count) {
          availableSlots.push({
            date: slot.slot_date,
            time: slot.slot_time,
            room_id: schedule.room_id,
            room_number: schedule.room_number
          });
        }
      }
    }

    return availableSlots;
  }

  // Get today's bookings count for a specific user
  static async getTodayBookingsCount(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await this.getBookings({
      booking_date: today,
      status: 'scheduled'
    });
    return bookings.length;
  }

  // Get user's upcoming bookings (next 7 days)
  static async getUpcomingBookings(limit: number = 10): Promise<RoomBooking[]> {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await this.getBookings({
      limit,
      status: 'scheduled'
    });
    
    // Filter bookings from today onwards
    return bookings.filter(booking => booking.booking_date >= today);
  }
}

export default RoomService;
