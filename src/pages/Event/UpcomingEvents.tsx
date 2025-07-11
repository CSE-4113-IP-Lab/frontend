import React from 'react';
import EventCard from './EventCard';
import type { Event } from '../../types';

const UpcomingEvents: React.FC = () => {
  const events: Event[] = [
    {
      id: 1,
      title: "AI and Machine Learning Workshop",
      description: "Join us for an immersive workshop covering the latest trends in AI and Machine Learning. Great for beginners and advanced learners.",
      status: "Registration Open",
      category: "Workshop",
      image: "/api/placeholder/300/200",
      bgColor: "bg-emerald-700"
    },
    {
      id: 2,
      title: "Cybersecurity Conference",
      description: "Explore the latest cybersecurity trends, featuring key speakers, panel discussions covering current cybersecurity threats and solutions.",
      status: "Registration Open",
      category: "Conference",
      image: "/api/placeholder/300/200",
      bgColor: "bg-teal-600"
    },
    {
      id: 3,
      title: "Software Engineering Symposium",
      description: "Connect with industry professionals and explore cutting-edge software development. Network with industry experts and peers.",
      status: "Registration Open",
      category: "Symposium",
      image: "/api/placeholder/300/200",
      bgColor: "bg-blue-600"
    },
    {
      id: 4,
      title: "Data Science Summit",
      description: "Discover the world of Data Science at our summit with sessions on data analysis, visualization and expert technologies. Learn from leading data scientists.",
      status: "Registration Open",
      category: "Summit",
      image: "/api/placeholder/300/200",
      bgColor: "bg-cyan-600"
    },
    {
      id: 5,
      title: "Networking and Career Fair",
      description: "Connect with top companies in the technology and business sectors. Explore job opportunities, internships, and career paths in the tech industry.",
      status: "Registration Open",
      category: "Career Fair",
      image: "/api/placeholder/300/200",
      bgColor: "bg-emerald-600"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">UPCOMING EVENTS</h1>
      
      <div className="space-y-6">
        {events.map((event: Event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;