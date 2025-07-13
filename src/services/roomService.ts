import { apiClient } from './apiClient';

// Room Types
export interface Room {
  id: number;
  room_number: string;
  name: string;
  capacity: number;
  purpose: string;
  location?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OUT_OF_ORDER';
  description?: string;
  available_slots?: TimeSlotInfo[];
  created_at: string;
  updated_at: string;
}

export interface RoomCreateInput {
  room_number: string;
  name: string;
  capacity: number;
  purpose: string;
  location?: string;
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OUT_OF_ORDER';
  description?: string;
}

export interface RoomUpdateInput {
  room_number?: string;
  name?: string;
  capacity?: number;
  purpose?: string;
  location?: string;
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OUT_OF_ORDER';
  description?: string;
}

// Booking Types
export interface RoomBooking {
  id: number;
  room_id: number;
  user_id: number;
  purpose: string;
  start_datetime: string;
  end_datetime: string;
  status: 'PENDING' | 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  approved_by_id?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  room?: Room;
  user_name?: string;
  approved_by_name?: string;
}

export interface BookRoomRequest {
  room_id: number;
  purpose: string;
  start_datetime: string;
  duration_hours: number;
  duration_minutes: number;
  notes?: string;
}

export interface TimeSlotInfo {
  start_datetime: string;
  end_datetime: string;
  is_available: boolean;
}

export interface AvailableRoomsParams {
  start_datetime: string;
  end_datetime: string;
  purpose?: string;
  capacity?: number | undefined;
}

export interface RoomBookingsParams {
  skip?: number;
  limit?: number;
  room_id?: number;
  user_id?: number;
  status?: 'PENDING' | 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

// Room Service Class
export class RoomService {
  // Room Management
  static async getAllRooms(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    purpose?: string;
  }): Promise<Room[]> {
    // Set default parameters
    const queryParams = {
      skip: params?.skip || 0,
      limit: params?.limit || 100,
      ...(params?.status && { status: params.status }),
      ...(params?.purpose && { purpose: params.purpose })
    };
    
    const response = await apiClient.get('/rooms/', { params: queryParams });
    return response.data;
  }

  static async getRoom(roomId: number): Promise<Room> {
    const response = await apiClient.get(`/rooms/${roomId}`);
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

  // Room Availability
  static async getAvailableRooms(params: AvailableRoomsParams): Promise<Room[]> {
    const response = await apiClient.get('/rooms/available/search', { params });
    return response.data;
  }

  static async getRoomSlots(roomId: number, date: string): Promise<{
    room_id: number;
    date: string;
    available_slots: TimeSlotInfo[];
  }> {
    const response = await apiClient.get(`/rooms/${roomId}/slots`, {
      params: { date }
    });
    return response.data;
  }

  // Booking Management
  static async bookRoom(bookingData: BookRoomRequest): Promise<RoomBooking> {
    const response = await apiClient.post('/rooms/book', bookingData);
    return response.data;
  }

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

  static async approveBooking(bookingId: number): Promise<{ message: string }> {
    const response = await apiClient.put(`/rooms/bookings/${bookingId}/approve`);
    return response.data;
  }
}

export default RoomService;
