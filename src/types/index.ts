export interface Event {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  image: string;
  bgColor: string;
}

export interface EventCardProps {
  event: Event;
}


export interface ExamScheduleItem {
  id: number;
  courseName: string;
  examDate: string;
  examTime: string;
  roomNo: string;
  level: "Undergraduate" | "Masters";
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

export interface FilterState {
  batch: string;
  semester: string;
  level: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}