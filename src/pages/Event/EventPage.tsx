import React, { useState } from 'react';
import UpcomingEvents from './UpcomingEvents';
import ArchivedEvents from './ArchivedEvents';

const EventPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'archive'>('upcoming');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">🎉 Events & Workshops</h1>

      <div className="flex justify-center mb-8 gap-4">
        <button
          className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
            activeTab === 'upcoming' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
            activeTab === 'archive' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setActiveTab('archive')}
        >
          Archived Events
        </button>
      </div>

      {activeTab === 'upcoming' ? <UpcomingEvents /> : <ArchivedEvents />}
    </div>
  );
};

export default EventPage;
