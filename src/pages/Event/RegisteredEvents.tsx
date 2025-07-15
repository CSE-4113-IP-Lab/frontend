import React, { useState, useEffect } from 'react';
import { eventService, type PostResponse } from '../../services/eventService';
import type { Event } from '../../types';
import EventCard from './EventCard';

const RegisteredEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper function to convert backend response to frontend Event
    const convertToEvent = (backendEvent: PostResponse): Event => {
        // Determine status based on event type and date
        const eventDate = new Date(backendEvent.date);
        const now = new Date();
        const status = eventDate > now ? 'Registered' : 'Completed';

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

    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            try {
                setLoading(true);
                const backendEvents = await eventService.getRegisteredEvents();
                const convertedEvents = backendEvents.map(convertToEvent);
                setEvents(convertedEvents);
            } catch (err) {
                console.error('Error fetching registered events:', err);
                setError('Failed to load registered events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRegisteredEvents();
    }, []);

    const handleUnregister = async (eventId: number) => {
        try {
            const userId = localStorage.getItem('id');
            if (!userId) {
                setError('User not logged in');
                return;
            }

            await eventService.unregisterFromEvent(eventId, parseInt(userId));

            // Remove the event from the list after successful unregistration
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        } catch (err) {
            console.error('Error unregistering from event:', err);
            setError('Failed to unregister from event. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-6 rounded-xl mb-8">
                    <h1 className="text-3xl font-bold text-center">MY REGISTERED EVENTS</h1>
                    <p className="text-center text-green-100 mt-2">Your upcoming event registrations and commitments</p>
                </div>

                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <span className="ml-4 text-gray-600">Loading your registered events...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-6 rounded-xl mb-8">
                    <h1 className="text-3xl font-bold text-center">MY REGISTERED EVENTS</h1>
                    <p className="text-center text-green-100 mt-2">Your upcoming event registrations and commitments</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-red-600 text-lg font-medium mb-2">Error Loading Events</div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-6 rounded-xl mb-8">
                    <h1 className="text-3xl font-bold text-center">MY REGISTERED EVENTS</h1>
                    <p className="text-center text-green-100 mt-2">Your upcoming event registrations and commitments</p>
                </div>

                <div className="text-center py-16">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-12 max-w-md mx-auto">
                        <div className="text-6xl mb-6">📋</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Registered Events</h3>
                        <p className="text-gray-600 mb-6">
                            You haven't registered for any events yet. Check out our upcoming events to find something interesting!
                        </p>
                        <div className="space-y-2">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Ready to Join?
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-6 rounded-xl mb-8">
                <h1 className="text-3xl font-bold text-center">MY REGISTERED EVENTS</h1>
                <p className="text-center text-green-100 mt-2">Your upcoming event registrations and commitments</p>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1  gap-8 mb-12">
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        isRegistered={true}
                        onRegister={() => { }} // Not needed for registered events
                        onUnregister={() => handleUnregister(event.id)}
                        showRegistrationButton={true}
                    />
                ))}
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-900 mb-4">
                        🎯 Your Event Journey
                    </h3>
                    <p className="text-green-700 mb-6 text-lg">
                        You're registered for {events.length} {events.length === 1 ? 'event' : 'events'}.
                        Keep growing your knowledge and network!
                    </p>
                    <div className="flex justify-center space-x-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            ✅ {events.length} Registered
                        </span>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            📚 Learning Journey
                        </span>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            🤝 Networking
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisteredEvents;
