import type { ScheduleEntry } from "../../../../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const timeSlots = [
  { start: '8:00 AM', end: '9:00 AM' },
  { start: '9:00 AM', end: '10:00 AM' },
  { start: '10:00 AM', end: '11:00 AM' },
  { start: '11:00 AM', end: '12:00 PM' },
  { start: '12:00 PM', end: '1:00 PM' },
  { start: '1:00 PM', end: '2:00 PM' },
  { start: '2:00 PM', end: '3:00 PM' },
  { start: '3:00 PM', end: '4:00 PM' },
  { start: '4:00 PM', end: '5:00 PM' },
  { start: '5:00 PM', end: '6:00 PM' },
];

export const days = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const exportScheduleToPDF = (scheduleData: Record<string, Record<string, ScheduleEntry>>) => {
  const doc = new jsPDF();
  const head = [["Time", ...days]];

  const body = timeSlots.map(({ start, end }) => {
    const timeKey = `${start}-${end}`;
    return [
      `${start} - ${end}`,
      ...days.map(day => {
        const entry = scheduleData[timeKey]?.[day];
        return entry
          ? `${entry.courseCode}\n${entry.courseName}\nBatch ${entry.batch} • Sem ${entry.semester}\n${entry.instructor}\n${entry.room}`
          : "No class";
      })
    ];
  });

  autoTable(doc, {
    head,
    body,
    styles: { cellWidth: 'wrap' },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { top: 20 },
  });

  doc.save("class_schedule.pdf");
};

export const fullScheduleData: Record<string, Record<string, ScheduleEntry>> = {
  '8:00 AM-9:00 AM': {
    'Sunday': {
      courseCode: 'CSE 101',
      courseName: 'Programming Fundamentals',
      batch: '2023',
      semester: '1',
      instructor: 'Dr. Smith',
      room: 'Room 301'
    },
    'Monday': {
      courseCode: 'CSE 102',
      courseName: 'Data Structures',
      batch: '2022',
      semester: '2',
      instructor: 'Dr. Johnson',
      room: 'Room 302'
    },
    'Tuesday': {
      courseCode: 'CSE 103',
      courseName: 'Algorithms',
      batch: '2023',
      semester: '1',
      instructor: 'Dr. Williams',
      room: 'Room 303'
    },
    'Wednesday': {
      courseCode: 'CSE 104',
      courseName: 'Database Systems',
      batch: '2021',
      semester: '3',
      instructor: 'Dr. Brown',
      room: 'Room 304'
    },
    'Thursday': {
      courseCode: 'CSE 105',
      courseName: 'Operating Systems',
      batch: '2022',
      semester: '2',
      instructor: 'Dr. Davis',
      room: 'Room 305'
    },
    'Friday': {
      courseCode: 'CSE 106',
      courseName: 'Computer Networks',
      batch: '2020',
      semester: '4',
      instructor: 'Dr. Miller',
      room: 'Room 306'
    },
    'Saturday': {
      courseCode: 'CSE 107',
      courseName: 'Software Engineering',
      batch: '2023',
      semester: '1',
      instructor: 'Dr. Wilson',
      room: 'Room 307'
    }
  },
  '9:00 AM-10:00 AM': {
    'Sunday': {
      courseCode: 'CSE 108',
      courseName: 'Web Development',
      batch: '2022',
      semester: '2',
      instructor: 'Dr. Moore',
      room: 'Room 308'
    },
    'Monday': {
      courseCode: 'CSE 109',
      courseName: 'Machine Learning',
      batch: '2021',
      semester: '3',
      instructor: 'Dr. Taylor',
      room: 'Room 309'
    },
    'Tuesday': {
      courseCode: 'CSE 110',
      courseName: 'Artificial Intelligence',
      batch: '2020',
      semester: '4',
      instructor: 'Dr. Anderson',
      room: 'Room 310'
    },
    'Wednesday': {
      courseCode: 'CSE 111',
      courseName: 'Computer Graphics',
      batch: '2023',
      semester: '1',
      instructor: 'Dr. Thomas',
      room: 'Room 311'
    },
    'Thursday': {
      courseCode: 'CSE 112',
      courseName: 'Mobile Development',
      batch: '2022',
      semester: '2',
      instructor: 'Dr. Jackson',
      room: 'Room 312'
    },
    'Friday': {
      courseCode: 'CSE 113',
      courseName: 'Cloud Computing',
      batch: '2021',
      semester: '3',
      instructor: 'Dr. White',
      room: 'Room 313'
    },
    'Saturday': {
      courseCode: 'CSE 114',
      courseName: 'Cybersecurity',
      batch: '2020',
      semester: '4',
      instructor: 'Dr. Harris',
      room: 'Room 314'
    }
  }
  // Add other time slots as needed...
};
