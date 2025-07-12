import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  BookOpen, 
  Video, 
  Search,
  Calendar,
  Settings,
  Upload,
  Plus,
  Eye,
  CheckCircle,
  Shield,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Resources() {
  const navigate = useNavigate();
  // Mock user role - in real app this would come from auth context
  const [userRole, setUserRole] = useState<'student' | 'faculty' | 'admin'>('student');

  // For demo purposes, you can change the role here
  useEffect(() => {
    // Get user role from localStorage or auth context
    const role = localStorage.getItem('userRole') as 'student' | 'faculty' | 'admin' || 'student';
    setUserRole(role);
  }, []);

  const renderStudentResources = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Browse Equipment
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              My Reservations
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Request Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Academic Materials */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Academic Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Course materials, syllabi, and study resources
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Course Syllabi
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              Study Guides
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Video className="w-4 h-4 mr-2" />
              Lecture Notes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Downloads */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Software, documents, and downloadable resources
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Software Tools
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              Past Papers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fees */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            View and manage your academic fees and payments
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              View Fee Statement
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Payment History
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Outstanding Dues
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFacultyResources = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Book Room */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Book Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Reserve classrooms, labs, and meeting rooms
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Available Rooms
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              My Bookings
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
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
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Browse Equipment
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Reserve Items
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              My Reservations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Downloads */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Access and manage downloadable resources
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Browse Downloads
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload Downloads
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              My Uploads
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Academic Materials */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Academic Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Course materials and academic resources
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Materials
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload Materials
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              My Materials
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Material */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            Upload Material
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Upload course materials and resources
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload Syllabus
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload Lecture Notes
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload Resources
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Downloads */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal-600" />
            Upload Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Upload software and downloadable content
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload Software
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Upload Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminResources = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Equipment Management */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Equipment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Manage all laboratory equipment
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/equipment-management')}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All Equipment
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/equipment-management')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/equipment-management')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Inventory
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View & Approve Requests */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            View & Approve Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Review and approve equipment requests
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/equipment-management')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Pending Requests
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/equipment-management')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Requests
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/equipment-management')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Request History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Equipment */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Add Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Add new equipment to the inventory
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate('/admin/equipment-management')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Item Categories
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reserve Equipment */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Reserve Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Manage equipment reservations
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              View Reservations
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Make Reservation
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Manage Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Resources</h1>
                <p className="text-gray-600">
                  Access academic resources, study materials, and useful links for your studies.
                </p>
              </div>
              
              {/* Role Switcher for Demo */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Role:</span>
                <select 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value as 'student' | 'faculty' | 'admin')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
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
                    placeholder="Search resources..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>

          {/* Role-based Resource Categories */}
          {userRole === 'student' && renderStudentResources()}
          {userRole === 'faculty' && renderFacultyResources()}
          {userRole === 'admin' && renderAdminResources()}

          {/* Recent Resources - Role-specific content */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>
                {userRole === 'student' && 'Recent Resources'}
                {userRole === 'faculty' && 'Recent Activities'}
                {userRole === 'admin' && 'Recent Management Activities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRole === 'student' && (
                  <>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium">Data Structures Syllabus</h3>
                          <p className="text-sm text-gray-600">Updated course syllabus for CSE 2107</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-orange-600" />
                        <div>
                          <h3 className="font-medium">Arduino Kit Request</h3>
                          <p className="text-sm text-gray-600">Status: Approved - Ready for pickup</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        <div>
                          <h3 className="font-medium">Semester Fee Payment Due</h3>
                          <p className="text-sm text-gray-600">Spring 2025 fees - Due date: July 25, 2025</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                      </Button>
                    </div>
                  </>
                )}

                {userRole === 'faculty' && (
                  <>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-indigo-600" />
                        <div>
                          <h3 className="font-medium">Lecture Notes Uploaded</h3>
                          <p className="text-sm text-gray-600">CSE 3107 - Algorithm Analysis notes uploaded</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <h3 className="font-medium">Room 301 Booked</h3>
                          <p className="text-sm text-gray-600">Conference room reserved for tomorrow 2-4 PM</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </>
                )}

                {userRole === 'admin' && (
                  <>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <h3 className="font-medium">5 Equipment Requests Pending</h3>
                          <p className="text-sm text-gray-600">New requests awaiting approval</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium">New Equipment Added</h3>
                          <p className="text-sm text-gray-600">3D Printer added to Electronics Lab inventory</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
