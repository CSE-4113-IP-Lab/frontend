import React, { useState } from 'react';
import UpcomingEvents from './UpcomingEvents';
import ArchivedEvents from './ArchivedEvents';
import RegisteredEvents from './RegisteredEvents';

const EventPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'registered' | 'archive'>('upcoming');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#14244c] to-[#1e3a5f] bg-clip-text text-transparent mb-4">
            🎉 Events & Workshops
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join our vibrant community events, workshops, and academic gatherings designed to enhance your learning experience and professional development.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
            <div className="flex gap-2">
              <button
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-[#14244c] to-[#1e3a5f] text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-[#14244c] hover:bg-gray-50'
                  }`}
                onClick={() => setActiveTab('upcoming')}
              >
                📅 Upcoming Events
              </button>
              <button
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'registered'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }`}
                onClick={() => setActiveTab('registered')}
              >
                ✅ My Events
              </button>
              <button
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'archive'
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setActiveTab('archive')}
              >
                📋 Archived Events
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'upcoming' && <UpcomingEvents />}
          {activeTab === 'registered' && <RegisteredEvents />}
          {activeTab === 'archive' && <ArchivedEvents />}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-gray-600 text-sm">
              Follow our events page and join our community to never miss out on exciting opportunities for learning, networking, and professional growth.
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Free Events
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Open to All
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Certificates Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
