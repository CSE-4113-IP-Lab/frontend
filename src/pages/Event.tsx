export function Event() {
  const events = [
    {
      id: 1,
      title: "Annual Tech Fest 2025",
      description:
        "Join us for the biggest technology festival of the year featuring coding competitions, workshops, and tech talks.",
      date: "2025-02-15",
      time: "9:00 AM - 6:00 PM",
      location: "Main Auditorium",
      category: "Technology",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Career Fair",
      description:
        "Meet with top companies and explore career opportunities. Bring your resume and dress professionally.",
      date: "2025-01-25",
      time: "10:00 AM - 4:00 PM",
      location: "Campus Center",
      category: "Career",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Programming Workshop",
      description:
        "Learn advanced algorithms and data structures in this intensive workshop series.",
      date: "2025-01-20",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 1",
      category: "Education",
      status: "registration-open",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-blue-100 text-blue-800";
      case "Career":
        return "bg-green-100 text-green-800";
      case "Education":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "registration-open":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: "#14244C" }}>
          Upcoming Events
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      event.category
                    )}`}>
                    {event.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      event.status
                    )}`}>
                    {event.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "#14244C" }}>
                  {event.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Date:</span>
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Time:</span>
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Location:</span>
                    {event.location}
                  </div>
                </div>

                <button
                  className="w-full mt-6 py-2 px-4 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#ECB31D", color: "#14244C" }}>
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Don't miss out on these exciting events and opportunities!
          </p>
          <button
            className="py-3 px-6 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#14244C" }}>
            View All Events
          </button>
        </div>
      </div>
    </div>
  );
}
