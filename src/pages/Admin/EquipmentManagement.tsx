import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Plus,
  Edit, 
  Trash2, 
  Search, 
  Package, 
  CheckCircle, 
  XCircle, 
  HandHeart,
  ArrowLeftRight,
  RotateCcw,
  ArrowLeft
} from "lucide-react";
import { 
  equipmentService,
  type Equipment, 
  type EquipmentCreateInput, 
  type EquipmentUpdateInput, 
  type EquipmentRequest 
} from "@/services/equipmentService";
import { useNavigate } from 'react-router-dom';

// Simple Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Lighter Backdrop - more transparent */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto m-4 z-10 border-2 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
            title="Close (Press Escape)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Simple Alert Dialog Component
const AlertDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}> = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl border-2 border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex space-x-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Delete</Button>
        </div>
      </div>
    </div>
  );
};

// Simple Table Components
const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  </div>
);

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
    {children}
  </td>
);

const EquipmentManagement: React.FC = () => {
  const navigate = useNavigate();
  
  // Set admin JWT token for testing
  useEffect(() => {
    const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0YWhzaW5AeWFob28uY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUyNDI1OTU2fQ.0sSuQwO0AC0DkzE-WoUGpIGTfLlbhQJUpfSqdkQesL0";
    localStorage.setItem('accessToken', adminToken);
  }, []);

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; equipmentId: number | null }>({
    isOpen: false,
    equipmentId: null
  });
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  // Form states
  const [newEquipment, setNewEquipment] = useState<EquipmentCreateInput>({
    name: '',
    type: '',
    description: '',
    quantity: 0,
  });
  const [editForm, setEditForm] = useState<EquipmentUpdateInput>({});
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('equipment');

  // Load data
  useEffect(() => {
    loadData();
    
    // Handle URL parameters
    const tab = searchParams.get('tab');
    const filter = searchParams.get('filter');
    
    if (tab === 'requests') {
      setActiveTab('requests');
    }
    
    if (filter === 'pending') {
      setRequestStatusFilter('pending');
    }
  }, [searchParams]);

  // Separate useEffect for handling the add dialog event
  useEffect(() => {
    // Listen for custom events to open add dialog
    const handleOpenAddDialog = () => {
      console.log('Opening add equipment dialog...');
      setIsAddDialogOpen(true);
    };
    
    window.addEventListener('openAddEquipmentDialog', handleOpenAddDialog);
    
    // Also check if we should open the dialog immediately after navigation
    const shouldOpenDialog = sessionStorage.getItem('openAddDialog');
    if (shouldOpenDialog === 'true') {
      sessionStorage.removeItem('openAddDialog');
      setTimeout(() => {
        setIsAddDialogOpen(true);
      }, 100);
    }
    
    return () => {
      window.removeEventListener('openAddEquipmentDialog', handleOpenAddDialog);
    };
  }, []);

  const loadData = async () => {
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

  // Equipment CRUD operations
  const handleAddEquipment = async () => {
    try {
      if (!newEquipment.name || !newEquipment.type || newEquipment.quantity <= 0) {
        alert('Please fill in all required fields');
        return;
      }

      await equipmentService.addEquipment(newEquipment);
      alert('Equipment added successfully');
      setIsAddDialogOpen(false);
      setNewEquipment({ name: '', type: '', description: '', quantity: 0 });
      loadData();
    } catch (error) {
      console.error('Error adding equipment:', error);
      alert('Failed to add equipment');
    }
  };

  const handleEditEquipment = async () => {
    if (!editingEquipment) return;
    
    try {
      await equipmentService.updateEquipment(editingEquipment.id, editForm);
      alert('Equipment updated successfully');
      setIsEditDialogOpen(false);
      setEditingEquipment(null);
      setEditForm({});
      loadData();
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('Failed to update equipment');
    }
  };

  const handleDeleteEquipment = async () => {
    if (!deleteDialog.equipmentId) return;
    
    try {
      await equipmentService.deleteEquipment(deleteDialog.equipmentId);
      alert('Equipment deleted successfully');
      setDeleteDialog({ isOpen: false, equipmentId: null });
      loadData();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Failed to delete equipment');
    }
  };

  // Request management
  const handleApproveRequest = async (requestId: number) => {
    try {
      await equipmentService.approveEquipmentRequest(requestId);
      alert('Request approved successfully');
      loadData();
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await equipmentService.rejectEquipmentRequest(requestId, 'Rejected by admin');
      alert('Request rejected');
      loadData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  const handleHandoverEquipment = async (requestId: number) => {
    try {
      await equipmentService.handoverEquipment(requestId);
      alert('Equipment handed over');
      loadData();
    } catch (error) {
      console.error('Error handing over equipment:', error);
      alert('Failed to handover equipment');
    }
  };

  const handleReturnEquipment = async (requestId: number) => {
    try {
      await equipmentService.returnEquipment(requestId);
      alert('Equipment returned successfully');
      loadData();
    } catch (error) {
      console.error('Error returning equipment:', error);
      alert('Failed to return equipment');
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    
    try {
      await equipmentService.cancelEquipmentRequest(requestId);
      alert('Request cancelled successfully');
      loadData();
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request');
    }
  };

  // Helper functions
  const openEditDialog = (eq: Equipment) => {
    setEditingEquipment(eq);
    setEditForm({
      name: eq.name,
      type: eq.type,
      description: eq.description,
      quantity: 0 // For relative changes
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      handover: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    const color = statusColors[status.toLowerCase() as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Filter equipment and requests
  const filteredEquipment = equipment.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(request => {
    const matchesStatus = requestStatusFilter === 'all' || request.status.toLowerCase() === requestStatusFilter;
    const matchesSearch = !searchTerm || 
      request.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Count requests by status for filter buttons
  const requestCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    handover: requests.filter(r => r.status === 'handover').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading Equipment Management...</div>
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
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/resources/admin')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Admin Resources
                  </Button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipment Management</h1>
                <p className="text-gray-600">
                  Manage laboratory equipment inventory and approve equipment requests.
                </p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <Badge className="ml-2 bg-red-600">
                {requests.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Equipment Inventory ({filteredEquipment.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell>{eq.type}</TableCell>
                      <TableCell>{eq.quantity}</TableCell>
                      <TableCell>
                        <span className={eq.available_quantity === 0 ? 'text-red-600' : 'text-green-600'}>
                          {eq.available_quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={eq.available_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {eq.available_quantity > 0 ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(eq)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setDeleteDialog({ isOpen: true, equipmentId: eq.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredEquipment.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No equipment found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
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
    Handed Over ({requestCounts.handover})
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

          {/* Requests Display - Card Format for Better Visibility */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">No requests found</div>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{request.equipment?.name || 'Unknown Equipment'}</h3>
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
                          {request.notes && (
                            <div className="col-span-2 md:col-span-5">
                              <span className="font-medium">Notes:</span> {request.notes}
                            </div>
                          )}
                        </div>
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
                              onClick={() => handleHandoverEquipment(request.id)}
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
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Equipment Modal */}
      <Modal
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add New Equipment"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddEquipment(); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Equipment Name *
            </Label>
            <Input
              id="name"
              value={newEquipment.name}
              onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
              placeholder="Enter equipment name"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Equipment Type *
            </Label>
            <Input
              id="type"
              value={newEquipment.type}
              onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
              placeholder="e.g., Microscope, Computer, Lab Equipment"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity *
            </Label>
            <Input
              id="quantity"
              type="number"
              value={newEquipment.quantity}
              onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) || 0 })}
              placeholder="Enter quantity"
              className="w-full"
              min="1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={newEquipment.description}
              onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
              placeholder="Enter equipment description, specifications, or notes"
              className="w-full min-h-[80px] resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 pt-4 border-t">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Add Equipment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Equipment Modal */}
      <Modal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Equipment"
      >
        {editingEquipment && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder={editingEquipment.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Input
                id="edit-type"
                value={editForm.type || ''}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                placeholder={editingEquipment.type}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity Change (+ to add, - to subtract)</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={editForm.quantity || 0}
                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-sm text-gray-500">
                Current: {editingEquipment.quantity} total, {editingEquipment.available_quantity} available
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder={editingEquipment.description}
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditEquipment}>Update Equipment</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, equipmentId: null })}
        onConfirm={handleDeleteEquipment}
        title="Delete Equipment"
        description="Are you sure you want to delete this equipment? This action cannot be undone."
      />
        </div>
      </main>
    </div>
  );
};

export default EquipmentManagement;
