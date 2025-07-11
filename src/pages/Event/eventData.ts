import type { Event } from '../../types';

export const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "AI and Machine Learning Workshop",
    description: "Join us for an immersive workshop...",
    status: "Registration Open",
    category: "Workshop",
    image: "",
    bgColor: "bg-blue-600"
  },
  // Add more...
];

export const archivedEvents: Event[] = [
  {
    id: 101,
    title: "Blockchain Bootcamp 2023",
    description: "An in-depth look into blockchain technologies...",
    status: "Completed",
    category: "Bootcamp",
    image: "",
    bgColor: "bg-gray-600"
  },
  // Add more...
];

export const allEvents: Event[] = [...upcomingEvents, ...archivedEvents];
