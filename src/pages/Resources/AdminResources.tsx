import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search,
  Settings,
  Plus,
  Eye,
  CheckCircle,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { equipmentService } from "@/services/equipmentService";

export default function AdminResources() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);

  // Check authentication and redirect if needed
  useEffect(() => {
    console.log('AdminResources - Auth state:', { isAuthenticated, user });
    if (!isAuthenticated || !user) {
      console.log('Redirecting to auth - no user or not authenticated');
      navigate('/auth');
      return;
    }
    // Allow any authenticated user to view admin resources for now
    // if (user.role !== 'admin') {
    //   console.log('Redirecting to auth - not admin role:', user.role);
    //   navigate('/auth');
    //   return;
    // }
  }, [isAuthenticated, user, navigate]);

  // Fetch admin dashboard data
  const fetchAdminData = async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    try {
      // Fetch pending requests count
      const requests = await equipmentService.getEquipmentRequests('pending');
      setPendingRequestsCount(requests.length);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Resources</h1>
                <p className="text-gray-600">
                  Administrative tools and management interfaces for university operations.
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
                    placeholder="Search admin resources..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Management Activities */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Management Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {loading ? 'Loading...' : `${pendingRequestsCount} Equipment Requests Pending`}
                    </h3>
                    <p className="text-sm text-gray-600">New requests awaiting approval</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/admin/equipment-management?tab=requests&filter=pending')}
                  >
                    Review
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Add New Equipment</h3>
                    <p className="text-sm text-gray-600">
                      Click to add new equipment to inventory
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      sessionStorage.setItem('openAddDialog', 'true');
                      navigate('/admin/equipment-management');
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Resource Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    onClick={() => {
                      sessionStorage.setItem('openAddDialog', 'true');
                      navigate('/admin/equipment-management');
                    }}
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
                    onClick={() => navigate('/admin/equipment-management?tab=requests&filter=pending')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Pending Requests
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/equipment-management?tab=requests')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Requests
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/equipment-management?tab=requests')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Request History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  System Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  System administration and user management
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    User Management
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    System Logs
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
