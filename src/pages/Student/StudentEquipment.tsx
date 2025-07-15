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
  CheckCircle,
  Clock,
  XCircle,
  X
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService, type Equipment, type EquipmentRequest, type EquipmentRequestCreateInput } from '@/services/equipmentService';

export default function StudentEquipmentPage() {
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
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');

  // Check authentication and redirect if needed
  useEffect(() => {
    console.log('StudentEquipment - Auth state:', { isAuthenticated, user });
    // Authentication is already handled by StudentRoute wrapper
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

  // Count requests by status for filter buttons
  const requestCounts = {
    all: myRequests.length,
    pending: myRequests.filter(req => req.status === 'pending').length,
    approved: myRequests.filter(req => req.status === 'approved').length,
    handover: myRequests.filter(req => req.status === 'handover').length,
    completed: myRequests.filter(req => req.status === 'completed').length,
    rejected: myRequests.filter(req => req.status === 'rejected').length,
    cancelled: myRequests.filter(req => req.status === 'cancelled').length,
  };

  // Filter requests based on status filter
  const filteredRequests = requestStatusFilter === 'all' 
    ? myRequests 
    : myRequests.filter(req => req.status === requestStatusFilter);

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

  // Handle cancel request (students can cancel pending and approved requests)
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
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'handover':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />In Use</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="outline"><X className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter requests to show only approved and handover requests (current active requests)
  // Actually, show ALL requests so students can see rejected, cancelled, and completed ones too

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/resources/student')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Student Resources
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Settings className="w-8 h-8 text-purple-600" />
                    Student Equipment
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Browse and request laboratory equipment
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
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Available:</span>
                          <span className="font-medium">{item.available_quantity} / {item.quantity}</span>
                        </div>
                        
                        <Button 
                          className="w-full"
                          disabled={item.available_quantity === 0}
                          onClick={() => handleRequestEquipment(item)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Request Equipment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEquipment.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No equipment found matching your search.</p>
                  </CardContent>
                </Card>
              )}
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

              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={requestStatusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRequestStatusFilter('all')}
                >
                  All Requests ({requestCounts.all})
                </Button>
                <Button
                  variant={requestStatusFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRequestStatusFilter('pending')}
                >
                  Pending ({requestCounts.pending})
                </Button>
                <Button
                  variant={requestStatusFilter === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRequestStatusFilter('approved')}
                >
                  Approved ({requestCounts.approved})
                </Button>
                <Button
                  variant={requestStatusFilter === 'handover' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRequestStatusFilter('handover')}
                >
                  In Use ({requestCounts.handover})
                </Button>
                <Button
                  variant={requestStatusFilter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRequestStatusFilter('completed')}
                >
                  Completed ({requestCounts.completed})
                </Button>
                <Button
                  variant={requestStatusFilter === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRequestStatusFilter('rejected')}
                >
                  Rejected ({requestCounts.rejected})
                </Button>
                <Button
                  variant={requestStatusFilter === 'cancelled' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRequestStatusFilter('cancelled')}
                >
                  Cancelled ({requestCounts.cancelled})
                </Button>
              </div>

              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No requests found for this filter.</p>
                      <p className="text-gray-400 text-sm mt-2">Try a different filter or make your first request.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-l-purple-500">
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
                              <div>
                                <span className="font-medium">Status:</span> {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </div>
                            </div>
                            {request.notes && (
                              <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium">Notes:</span> {request.notes}
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
                                  📋 Equipment collected! Please return it when you're finished.
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            {/* Students can cancel both pending and approved requests */}
                            {(request.status === 'pending' || request.status === 'approved') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelRequest(request.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel Request
                              </Button>
                            )}
                            
                            {/* Students cannot return equipment - only admin can mark as returned */}
                            {request.status === 'handover' && (
                              <div className="text-sm text-gray-500 px-3 py-2">
                                Contact admin to return equipment
                              </div>
                            )}
                            
                            {/* No actions for completed, rejected, cancelled requests */}
                            {(request.status === 'completed' || request.status === 'rejected' || request.status === 'cancelled') && (
                              <div className="text-sm text-gray-500 px-3 py-2">
                                No actions available
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
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
