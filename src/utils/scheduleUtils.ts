import type { ClassScheduleResponse, ScheduleEntry, TimeSlot } from "../types";

// Convert backend day format to display format
export const dayMap: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const reverseDayMap: Record<string, string> = {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
};

// Convert 24-hour time to 12-hour display format
export function formatTime(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

// Convert 12-hour time to 24-hour format
export function parseTime(time: string): string {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return time;

  const [, hour, minute, period] = match;
  let hourNum = parseInt(hour);

  if (period.toUpperCase() === "PM" && hourNum !== 12) {
    hourNum += 12;
  } else if (period.toUpperCase() === "AM" && hourNum === 12) {
    hourNum = 0;
  }

  return `${hourNum.toString().padStart(2, "0")}:${minute}`;
}

// Generate time slots for display
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour < 18; hour++) {
    const start = formatTime(`${hour}:00`);
    const end = formatTime(`${hour + 1}:00`);
    slots.push({ start, end });
  }
  return slots;
}

// Transform backend schedule data to frontend format
export function transformScheduleData(
  schedules: ClassScheduleResponse[]
): Record<string, Record<string, ScheduleEntry>> {
  const result: Record<string, Record<string, ScheduleEntry>> = {};

  schedules.forEach((schedule) => {
    const startTime = formatTime(schedule.start_time);
    const endTime = formatTime(schedule.end_time);
    const timeKey = `${startTime}-${endTime}`;
    const dayName = dayMap[schedule.day_of_week] || schedule.day_of_week;

    if (!result[timeKey]) {
      result[timeKey] = {};
    }

    result[timeKey][dayName] = {
      courseCode:
        schedule.course?.course_code || `COURSE-${schedule.course_id}`,
      courseName: schedule.course?.name || "Unknown Course",
      batch: schedule.batch || "N/A",
      semester: schedule.semester?.toString() || "N/A",
      instructor: "TBA", // This would need to be fetched from course.teacher relation
      room: schedule.room || "TBA",
    };
  });

  return result;
}

// Get unique values from schedule data for filters
export function getUniqueValuesFromSchedules(
  schedules: ClassScheduleResponse[],
  field: "batch" | "semester" | "year" | "room"
): string[] {
  const values = schedules
    .map((schedule) => {
      switch (field) {
        case "batch":
          return schedule.batch;
        case "semester":
          return schedule.semester?.toString();
        case "year":
          return schedule.year?.toString();
        case "room":
          return schedule.room;
        default:
          return undefined;
      }
    })
    .filter(Boolean) as string[];

  return Array.from(new Set(values)).sort();
}

// Get unique days from schedule data
export function getUniqueDays(schedules: ClassScheduleResponse[]): string[] {
  const days = schedules
    .map((schedule) => dayMap[schedule.day_of_week] || schedule.day_of_week)
    .filter(Boolean);

  const uniqueDays = Array.from(new Set(days));

  // Sort by day order
  const dayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return uniqueDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
}

// Export schedule to PDF
export async function exportScheduleToPDF(
  scheduleData: Record<string, Record<string, ScheduleEntry>>,
  timeSlots: TimeSlot[],
  days: string[]
) {
  const jsPDF = (await import("jspdf")).default;
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add title
  doc.setFontSize(16);
  doc.text("Class Schedule - CSE Department, University of Dhaka", 15, 15);

  // Prepare table data
  const head = [["Time", ...days]];
  const body = timeSlots.map(({ start, end }) => {
    const timeKey = `${start}-${end}`;
    return [
      `${start}\n${end}`,
      ...days.map((day) => {
        const entry = scheduleData[timeKey]?.[day];
        return entry
          ? `${entry.courseCode}\n${entry.courseName}\nBatch ${entry.batch} • Sem ${entry.semester}\n${entry.instructor}\n${entry.room}`
          : "No class";
      }),
    ];
  });

  autoTable(doc, {
    head,
    body,
    startY: 25,
    styles: {
      cellWidth: "wrap",
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Time column
    },
    margin: { top: 25, left: 10, right: 10 },
  });

  doc.save("class_schedule.pdf");
}
