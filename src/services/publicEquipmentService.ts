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

// Equipment API (Public - No Auth Required)
export const equipmentService = {
  // Get all equipment
  async getAllEquipment(): Promise<Equipment[]> {
    const response = await apiClient.get('/public/equipment');
    return response.data;
  },

  // Get equipment by ID
  async getEquipmentById(id: number): Promise<Equipment> {
    const response = await apiClient.get(`/public/equipment/${id}`);
    return response.data;
  },

  // Add new equipment (No auth required for testing)
  async addEquipment(data: EquipmentCreateInput): Promise<Equipment> {
    const response = await apiClient.post('/public/equipment', data);
    return response.data;
  },

  // Update equipment (No auth required for testing)
  async updateEquipment(id: number, data: EquipmentUpdateInput): Promise<Equipment> {
    const response = await apiClient.put(`/public/equipment/${id}`, data);
    return response.data;
  },

  // Delete equipment (No auth required for testing)
  async deleteEquipment(id: number): Promise<void> {
    await apiClient.delete(`/public/equipment/${id}`);
  },

  // Create equipment request
  async createEquipmentRequest(data: EquipmentRequestCreateInput): Promise<EquipmentRequest> {
    const response = await apiClient.post('/public/equipment/request', data);
    return response.data;
  },

  // Get equipment requests (filtered by user role)
  async getEquipmentRequests(status?: string): Promise<EquipmentRequest[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get('/public/equipment/requests', { params });
    return response.data;
  },

  // Get specific equipment request
  async getEquipmentRequestById(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.get(`/public/equipment/requests/${id}`);
    return response.data;
  },

  // Approve equipment request (No auth required for testing)
  async approveEquipmentRequest(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/public/equipment/requests/${id}/approve`);
    return response.data;
  },

  // Reject equipment request (No auth required for testing)
  async rejectEquipmentRequest(id: number, notes?: string): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/public/equipment/requests/${id}/reject`, { notes });
    return response.data;
  },

  // Handover equipment (No auth required for testing)
  async handoverEquipment(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/public/equipment/requests/${id}/handover`);
    return response.data;
  },

  // Return equipment
  async returnEquipment(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/public/equipment/requests/${id}/return`);
    return response.data;
  },

  // Cancel equipment request
  async cancelEquipmentRequest(id: number): Promise<EquipmentRequest> {
    const response = await apiClient.put(`/public/equipment/requests/${id}/cancel`);
    return response.data;
  },
};
