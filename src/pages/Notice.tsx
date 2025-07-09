export function Notice() {
  const notices = [
    {
      id: 1,
      title: "Important Update: Semester 4-1 Results",
      content:
        "Notice !!! Shawon got cgpa -4 in semester 4-1. This is a reminder that academic performance needs improvement.",
      date: "2025-01-08",
      priority: "high",
    },
    {
      id: 2,
      title: "Registration for Next Semester",
      content:
        "Registration for the upcoming semester will begin on January 15th, 2025. Please ensure all required documents are ready.",
      date: "2025-01-05",
      priority: "medium",
    },
    {
      id: 3,
      title: "Library Hours Update",
      content:
        "The library will extend its operating hours during exam period. New hours: 8:00 AM - 12:00 AM.",
      date: "2025-01-03",
      priority: "low",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-green-500 bg-green-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: "#14244C" }}>
          Notices & Announcements
        </h1>

        <div className="space-y-6">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`border-l-4 p-6 rounded-lg shadow-sm ${getPriorityColor(
                notice.priority
              )}`}>
              <div className="flex items-start justify-between mb-4">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "#14244C" }}>
                  {notice.title}
                </h2>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                      notice.priority
                    )}`}>
                    {notice.priority.toUpperCase()}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(notice.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{notice.content}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Stay updated with the latest announcements and important notices.
          </p>
        </div>
      </div>
    </div>
  );
}
