import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Download, 
  BookOpen, 
  Search,
  Calendar,
  Settings,
  Eye,
  CreditCard
} from "lucide-react";

export default function StudentResources() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Student Resources</h1>
                <p className="text-gray-600">
                  Access academic resources, study materials, and useful tools for your studies.
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search student resources..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Resource Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Study Materials */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Study Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access course materials, textbooks, and study guides
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Course Materials
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Lecture Notes
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Past Papers
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Borrow and reserve laboratory equipment
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/student/equipment')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Browse Equipment
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/student/equipment')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reserve Items
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/student/equipment?tab=current')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    My Requests
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Academic Tools */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Academic Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Useful tools and calculators for academic work
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    GPA Calculator
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Academic Calendar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Course Planner
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fee */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-teal-600" />
                  Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage tuition fees, payments, and financial records
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Fees
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    Fee Statement
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Payment History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
