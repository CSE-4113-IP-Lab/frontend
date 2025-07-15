import { apiClient } from './apiClient';

export interface AdmissionTimeline {
  id: number;
  program_id: number;
  application_start_date: string;
  application_end_date: string;
  admission_exam_date: string;
  result_publication_date: string;
  admission_confirmation_start_date: string;
  admission_confirmation_end_date: string;
  attachment_id?: number;
  attachment?: {
    id: number;
    url: string;
  };
}

export interface Program {
  id: number;
  name: string;
  description: string;
  duration: string;
}

export interface CreateAdmissionTimelineDto {
  program_id: number;
  application_start_date: string;
  application_end_date: string;
  admission_exam_date: string;
  result_publication_date: string;
  admission_confirmation_start_date: string;
  admission_confirmation_end_date: string;
  attachment?: File;
}

class AdmissionService {
  // Get all programs
  async getPrograms(): Promise<Program[]> {
    try {
      const response = await apiClient.get('/programs');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  // Get all admission timelines (requires authentication)
  async getAdmissionTimelines(): Promise<AdmissionTimeline[]> {
    try {
      console.log('Fetching admission timelines from API...');
      const token = localStorage.getItem('token');
      console.log('Current token:', token ? 'Present' : 'Missing');
      
      const path = '/admission-timelines/all';
      const response = await apiClient.get(path);
      
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      
      const data = Array.isArray(response.data) ? response.data : [response.data];
      console.log('Processed timelines data:', data);
      return data;
    } catch (error: any) {
      console.error('Error in getAdmissionTimelines:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Get public admission timelines (no authentication required)
  async getPublicAdmissionTimelines(): Promise<AdmissionTimeline[]> {
    try {
      console.log('Fetching public admission timelines from API...');
      
      const path = '/admission-timelines/public';
      const response = await apiClient.get(path);
      
      if (response.status >= 400) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = response.data;
      console.log('Public API Response data:', data);
      
      return Array.isArray(data) ? data : [data];
    } catch (error: any) {
      console.error('Error fetching admission timelines:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      return [];
    }
  }

  // Get single admission timeline
  async getAdmissionTimeline(id: number): Promise<AdmissionTimeline> {
    const response = await apiClient.get(`/admission-timelines/${id}`);
    return response.data;
  }

  // Create a new admission timeline with JSON data
  async createAdmissionTimeline(data: Omit<CreateAdmissionTimelineDto, 'attachment'>): Promise<AdmissionTimeline> {
    try {
      console.log('Creating admission timeline with data:', data);
      
      // Ensure program_id is a number and exists
      if (!data.program_id) {
        throw new Error('Program ID is required');
      }
      const payload = {
        ...data,
        program_id: Number(data.program_id)
      };
      
      const path = '/admission-timelines';
      const response = await apiClient.post(path, payload);
      
      console.log('Timeline created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating admission timeline:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }

  // Update admission timeline
  async updateAdmissionTimeline(
    id: number,
    data: Partial<CreateAdmissionTimelineDto>
  ): Promise<AdmissionTimeline> {
    try {
      console.log(`Updating admission timeline ${id}...`, data);
      
      const { attachment, ...updateData } = data;
      const path = `/admission-timelines/${id}`;
      const response = await apiClient.put(path, updateData);
      
      // If there's an attachment, upload it
      if (attachment) {
        const formData = new FormData();
        formData.append('file', attachment);
        
        await apiClient.put(
          `/admission-timelines/${id}/attachment`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        // Fetch the timeline again to get the updated data with attachment
        return this.getAdmissionTimeline(id);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating admission timeline ${id}:`, error);
      throw error;
    }
  }

  // Delete admission timeline
  async deleteAdmissionTimeline(id: number): Promise<void> {
    try {
      console.log(`Deleting admission timeline ${id}...`);
      await apiClient.delete(`/admission-timelines/${id}`);
    } catch (error) {
      console.error(`Error deleting admission timeline ${id}:`, error);
      throw error;
    }
  }
}

export const admissionService = new AdmissionService();
