import React, { useState } from 'react';
import type { EventCardProps } from '../../types';
import RegisterForm from './RegisterForm';

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const isArchived = event.status.toLowerCase() === "completed";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <div className="md:flex">
        <div className="md:w-1/2 p-6">
          <div className="text-sm text-gray-600 mb-2">{event.status}</div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{event.title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>

          {!isArchived && (
            <button
              onClick={() => setIsRegistering(true)}
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors"
            >
              Register Now
            </button>
          )}
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

      {/* Registration Modal */}
      {!isArchived && isRegistering && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <RegisterForm
            eventId={event.id}
            eventTitle={event.title}
            onClose={() => setIsRegistering(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EventCard;
