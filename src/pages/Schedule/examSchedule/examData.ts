import type { ExamScheduleItem } from "../../../types";

export const examData: ExamScheduleItem[] = [
  {
    id: 1,
    courseName: "Data Structure and Algorithm",
    examDate: "2024-05-15",
    examTime: "10:00 AM",
    roomNo: "Room 201",
    level: "Undergraduate"
  },
  {
    id: 2,
    courseName: "Distributed Systems",
    examDate: "2024-05-24",
    examTime: "2:00 PM",
    roomNo: "Room 210",
    level: "Masters"
  },
  // Add remaining entries with level: "Undergraduate" or "Masters"
];
