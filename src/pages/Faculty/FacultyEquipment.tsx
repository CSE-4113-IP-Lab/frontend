import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquipmentRequestModal from "@/components/EquipmentRequestModal";
import { 
  Settings, 
  Search, 
  Plus, 
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService, type Equipment, type EquipmentRequest, type EquipmentRequestCreateInput } from '@/services/equipmentService';

export default function FacultyEquipmentPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Get tab from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'browse';
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [myRequests, setMyRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Check authentication and redirect if needed
  useEffect(() => {
    console.log('FacultyEquipment - Auth state:', { isAuthenticated, user });
    // Authentication is already handled by FacultyRoute wrapper
    // Just proceed with loading data
  }, [isAuthenticated, user, navigate]);

  // Load equipment and requests
  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoading(true);
      const [equipmentData, requestsData] = await Promise.all([
        equipmentService.getAllEquipment(),
        equipmentService.getEquipmentRequests()
      ]);
      setEquipment(equipmentData);
      setMyRequests(requestsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  };

  // Filter equipment based on search
  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle equipment request
  const handleRequestEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsRequestModalOpen(true);
  };

  // Handle request submission
  const handleSubmitRequest = async (request: EquipmentRequestCreateInput) => {
    try {
      await equipmentService.createEquipmentRequest(request);
      alert('Equipment request submitted successfully!');
      loadData(); // Reload to update available quantities and requests
    } catch (error: any) {
      console.error('Error creating request:', error);
      alert(error.response?.data?.detail || 'Failed to submit request');
      throw error; // Re-throw to let modal handle it
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsRequestModalOpen(false);
    setSelectedEquipment(null);
  };

  // Handle return equipment
  const handleReturnEquipment = async (requestId: number) => {
    if (!confirm('Confirm that you are returning this equipment in good condition?')) return;
    
    try {
      await equipmentService.returnEquipment(requestId);
      alert('Equipment returned successfully');
      loadData();
    } catch (error: any) {
      console.error('Error returning equipment:', error);
      alert(error.response?.data?.detail || 'Failed to return equipment');
    }
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId: number) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    
    try {
      await equipmentService.cancelEquipmentRequest(requestId);
      alert('Request cancelled successfully');
      loadData();
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      alert(error.response?.data?.detail || 'Failed to cancel request');
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>,
      approved: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>,
      rejected: <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>,
      handover: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Settings className="w-3 h-3 mr-1" />Collected</Badge>,
      completed: <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>,
      cancelled: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
    };
    return variants[status as keyof typeof variants] || <Badge variant="outline">{status}</Badge>;
  };

  // Filter current requests (not completed, cancelled, or rejected)
  const currentRequests = myRequests.filter(req => 
    !['completed', 'cancelled', 'rejected'].includes(req.status)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading equipment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/resources/faculty')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Resources
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Settings className="w-8 h-8 text-blue-600" />
                    Faculty Equipment
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Browse and request laboratory equipment for teaching and research
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Equipment</TabsTrigger>
              <TabsTrigger value="current">My Requests ({myRequests.length})</TabsTrigger>
            </TabsList>

            {/* Browse Equipment Tab */}
            <TabsContent value="browse" className="space-y-6">
              {/* Search Bar */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search equipment by name, type, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{item.name}</span>
                        <Badge 
                          variant={item.available_quantity > 0 ? "secondary" : "destructive"}
                          className={item.available_quantity === 0 ? "bg-red-600 text-white border-red-600 hover:bg-red-700" : ""}
                        >
                          {item.available_quantity > 0 ? 'Available' : 'Not Available'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Type:</span>
                            <div className="text-gray-900">{item.type}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Available:</span>
                            <div className="text-gray-900">{item.available_quantity} / {item.quantity}</div>
                          </div>
                        </div>
                        
                        {item.description && (
                          <div>
                            <span className="font-medium text-gray-600 text-sm">Description:</span>
                            <p className="text-gray-700 text-sm mt-1 line-clamp-2">{item.description}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleRequestEquipment(item)}
                            disabled={item.available_quantity === 0}
                            className="flex-1"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Request
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredEquipment.length === 0 && (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No equipment found matching your search.</p>
                        <p className="text-gray-400 text-sm mt-2">Try a different search term or browse all equipment.</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Current Requests Tab */}
            <TabsContent value="current" className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">My Equipment Requests</h3>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  Track all your equipment requests and their current status.
                </p>
              </div>

              <div className="space-y-4">
                {myRequests.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No equipment requests found.</p>
                      <p className="text-gray-400 text-sm mt-2">Start by browsing equipment and making your first request.</p>
                    </CardContent>
                  </Card>
                ) : (
                  myRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{request.equipment?.name}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Quantity:</span> {request.quantity}
                            </div>
                            <div>
                              <span className="font-medium">Requested:</span> {new Date(request.request_date).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Purpose:</span> {request.purpose}
                            </div>
                            {request.approved_date && (
                              <div>
                                <span className="font-medium">Approved:</span> {new Date(request.approved_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          {/* Status-specific messages */}
                          {request.status === 'pending' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-3">
                              <p className="text-yellow-800 text-sm font-medium">
                                ⏳ Request pending review by administration. Faculty requests typically receive faster approval.
                              </p>
                            </div>
                          )}
                          
                          {request.status === 'approved' && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-3">
                              <p className="text-green-800 text-sm font-medium">
                                ✓ Request approved! Please collect your equipment from the lab during working hours.
                              </p>
                            </div>
                          )}
                          
                          {request.status === 'handover' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
                              <p className="text-blue-800 text-sm font-medium">
                                📋 Equipment collected! Please return it in good condition when finished.
                              </p>
                            </div>
                          )}

                          {request.notes && (
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mt-3">
                              <p className="text-gray-800 text-sm">
                                <span className="font-medium">Admin Notes:</span> {request.notes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {/* Return equipment if handed over */}
                          {request.status === 'handover' && (
                            <Button 
                              size="sm"
                              onClick={() => handleReturnEquipment(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Return Equipment
                            </Button>
                          )}
                          
                          {/* Cancel button - Faculty can only cancel approved requests */}
                          {request.status === 'approved' && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelRequest(request.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel Request
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
                )}
                
                {currentRequests.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No current equipment requests.</p>
                      <p className="text-gray-400 text-sm mt-2">Browse equipment to make a new request for teaching or research.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Equipment Request Modal */}
      {selectedEquipment && (
        <EquipmentRequestModal
          equipment={selectedEquipment}
          isOpen={isRequestModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRequest}
        />
      )}
    </div>
  );
}
