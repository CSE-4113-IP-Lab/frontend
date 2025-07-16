import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { eventService } from '../../services/eventService';
import type { PostResponse } from '../../services/eventService';
import type { Event } from '../../types';

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert backend response to frontend Event
  const convertToEvent = (backendEvent: PostResponse): Event => {
    // Determine status based on event type and date
    const eventDate = new Date(backendEvent.date);
    const now = new Date();
    const status = eventDate > now ? 'Registration Open' : 'Completed';

    // Assign colors based on event type or title
    const getEventColor = (type: string, title: string) => {
      const colorMap: { [key: string]: string } = {
        'workshop': 'bg-emerald-700',
        'conference': 'bg-teal-600',
        'symposium': 'bg-blue-600',
        'summit': 'bg-cyan-600',
        'fair': 'bg-emerald-600',
        'seminar': 'bg-purple-600',
        'event': 'bg-indigo-600',
      };

      const typeKey = type.toLowerCase();
      if (colorMap[typeKey]) return colorMap[typeKey];

      // Fallback based on title keywords
      const titleLower = title.toLowerCase();
      if (titleLower.includes('ai') || titleLower.includes('machine learning')) return 'bg-emerald-700';
      if (titleLower.includes('security') || titleLower.includes('cyber')) return 'bg-teal-600';
      if (titleLower.includes('software') || titleLower.includes('engineering')) return 'bg-blue-600';
      if (titleLower.includes('data') || titleLower.includes('science')) return 'bg-cyan-600';
      if (titleLower.includes('career') || titleLower.includes('networking')) return 'bg-emerald-600';

      return 'bg-gray-600'; // Default color
    };

    return {
      id: backendEvent.id,
      title: backendEvent.title,
      description: backendEvent.content,
      status: status,
      category: backendEvent.type || 'Event',
      image: "/api/placeholder/300/200",
      imageUrl: eventService.getEventImageUrl(backendEvent),
      bgColor: getEventColor(backendEvent.type || '', backendEvent.title),
      date: backendEvent.date
    };
  };

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      const backendEvents = await eventService.getUpcomingEvents();
      console.log('Backend events:', backendEvents); // Debug log
      const convertedEvents = backendEvents.map(convertToEvent);
      console.log('Converted events:', convertedEvents); // Debug log
      setEvents(convertedEvents);
      setError(null);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      setError('Failed to load upcoming events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: number) => {
    try {
      const userId = localStorage.getItem('id');
      if (!userId) {
        alert('Please log in to register for events');
        return;
      }

      await eventService.registerForEvent(eventId, parseInt(userId));
      alert('Successfully registered for the event!');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to register for event';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#14244c] to-[#1e3a5f] text-white py-8 px-6 rounded-xl mb-8">
          <h1 className="text-3xl font-bold text-center">UPCOMING EVENTS</h1>
          <p className="text-center text-blue-100 mt-2">Discover exciting opportunities for learning and networking</p>
        </div>

        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14244c]"></div>
          <span className="ml-4 text-gray-600">Loading upcoming events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#14244c] to-[#1e3a5f] text-white py-8 px-6 rounded-xl mb-8">
          <h1 className="text-3xl font-bold text-center">UPCOMING EVENTS</h1>
          <p className="text-center text-blue-100 mt-2">Discover exciting opportunities for learning and networking</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Events</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchUpcomingEvents}
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
      <div className="bg-gradient-to-r from-[#14244c] to-[#1e3a5f] text-white py-8 px-6 rounded-xl mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">UPCOMING EVENTS</h1>
        <p className="text-center text-blue-100">Discover exciting opportunities for learning and networking</p>
        <div className="flex justify-center mt-4">
          <div className="bg-[#ecb31d] text-[#14244c] px-4 py-2 rounded-full text-sm font-semibold">
            {events.length} Event{events.length !== 1 ? 's' : ''} Available
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
            <p className="text-gray-500">Check back soon for new events and opportunities!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event: Event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;