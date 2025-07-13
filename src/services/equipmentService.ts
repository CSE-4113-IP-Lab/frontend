import { apiClient } from './apiClient';

// Types for Equipment and Requests
export interface Equipment {
  id: number;
  name: string;
  type: string;
  description?: string;
  quantity: number;
  available_quantity: number;
  image_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentCreateInput {
  name: string;
  type: string;
  description?: string;
  quantity: number;
}

export interface EquipmentUpdateInput {
  name?: string;
  type?: string;
  description?: string;
  quantity?: number; // For relative changes (+/-)
}

export interface EquipmentRequest {
  id: number;
  equipment_id: number;
  user_id: number;
  quantity: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'handover' | 'completed' | 'cancelled';
  request_date: string;
  approved_date?: string;
  approved_by_id?: number;
  handover_date?: string;
  return_date?: string;
  notes?: string;
  equipment?: Equipment;
}

export interface EquipmentRequestCreateInput {
  equipment_id: number;
  quantity: number;
  purpose: string;
}

// Equipment API
export const equipmentService = {
  // Get all equipment
  async getAllEquipment(): Promise<Equipment[]> {
    const response = await apiClient.get('/equipment');
    return response.data;
  },

  // Get equipment by ID
  async getEquipmentById(id: number): Promise<Equipment> {
    const response = await apiClient.get(`/equipment/${id}`);
    return response.data;
  },

  // Add new equipment (Admin/Staff only)
  async addEquipment(data: EquipmentCreateInput): Promise<Equipment> {
    const response = await apiClient.post('/equipment', data);
    return response.data;
  },

  // Update equipment (Admin/Staff only)
  async updateEquipment(id: number, data: EquipmentUpdateInput): Promise<Equipment> {
    const response = await apiClient.put(`/equipment/${id}`, data);
    return response.data;
  },

  // Delete equipment (Admin/Staff only)
  async deleteEquipment(id: number): Promise<void> {
    await apiClient.delete(`/equipment/${id}`);
  },

  // Create equipment request
  async createEquipmentRequest(data: EquipmentRequestCreateInput): Promise<EquipmentRequest> {
    const response = await apiClient.post('/equipment/request', data);
    return response.data;
  },

  // Get equipment requests (filtered by user role)
  async getEquipmentRequests(status?: string): Promise<EquipmentRequest[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get('/equipment/requests', { params });
    return response.data;
  },

  // Get specific equipment request
  async getEquipmentRequestById(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.get(`/equipment/requests/${id}`);
    return response.data;
  },

  // Approve equipment request (Admin/Staff only)
  async approveEquipmentRequest(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/equipment/requests/${id}/approve`);
    return response.data;
  },

  // Reject equipment request (Admin/Staff only)
  async rejectEquipmentRequest(id: number, notes?: string): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/equipment/requests/${id}/reject`, { notes });
    return response.data;
  },

  // Handover equipment (Admin/Staff only)
  async handoverEquipment(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/equipment/requests/${id}/handover`);
    return response.data;
  },

  // Return equipment
  async returnEquipment(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/equipment/requests/${id}/return`);
    return response.data;
  },

  // Cancel equipment request
  async cancelEquipmentRequest(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/equipment/requests/${id}/cancel`);
    return response.data;
  },
};
