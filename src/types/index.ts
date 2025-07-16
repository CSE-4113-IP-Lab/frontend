export interface Event {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  image: string;
  imageUrl?: string | null; // New field for actual event image
  bgColor: string;
  date: string; // Event date from backend
}

// Backend API Event interface
export interface BackendEvent {
  id: number;
  title: string;
  content: string;
  date: string;
  type: string;
  created_at: string;
  updated_at: string;
  attachments?: any[];
  participants?: any[];
}

export interface EventCardProps {
  event: Event;
  onRegister?: (eventId: number) => void;
  onUnregister?: (eventId: number) => void;
  isRegistered?: boolean;
  showRegistrationButton?: boolean;
}

export interface ExamScheduleItem {
  id: number;
  courseName: string;
  examDate: string;
  examTime: string;
  roomNo: string;
  level: "Undergraduate" | "Masters";
}

// New API response interface matching the API specification
export interface ExamScheduleResponse {
  course_id: number;
  exam_date: string;
  type: string;
  start_time: string;
  end_time: string;
  room: string;
  batch: string;
  semester: number;
  year: number;
  id: number;
  course: {
    name: string;
    course_code: string;
    program_id: number;
    teacher_id: number;
    credits: number;
    description: string;
    semester: number;
    year: number;
    batch: string;
    id: number;
  };
}

export interface ExamScheduleCreateRequest {
  course_id: number;
  exam_date: string;
  type: string;
  start_time: string;
  end_time: string;
  room: string;
  batch: string;
  semester: number;
  year: number;
}

export interface ExamScheduleFilters {
  program_id?: number;
  semester?: number;
  year?: number;
  batch?: string;
  type?: string;
  exam_date?: string;
  room?: string;
  course_id?: number;
  skip?: number;
  limit?: number;
}
export interface ClassScheduleItem {
  time: string;
  day: string;
  courseCode: string;
  courseName: string;
  batch: string;
  semester: string;
  instructor: string;
  room: string;
}

export interface ScheduleEntry {
  courseCode: string;
  courseName: string;
  batch: string;
  semester: string;
  instructor: string;
  room: string;
}

// Backend API response types
export interface ClassScheduleResponse {
  id: number;
  course_id: number;
  day_of_week: DayOfWeek;
  start_time: string; // Format: "HH:MM"
  end_time: string; // Format: "HH:MM"
  room?: string;
  batch?: string;
  semester?: number;
  year?: number;
  is_active: number;
  course?: CourseResponse;
}

export interface CourseResponse {
  id: number;
  name: string;
  course_code?: string;
  program_id: number;
  teacher_id?: number;
  credits: number;
  description?: string;
  semester?: number;
  year?: number;
  batch?: string;
}

export const DayOfWeek = {
  MONDAY: "monday",
  TUESDAY: "tuesday",
  WEDNESDAY: "wednesday",
  THURSDAY: "thursday",
  FRIDAY: "friday",
  SATURDAY: "saturday",
  SUNDAY: "sunday",
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export interface FilterState {
  batch: string;
  semester: string;
  year: string;
  room: string;
  day_of_week: string;
  program_id: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

// Notice/Post related types
export const PostType = {
  NOTICE: "notice",
  ANNOUNCEMENT: "announcement",
  EVENT: "event",
} as const;

export type PostType = (typeof PostType)[keyof typeof PostType];

export interface Post {
  id: number;
  type: PostType;
  title: string;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
  attachments: FileAttachment[];
}

export interface PostCreate {
  type: PostType;
  title: string;
  content: string;
  date: string;
}

export interface PostUpdate {
  type?: PostType;
  title?: string;
  content?: string;
  date?: string;
}

export interface FileAttachment {
  id: number;
  filename: string;
  url: string;
  size?: number;
  content_type?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export const UserRole = {
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
  STAFF: "staff",
  USER: "user",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Agent and Chat types
export type { ChatMessage, AgentResponse, ChatSession } from "./agent";
