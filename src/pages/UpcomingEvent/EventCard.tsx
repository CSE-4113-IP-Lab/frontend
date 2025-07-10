import React from 'react';
import type { EventCardProps } from '../../types';

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const handleRegistration = (eventId: number): void => {
    console.log(`Register for event ${eventId}`);
    // Add registration logic here
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/2 p-6">
          <div className="text-sm text-gray-600 mb-2">{event.status}</div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{event.title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
          <button
            onClick={() => handleRegistration(event.id)}
            className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register Now
          </button>
        </div>
        
        <div className="md:w-1/2">
          <div className={`${event.bgColor} h-full flex items-center justify-center text-white p-8 min-h-[200px]`}>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{event.category.toUpperCase()}</div>
              <div className="text-lg opacity-90">{event.title}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;