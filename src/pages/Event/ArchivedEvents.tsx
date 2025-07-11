import React from 'react';
import EventCard from './EventCard';
import type { Event } from '../../types';

const archivedEvents: Event[] = [
  {
    id: 101,
    title: "Blockchain Bootcamp 2023",
    description: "An in-depth look into blockchain technologies with hands-on training sessions.",
    status: "Completed",
    category: "Bootcamp",
    image: "/api/placeholder/300/200",
    bgColor: "bg-gray-600"
  },
  {
    id: 102,
    title: "Tech Talk Series - 2022",
    description: "Industry leaders shared insights into future technologies and trends.",
    status: "Completed",
    category: "Talk",
    image: "/api/placeholder/300/200",
    bgColor: "bg-gray-700"
  }
];

const ArchivedEvents: React.FC = () => (
  <div className="space-y-6">
    {archivedEvents.map((event) => (
      <EventCard key={event.id} event={event} />
    ))}
  </div>
);

export default ArchivedEvents;
