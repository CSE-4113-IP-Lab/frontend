import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { eventService } from '../../services/eventService';
import type { PostResponse } from '../../services/eventService';
import type { Event } from '../../types';

const ArchivedEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert backend response to frontend Event
  const convertToEvent = (backendEvent: PostResponse): Event => {
    // Assign colors for archived events (using gray tones)
    const getEventColor = (type: string) => {
      const colorMap: { [key: string]: string } = {
        'workshop': 'bg-gray-600',
        'conference': 'bg-gray-700',
        'symposium': 'bg-gray-500',
        'summit': 'bg-gray-800',
        'fair': 'bg-gray-600',
        'seminar': 'bg-gray-700',
        'event': 'bg-gray-600',
      };

      return colorMap[type.toLowerCase()] || 'bg-gray-600';
    };

    return {
      id: backendEvent.id,
      title: backendEvent.title,
      description: backendEvent.content,
      status: 'Completed',
      category: backendEvent.type || 'Event',
      image: "/api/placeholder/300/200",
      imageUrl: eventService.getEventImageUrl(backendEvent),
      bgColor: getEventColor(backendEvent.type || ''),
      date: backendEvent.date
    };
  };

  const fetchArchivedEvents = async () => {
    try {
      setLoading(true);
      const backendEvents = await eventService.getArchivedEvents();
      const convertedEvents = backendEvents.map(convertToEvent);
      setEvents(convertedEvents);
      setError(null);
    } catch (error) {
      console.error('Error fetching archived events:', error);
      setError('Failed to load archived events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedEvents();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-8 px-6 rounded-xl mb-8">
          <h1 className="text-3xl font-bold text-center">ARCHIVED EVENTS</h1>
          <p className="text-center text-gray-200 mt-2">Past events and their highlights</p>
        </div>

        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          <span className="ml-4 text-gray-600">Loading archived events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-8 px-6 rounded-xl mb-8">
          <h1 className="text-3xl font-bold text-center">ARCHIVED EVENTS</h1>
          <p className="text-center text-gray-200 mt-2">Past events and their highlights</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Events</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchArchivedEvents}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-8 px-6 rounded-xl mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">ARCHIVED EVENTS</h1>
        <p className="text-center text-gray-200">Past events and their highlights</p>
        <div className="flex justify-center mt-4">
          <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
            {events.length} Archived Event{events.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Archived Events</h3>
            <p className="text-gray-500">No past events to display at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event: Event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivedEvents;
