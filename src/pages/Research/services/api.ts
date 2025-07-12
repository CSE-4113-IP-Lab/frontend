import axios from 'axios';
// Import or define the ResearchContribution type
import type { ResearchContribution } from '../../../types'; // Adjust the path as needed

const API_BASE_URL = 'http://your-api-url/researchs';

export const researchApi = {
  getContributions: () => axios.get(API_BASE_URL),
  getContributionsByUser: (userId: number) => axios.get(`${API_BASE_URL}/user/${userId}`),
  createContribution: (data: Omit<ResearchContribution, 'id'>) => 
    axios.post(API_BASE_URL, data),
  updateContribution: (id: number, data: Partial<ResearchContribution>) =>
    axios.put(`${API_BASE_URL}/${id}`, data),
  deleteContribution: (id: number) =>
    axios.delete(`${API_BASE_URL}/${id}`),
};