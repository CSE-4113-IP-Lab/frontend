# Class Schedule Role-Based Access Implementation

## Overview

This implementation adds comprehensive role-based access control to the class schedule feature, following the pattern established in the Assignments page. The system now supports different functionalities based on user roles: Admin, Faculty, and Student.

## Features Implemented

### 1. Role-Based Access Control

- **Admin**: Full CRUD operations on schedules, can create/edit/delete schedules
- **Faculty**: Can view personal teaching schedule and all public schedules
- **Student**: Can view personal class schedule and all public schedules

### 2. Updated Components

#### ClassSchedule.tsx (Main Component)

- Added role detection from localStorage
- Implemented view mode toggle for students/faculty (personal vs all schedules)
- Added admin tools section with create schedule button
- Updated API calls based on role and view mode:
  - Personal schedule: `/api/v1/class-schedules/my-schedule` (authenticated)
  - All schedules: `/api/v1/class-schedules` (admin) or `/api/v1/class-schedules/public` (public)
- Added admin action buttons (edit/delete) in both grid and list views
- Improved error handling and loading states
- Updated UI to match the design system used in other components

#### CreateSchedule.tsx (New Component)

- Admin-only component for creating new class schedules
- Form validation and error handling
- Integration with courses API for course selection
- Supports all schedule fields: course, day, time, room, batch, semester, year
- Protected route - redirects non-admin users

#### EditSchedule.tsx (New Component)

- Admin-only component for editing existing schedules
- Pre-populates form with existing schedule data
- Shows current schedule information for reference
- Full CRUD support with proper error handling
- Protected route - redirects non-admin users

### 3. API Integration

Updated scheduleService.ts to use correct environment variables and added proper authentication headers.

#### Supported APIs:

1. **GET /api/v1/class-schedules/public** - Public schedules with filters
2. **GET /api/v1/class-schedules/my-schedule** - Personal schedule (auth required)
3. **POST /api/v1/class-schedules** - Create schedule (admin only)
4. **GET /api/v1/class-schedules** - All schedules (admin only)
5. **GET /api/v1/class-schedules/{id}** - Get specific schedule
6. **PUT /api/v1/class-schedules/{id}** - Update schedule (admin only)
7. **DELETE /api/v1/class-schedules/{id}** - Delete schedule (admin only)

### 4. Routing Updates

Added new protected routes in router.tsx:

- `/schedule` - Main schedule page (public access)
- `/schedule/create` - Create new schedule (admin only)
- `/schedule/edit/:id` - Edit existing schedule (admin only)

### 5. UI/UX Improvements

- Consistent styling with the existing design system
- Role-based messaging and interface elements
- Proper loading states and error handling
- Responsive design for all screen sizes
- Admin action buttons integrated seamlessly into schedule displays

## File Structure

```
src/pages/Schedule/classSchedule/
├── ClassSchedule.tsx      # Main schedule component with role-based access
├── CreateSchedule.tsx     # Admin-only schedule creation
├── EditSchedule.tsx       # Admin-only schedule editing
├── FilterBar.tsx          # Existing filter component
├── ScheduleTable.tsx      # Existing table component
├── Statistics.tsx         # Existing statistics component
├── index.ts              # Component exports
└── data/
    └── scheduleData.ts   # Mock data
```

## Usage Examples

### For Students

- View personal class schedule with "My Schedule" button
- Switch to view all public schedules
- Filter by program, batch, semester, room, etc.
- View in grid or list format

### For Faculty

- Same as students, plus view their teaching schedule
- See which courses they're assigned to teach
- View room assignments and time slots

### For Admins

- All student/faculty features
- Create new schedule entries
- Edit existing schedules
- Delete outdated schedules
- Manage complete schedule system

## Security Features

- Route protection using ProtectedRoute components
- Token-based authentication for API calls
- Role verification before allowing admin operations
- Proper error handling for unauthorized access

## API Response Format

```typescript
interface ClassScheduleResponse {
  id: number;
  course_id: number;
  day_of_week: DayOfWeek;
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  room?: string;
  batch?: string;
  semester?: number;
  year?: number;
  is_active: number;
  course?: CourseResponse;
}
```

## Integration Notes

- The implementation follows the same patterns as the Assignments page
- Uses the existing Card and Button components for consistency
- Integrates with the current authentication system
- Supports the existing filter and view toggle functionality
- Maintains backward compatibility with existing schedule data

This implementation provides a complete role-based schedule management system that scales from basic viewing for students to full administrative control for admins.
