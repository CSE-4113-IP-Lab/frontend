import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function NoticeBoardPage() {
  const notices = [
    {
      title: "Notice for Semester Registration",
      type: "Academic",
      date: "2024-07-26",
    },
    {
      title: "Important Announcement Regarding Exam Schedule",
      type: "Admin",
      date: "2024-07-25",
    },
    {
      title: "General Meeting for All Students",
      type: "General",
      date: "2024-07-24",
    },
    {
      title: "Academic Calendar Update",
      type: "Academic",
      date: "2024-07-23",
    },
    {
      title: "Notice on Departmental Activities",
      type: "Admin",
      date: "2024-07-22",
    },
    {
      title: "General Information for New Students",
      type: "General",
      date: "2024-07-21",
    },
    {
      title: "Academic Advising Schedule",
      type: "Academic",
      date: "2024-07-20",
    },
    {
      title: "Notice on Faculty Meetings",
      type: "Admin",
      date: "2024-07-19",
    },
    {
      title: "General Guidelines for Project Submissions",
      type: "General",
      date: "2024-07-18",
    },
    {
      title: "Academic Integrity Policy Reminder",
      type: "Academic",
      date: "2024-07-17",
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Academic":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Admin":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "General":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">NOTICES</h1>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-8">
            <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Academic
            </Button>
            <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Admin
            </Button>
            <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              General
            </Button>
          </div>

          {/* Filter Dropdowns */}
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <div className="flex space-x-4">
              <Select defaultValue="all-types">
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-dates">
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-dates">All Dates</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notices Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b font-medium text-gray-700">
              <div className="col-span-6">Title</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Date</div>
            </div>

            {notices.map((notice, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-6">
                  <span className="text-gray-900 hover:text-blue-600 cursor-pointer">{notice.title}</span>
                </div>
                <div className="col-span-3">
                  <Badge variant="secondary" className={getTypeColor(notice.type)}>
                    {notice.type}
                  </Badge>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-500 text-sm">{notice.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* View Archive Link */}
          <div className="mt-6">
            <Button variant="link" className="text-gray-600 hover:text-gray-800 p-0">
              View Archive
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
