import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Event } from '../../types';
import { allEvents } from './eventData'; // Combine upcoming & archived
import RegisterForm from './RegisterForm';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = allEvents.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <div className="text-center py-16 text-red-600">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-700 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const isArchived = event.status.toLowerCase() === 'completed';

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4 text-sm text-gray-500">
        {isArchived ? 'Archived Event' : 'Upcoming Event'}
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-6">{event.description}</p>

      <div className={`rounded-lg p-4 mb-6 ${event.bgColor} text-white`}>
        <div className="font-semibold">{event.category}</div>
        <div>Status: {event.status}</div>
      </div>

      {!isArchived && (
        <RegisterForm
          eventId={event.id}
          eventTitle={event.title}
          onClose={() => navigate(-1)}
        />
      )}
    </div>
  );
};

export default EventDetails;
