# Room Booking System

This directory contains the frontend components for the Room Booking System that connects to the FastAPI backend.

## Components

### 1. RoomBookingDashboard
- **File**: `RoomBookingDashboard.tsx`
- **Route**: `/room-booking`
- **Description**: Main dashboard with navigation cards for room booking features
- **Features**:
  - Navigation to Available Rooms
  - Navigation to Book Room
  - Navigation to My Bookings

### 2. AvailableRooms
- **File**: `AvailableRooms.tsx`
- **Route**: `/room-booking/available`
- **Description**: Browse and search available rooms
- **Features**:
  - View all available rooms
  - Search rooms by date/time range
  - Filter by purpose and capacity
  - View room details and available time slots
  - Direct booking links

### 3. BookRoom
- **File**: `BookRoom.tsx`
- **Route**: `/room-booking/book`
- **Description**: Book a room for specific time periods
- **Access**: Faculty and Admin only (protected route)
- **Features**:
  - Room selection interface
  - Date/time picker with validation
  - Duration selection (hours + minutes)
  - Purpose and notes input
  - Real-time conflict checking
  - Booking confirmation

### 4. MyBookings
- **File**: `MyBookings.tsx`
- **Route**: `/room-booking/my-bookings`
- **Description**: View and manage personal room bookings
- **Features**:
  - List all user bookings
  - Filter by booking status
  - Cancel upcoming bookings
  - View booking details
  - Status indicators (Pending, Scheduled, Ongoing, etc.)

## API Integration

### Service Layer
- **File**: `roomService.ts`
- **Description**: TypeScript service layer for API communication
- **Features**:
  - Full CRUD operations for rooms
  - Booking management
  - Room availability search
  - Time slot queries
  - Proper error handling

### API Endpoints Used
- `GET /api/v1/rooms/` - Get all rooms
- `GET /api/v1/rooms/{id}` - Get specific room
- `POST /api/v1/rooms/` - Create room (Admin only)
- `PUT /api/v1/rooms/{id}` - Update room (Admin only)
- `GET /api/v1/rooms/available/search` - Search available rooms
- `GET /api/v1/rooms/{id}/slots` - Get room time slots
- `POST /api/v1/rooms/book` - Book a room
- `GET /api/v1/rooms/bookings/` - Get user bookings
- `PUT /api/v1/rooms/bookings/{id}/cancel` - Cancel booking
- `PUT /api/v1/rooms/bookings/{id}/approve` - Approve booking (Admin only)

## Types and Interfaces

### Room Types
```typescript
interface Room {
  id: number;
  room_number: string;
  name: string;
  capacity: number;
  purpose: string;
  location?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OUT_OF_ORDER';
  description?: string;
  available_slots?: TimeSlotInfo[];
}
```

### Booking Types
```typescript
interface RoomBooking {
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
}
```

## Navigation

The room booking system is integrated into the main navigation:
- **Navbar**: Added "ROOM BOOKING" link
- **Routes**: All routes properly configured with authentication protection

## Access Control

- **Available Rooms**: Public access (all authenticated users)
- **Book Room**: Faculty and Admin only (FacultyRoute protection)
- **My Bookings**: All authenticated users (own bookings only)
- **Room Management**: Admin only (handled by backend API)

## Usage

1. **To view available rooms**: Navigate to `/room-booking/available`
2. **To book a room**: Navigate to `/room-booking/book` (requires Faculty/Admin role)
3. **To view bookings**: Navigate to `/room-booking/my-bookings`
4. **Dashboard**: Start at `/room-booking` for quick navigation

## Features

- ✅ Real-time room availability checking
- ✅ Time slot conflict detection  
- ✅ Operating hours validation (8 AM - 8 PM)
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Error handling and user feedback
- ✅ Loading states and transitions
- ✅ Form validation
- ✅ Status management (Pending, Scheduled, etc.)
- ✅ Booking cancellation
- ✅ Admin approval workflow
