import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Settings, 
  Search, 
  Plus, 
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Package,
  RotateCcw
} from "lucide-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService, type Equipment, type EquipmentRequest, type EquipmentCreateInput, type EquipmentUpdateInput } from '@/services/equipmentService';

export default function AdminEquipmentManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState<EquipmentCreateInput>({
    name: '',
    type: '',
    description: '',
    quantity: 1
  });

  // Get initial tab from URL params
  const initialTab = searchParams.get('tab') || 'inventory';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Check authentication and redirect if needed
  useEffect(() => {
    console.log('AdminEquipmentManagement - Auth state:', { isAuthenticated, user });
    if (!isAuthenticated || !user) {
      console.log('Redirecting to auth - no user or not authenticated');
      navigate('/auth');
      return;
    }
    // Allow any authenticated user to view admin equipment management for now
    // if (user.role !== 'admin') {
    //   console.log('Redirecting to auth - not admin role:', user.role);
    //   navigate('/auth');
    //   return;
    // }
  }, [isAuthenticated, user, navigate]);

  // Load data
  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
      // Check if should open add dialog from session storage
      if (sessionStorage.getItem('openAddDialog') === 'true') {
        setShowAddForm(true);
        sessionStorage.removeItem('openAddDialog');
      }
    }
  }, [isAuthenticated, user]);

  // Update tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'inventory';
    setActiveTab(tab);
  }, [searchParams]);

  const loadData = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoading(true);
      const [equipmentData, requestsData] = await Promise.all([
        equipmentService.getAllEquipment(),
        equipmentService.getEquipmentRequests()
      ]);
      setEquipment(equipmentData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
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

  // Filter requests based on URL params
  const filterParam = searchParams.get('filter');
  const filteredRequests = filterParam 
    ? requests.filter(req => req.status === filterParam)
    : requests;

  // Handle form submission
  const handleSubmitEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      if (editingEquipment) {
        await equipmentService.updateEquipment(editingEquipment.id, formData as EquipmentUpdateInput);
        alert('Equipment updated successfully');
      } else {
        await equipmentService.addEquipment(formData);
        alert('Equipment added successfully');
      }
      
      setFormData({ name: '', type: '', description: '', quantity: 1 });
      setShowAddForm(false);
      setEditingEquipment(null);
      loadData();
    } catch (error: any) {
      console.error('Error saving equipment:', error);
      alert(error.response?.data?.detail || 'Failed to save equipment');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete equipment
  const handleDeleteEquipment = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    try {
      await equipmentService.deleteEquipment(id);
      alert('Equipment deleted successfully');
      loadData();
    } catch (error: any) {
      console.error('Error deleting equipment:', error);
      alert(error.response?.data?.detail || 'Failed to delete equipment');
    }
  };

  // Handle edit equipment
  const handleEditEquipment = (item: Equipment) => {
    setEditingEquipment(item);
    setFormData({
      name: item.name,
      type: item.type,
      description: item.description || '',
      quantity: item.quantity
    });
    setShowAddForm(true);
  };

  // Handle request actions
  const handleApproveRequest = async (id: number) => {
    try {
      await equipmentService.approveEquipmentRequest(id);
      alert('Request approved successfully');
      loadData();
    } catch (error: any) {
      console.error('Error approving request:', error);
      alert(error.response?.data?.detail || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (id: number) => {
    const notes = prompt('Please provide a reason for rejection:');
    if (!notes) return;
    
    try {
      await equipmentService.rejectEquipmentRequest(id, notes);
      alert('Request rejected successfully');
      loadData();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      alert(error.response?.data?.detail || 'Failed to reject request');
    }
  };

  const handleHandoverRequest = async (id: number) => {
    if (!confirm('Confirm that equipment has been handed over to the requester?')) return;
    
    try {
      await equipmentService.handoverEquipment(id);
      alert('Equipment handover recorded successfully');
      loadData();
    } catch (error: any) {
      console.error('Error recording handover:', error);
      alert(error.response?.data?.detail || 'Failed to record handover');
    }
  };

  const handleReturnEquipment = async (id: number) => {
    if (!confirm('Confirm that equipment has been returned by the requester?')) return;
    
    try {
      await equipmentService.returnEquipment(id);
      alert('Equipment return recorded successfully');
      loadData();
    } catch (error: any) {
      console.error('Error recording return:', error);
      alert(error.response?.data?.detail || 'Failed to record return');
    }
  };

  const handleCancelRequest = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    
    try {
      await equipmentService.cancelEquipmentRequest(id);
      alert('Request cancelled successfully');
      loadData();
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      alert(error.response?.data?.detail || 'Failed to cancel request');
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>,
      approved: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>,
      rejected: <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>,
      handover: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Package className="w-3 h-3 mr-1" />Handed Over</Badge>,
      completed: <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>,
      cancelled: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
    };
    return variants[status as keyof typeof variants] || <Badge variant="outline">{status}</Badge>;
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/resources/admin')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Resources
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Settings className="w-8 h-8 text-red-600" />
                    Equipment Management
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Manage laboratory equipment inventory and requests
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setEditingEquipment(null);
                  setFormData({ name: '', type: '', description: '', quantity: 1 });
                  setShowAddForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inventory">Equipment Inventory ({equipment.length})</TabsTrigger>
              <TabsTrigger value="requests">Equipment Requests ({requests.length})</TabsTrigger>
            </TabsList>

            {/* Equipment Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
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
                            <span className="font-medium text-gray-600">Total Qty:</span>
                            <div className="text-gray-900">{item.quantity}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Available:</span>
                            <div className="text-gray-900">{item.available_quantity}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">In Use:</span>
                            <div className="text-gray-900">{item.quantity - item.available_quantity}</div>
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
                            variant="outline"
                            onClick={() => handleEditEquipment(item)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteEquipment(item.id, item.name)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Equipment Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              {/* Request Filters */}
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant={!filterParam ? "default" : "outline"} 
                  size="sm"
                  onClick={() => navigate('/admin/equipment-management?tab=requests')}
                >
                  All Requests ({requests.length})
                </Button>
                <Button 
                  variant={filterParam === 'pending' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => navigate('/admin/equipment-management?tab=requests&filter=pending')}
                >
                  Pending ({requests.filter(r => r.status === 'pending').length})
                </Button>
                <Button 
                  variant={filterParam === 'approved' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => navigate('/admin/equipment-management?tab=requests&filter=approved')}
                >
                  Approved ({requests.filter(r => r.status === 'approved').length})
                </Button>
                <Button 
                  variant={filterParam === 'handover' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => navigate('/admin/equipment-management?tab=requests&filter=handover')}
                >
                  Handed Over ({requests.filter(r => r.status === 'handover').length})
                </Button>
                <Button 
                  variant={filterParam === 'completed' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => navigate('/admin/equipment-management?tab=requests&filter=completed')}
                >
                  Completed ({requests.filter(r => r.status === 'completed').length})
                </Button>
                <Button 
                  variant={filterParam === 'rejected' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => navigate('/admin/equipment-management?tab=requests&filter=rejected')}
                >
                  Rejected ({requests.filter(r => r.status === 'rejected').length})
                </Button>
                <Button 
                  variant={filterParam === 'cancelled' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => navigate('/admin/equipment-management?tab=requests&filter=cancelled')}
                >
                  Cancelled ({requests.filter(r => r.status === 'cancelled').length})
                </Button>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{request.equipment?.name}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Requester:</span> User #{request.user_id}
                            </div>
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
                            {request.handover_date && (
                              <div>
                                <span className="font-medium">Handed Over:</span> {new Date(request.handover_date).toLocaleDateString()}
                              </div>
                            )}
                            {request.return_date && (
                              <div>
                                <span className="font-medium">Returned:</span> {new Date(request.return_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          {request.notes && (
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mt-3">
                              <p className="text-gray-800 text-sm">
                                <span className="font-medium">Notes:</span> {request.notes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {/* Pending status actions */}
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRequest(request.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {/* Approved status actions */}
                          {request.status === 'approved' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => handleHandoverRequest(request.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Package className="w-4 h-4 mr-1" />
                                Mark as Handed Over
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelRequest(request.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          
                          {/* Handover status actions */}
                          {request.status === 'handover' && (
                            <Button 
                              size="sm"
                              onClick={() => handleReturnEquipment(request.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Mark as Returned
                            </Button>
                          )}
                          
                          {/* No actions for completed, rejected, cancelled status */}
                          {(request.status === 'completed' || request.status === 'rejected' || request.status === 'cancelled') && (
                            <div className="text-sm text-gray-500 px-3 py-2">
                              No actions available
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredRequests.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No equipment requests found.</p>
                      <p className="text-gray-400 text-sm mt-2">Requests will appear here when submitted by users.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add/Edit Equipment Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEquipment} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Equipment Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter equipment name"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">Equipment Type</Label>
              <Input
                id="type"
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g., Laboratory, Computer, Tool"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the equipment, its purpose, or any special notes"
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>
            
            <DialogFooter className="gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEquipment(null);
                  setFormData({ name: '', type: '', description: '', quantity: 1 });
                }}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {editingEquipment ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingEquipment ? 'Update Equipment' : 'Add Equipment'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
