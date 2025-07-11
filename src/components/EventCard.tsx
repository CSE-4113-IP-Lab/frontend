import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    category: string;
    date: string;
    endDate?: string | null;
    time: string;
    endTime?: string;
    location: string;
    organizer: string;
    capacity: number;
    registered: number;
    status: string;
    registrationDeadline: string;
    description: string;
    registrationFee: string;
    isRegistered: boolean;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      conference: "bg-blue-100 text-blue-800",
      workshop: "bg-green-100 text-green-800",
      seminar: "bg-purple-100 text-purple-800",
      competition: "bg-orange-100 text-orange-800",
      social: "bg-pink-100 text-pink-800",
      orientation: "bg-indigo-100 text-indigo-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isRegistrationOpen = (deadline: string) => {
    return new Date(deadline) > new Date();
  };

  const calculateDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntil = calculateDaysUntil(event.date);
  const isUpcoming = event.status === "upcoming";
  const canRegister =
    isUpcoming &&
    isRegistrationOpen(event.registrationDeadline) &&
    !event.isRegistered;

  return (
    <Card
      className={`hover:shadow-lg transition-shadow duration-200 ${
        isUpcoming && daysUntil <= 7 ? "border-l-4 border-primary-yellow" : ""
      }`}>
      <CardContent className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Event Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary-dark mb-2">
                  {event.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.toUpperCase()}
                  </Badge>
                  {event.isRegistered && (
                    <Badge className="bg-green-100 text-green-800">
                      REGISTERED
                    </Badge>
                  )}
                  {isUpcoming && daysUntil <= 7 && (
                    <Badge className="bg-red-100 text-red-800 animate-pulse">
                      STARTING SOON
                    </Badge>
                  )}
                </div>
                <p className="text-text-secondary text-sm mb-3">
                  Organized by {event.organizer}
                </p>
              </div>
            </div>

            <p className="text-text-secondary mb-4 leading-relaxed">
              {event.description}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                  Event Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary-yellow" />
                    <span className="text-text-secondary">
                      {new Date(event.date).toLocaleDateString()}
                      {event.endDate &&
                        ` - ${new Date(event.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary-yellow" />
                    <span className="text-text-secondary">{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary-yellow" />
                    <span className="text-text-secondary">
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-primary-yellow" />
                    <span className="text-text-secondary">
                      {event.registered}/{event.capacity} registered
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                  Registration
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">
                    <strong>Fee:</strong> {event.registrationFee}
                  </p>
                  <p className="text-sm text-text-secondary">
                    <strong>Deadline:</strong>{" "}
                    {new Date(event.registrationDeadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions and Status */}
          <div className="space-y-4">
            {/* Registration Progress */}
            <div>
              <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                Registration Status
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-primary-yellow h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(event.registered / event.capacity) * 100}%`,
                  }}></div>
              </div>
              <p className="text-xs text-text-secondary">
                {event.capacity - event.registered} spots remaining
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {canRegister && <Button className="w-full">REGISTER NOW</Button>}

              {event.isRegistered && event.status === "upcoming" && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>You are registered</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    CANCEL REGISTRATION
                  </Button>
                </div>
              )}

              {!canRegister &&
                !event.isRegistered &&
                event.status === "upcoming" && (
                  <div className="text-center">
                    <div className="flex items-center space-x-2 text-red-600 text-sm mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Registration closed</span>
                    </div>
                  </div>
                )}

              <Link to={`/events/${event.id}`}>
                <Button variant="outline" className="w-full">
                  VIEW DETAILS
                </Button>
              </Link>

              <Button variant="outline" className="w-full">
                ADD TO CALENDAR
              </Button>

              {event.status === "completed" && (
                <Button variant="outline" className="w-full">
                  VIEW PHOTOS/VIDEOS
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
