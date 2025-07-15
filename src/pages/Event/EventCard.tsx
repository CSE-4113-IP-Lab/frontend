import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import type { EventCardProps } from "../../types";
import RegisterForm from "./RegisterForm";

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const isArchived = event.status.toLowerCase() === "completed";

  useEffect(() => {
    document.body.style.overflow = isRegistering ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRegistering]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <div className="md:flex">
        {/* Text Content */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">
              {event.status}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {event.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>

            {/* View Details Link */}
            <Link
              to={`/event/${event.id}`}
              className="text-blue-700 hover:underline block mt-2 text-sm">
              View Details →
            </Link>
          </div>

          {!isArchived && (
            <div className="mt-6">
              <button
                onClick={() => setIsRegistering(true)}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Register Now
              </button>
            </div>
          )}
        </div>

        {/* Visual Section */}
        <div className="md:w-1/2">
          <div
            className={`${event.bgColor} h-full flex items-center justify-center text-white p-8 min-h-[200px]`}>
            <div className="text-center">
              <div className="text-xl font-semibold mb-2 tracking-wider">
                {event.category.toUpperCase()}
              </div>
              <div className="text-md opacity-90">{event.title}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {!isArchived && isRegistering && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
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
