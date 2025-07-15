import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import type { EventCardProps } from "../../types";
import RegisterForm from "./RegisterForm";

const EventCard: React.FC<EventCardProps> = ({
  event,
  onRegister,
  onUnregister,
  isRegistered = false,
  showRegistrationButton = true
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [localRegistered, setLocalRegistered] = useState(isRegistered);
  const isArchived = event.status.toLowerCase() === "completed";

  useEffect(() => {
    document.body.style.overflow = isRegistering ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRegistering]);

  const handleRegisterClick = () => {
    if (onRegister) {
      onRegister(event.id);
      setLocalRegistered(true);
    } else {
      setIsRegistering(true);
    }
  };

  const handleUnregisterClick = () => {
    if (onUnregister) {
      onUnregister(event.id);
      setLocalRegistered(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="md:flex">
        {/* Text Content */}
        <div className="md:w-2/3 p-8 flex flex-col justify-between">
          <div>
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isArchived
                ? 'bg-gray-100 text-gray-600'
                : localRegistered
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
                }`}>
                {isArchived ? '✓ Completed' : localRegistered ? '✓ Registered' : '📅 ' + event.status}
              </span>
              <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                {event.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6 text-base">
              {event.description}
            </p>

            {/* Event Details */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Event Date: {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>Duration: Full Day</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Location: CSE Department, DU</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>Open to all students and faculty</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to={`/event/${event.id}`}
                className="text-[#14244c] hover:text-[#ecb31d] font-medium text-sm flex items-center transition-colors">
                View Details
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {!isArchived && showRegistrationButton && (
                <>
                  {localRegistered && onUnregister ? (
                    <button
                      onClick={handleUnregisterClick}
                      className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500">
                      Unregister
                    </button>
                  ) : (
                    <button
                      onClick={handleRegisterClick}
                      disabled={localRegistered}
                      className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${localRegistered
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#14244c] to-[#1e3a5f] hover:from-[#1e3a5f] hover:to-[#14244c] text-white shadow-lg hover:shadow-xl focus:ring-[#14244c]'
                        }`}>
                      {localRegistered ? '✓ Registered' : 'Register Now'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Visual Section */}
        <div className="md:w-1/3">
          {event.imageUrl ? (
            /* Event Image */
            <div className="h-full min-h-[300px] relative overflow-hidden rounded-r-xl">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                onLoad={() => {
                  console.log('Image loaded successfully:', event.imageUrl);
                }}
                onError={(e) => {
                  // Fallback to colored background if image fails to load
                  console.log('Image failed to load:', event.imageUrl);
                  console.log('Error details:', e);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling?.nextElementSibling) {
                    (target.nextElementSibling.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              {/* Subtle gradient overlay for better text readability - optional and minimal */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {/* Fallback colored background (hidden by default) */}
              <div
                className={`${event.bgColor} h-full flex items-center justify-center text-white p-8 min-h-[300px] relative overflow-hidden`}
                style={{ display: 'none' }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white transform rotate-45"></div>
                  <div className="absolute top-1/2 right-8 w-8 h-8 border-2 border-white rounded-full"></div>
                </div>
                {/* Content */}
                <div className="text-center relative z-10">
                  <div className="text-xl font-bold mb-3 tracking-wider">
                    {event.category.toUpperCase()}
                  </div>
                  <div className="text-sm opacity-90 font-medium">
                    {event.title}
                  </div>
                  {!isArchived && (
                    <div className="mt-4 text-xs opacity-75">
                      📍 CSE Department
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Fallback Colored Background */
            <div className={`${event.bgColor} h-full flex items-center justify-center text-white p-8 min-h-[300px] relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white transform rotate-45"></div>
                <div className="absolute top-1/2 right-8 w-8 h-8 border-2 border-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="text-center relative z-10">
                <div className="text-xl font-bold mb-3 tracking-wider">
                  {event.category.toUpperCase()}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  {event.title}
                </div>
                {!isArchived && (
                  <div className="mt-4 text-xs opacity-75">
                    📍 CSE Department
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Register Modal */}
      {!isArchived && isRegistering && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <RegisterForm
            eventId={event.id}
            eventTitle={event.title}
            onClose={() => {
              setLocalRegistered(true);
              setIsRegistering(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EventCard;
