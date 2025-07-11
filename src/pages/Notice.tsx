import { Search, Menu, FileText, Play, Video, FlaskRoundIcon as Flask } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-sm font-medium tracking-wider hover:text-gray-300">
              HOME
            </a>
            <a href="#" className="text-sm font-medium tracking-wider hover:text-gray-300">
              NOTICE
            </a>
            <a href="#" className="text-sm font-medium tracking-wider hover:text-gray-300">
              EVENT
            </a>
            <a href="#" className="text-sm font-medium tracking-wider hover:text-gray-300">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 p-2 rounded">
              <Search className="w-5 h-5 text-slate-800" />
            </div>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-slate-800 bg-transparent"
            >
              LOG IN
            </Button>
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Notification Bar */}
      <div className="bg-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="text-gray-700 text-sm">Notice !!! Shawon got cgpa -4 in semester 4-1</span>
        <Play className="w-4 h-4 text-gray-600" />
      </div>

      {/* Main Content */}
      <main className="bg-orange-50 min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              IMPORTANT NOTICE REGARDING UPCOMING SEMINAR
            </h1>
            <p className="text-gray-600 text-sm">Posted on: July 26, 2024</p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-gray-800 leading-relaxed">
            <p>
              The Department of Computer Science and Engineering at the University of Dhaka is pleased to announce an
              upcoming seminar on "Advancements in Artificial Intelligence." The seminar will feature renowned experts
              in the field, discussing the latest trends, research findings, and practical applications of AI. This
              event is open to all students, faculty, and industry professionals interested in learning more about AI.
            </p>

            <p>
              Keynote speakers include Dr. Anya Sharma from the Institute of Technology and Dr. Ben Carter from the
              National University of Science. The seminar will cover topics such as machine learning, natural language
              processing, computer vision, and robotics. There will also be interactive sessions and Q&A opportunities
              with the speakers.
            </p>

            <p>
              We encourage all interested individuals to register for the seminar by August 10, 2024. Registration
              details and the full seminar schedule can be found on our website. Don't miss this opportunity to gain
              valuable insights into the rapidly evolving field of artificial intelligence.
            </p>
          </div>

          {/* Attachments Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Attachments</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Seminar Schedule.pdf</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Speaker Bios.pdf</span>
              </div>
            </div>
          </div>

          {/* Related Information Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                <Video className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Past Seminar Recordings</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                <Flask className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">AI Research Projects</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
