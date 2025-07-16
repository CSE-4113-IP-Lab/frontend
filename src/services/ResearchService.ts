import apiClient from "./apiClient";

// Types
export interface Supervisor {
  username: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  id: number;
  is_verified: number;
  image_id: number;
  image: {
    id: number;
    url: string;
  };
}

export interface ResearchContribution {
  type: string;
  title: string;
  description: string;
  date: string;
  institution: string;
  journal: string;
  link: string;
  supervisor_id: number;
  id: number;
  user_id: number;
  supervisor: Supervisor;
  user: Supervisor;
}

export interface ResearchFilters {
  skip?: number;
  limit?: number;
  type?: string;
  title?: string;
  institution?: string;
  journal?: string;
  date_from?: string;
  date_to?: string;
  supervisor_id?: number;
}

export interface CreateResearchData {
  type: string;
  title: string;
  description: string;
  date: string;
  institution: string;
  journal: string;
  link: string;
  supervisor_id: number;
}

// API Service
class ResearchService {
  private baseUrl = '/api/v1';

  async getResearchContributions(filters: ResearchFilters = {}): Promise<ResearchContribution[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/researchs?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to fetch research contributions');
      }
      console.log(response)
      return response.data;
      
    } catch (error) {
      console.warn('Using dummy data due to API error:', error);
      return this.getDummyData();
    }
  }

  async getResearchById(id: number): Promise<ResearchContribution> {
    try {
      const response = await apiClient.get(`/researchs/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to fetch research contribution');
      }

      return response.data;
    } catch (error) {
      console.warn('Using dummy data due to API error:', error);
      const dummyData = this.getDummyData();
      const contribution = dummyData.find(c => c.id === id);
      if (!contribution) {
        throw new Error('Research contribution not found');
      }
      return contribution;
    }
  }

  async getResearchByUser(userId: number): Promise<ResearchContribution[]> {
    try {
      const response = await apiClient.get(`/researchs/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to fetch user research contributions');
      }

      return response.data;
    } catch (error) {
      console.warn('Using dummy data due to API error:', error);
      const dummyData = this.getDummyData();
      return dummyData.filter(c => c.user_id === userId);
    }
  }

  async createResearch(data: CreateResearchData): Promise<ResearchContribution> {
    try {
      const response = await apiClient.post(`/researchs`,data, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to create research contribution');
      }

      return response.data;
    } catch (error) {
      console.warn('Simulating research creation due to API error:', error);
      // Simulate successful creation
      return {
        ...data,
        id: Date.now(),
        user_id: 1,
        supervisor: {
          username: "Dr. Sample Supervisor",
          email: "supervisor@example.com",
          phone: "+1234567890",
          gender: "Male",
          role: "supervisor",
          id: data.supervisor_id,
          is_verified: 1,
          image_id: 1,
          image: { id: 1, url: "/api/placeholder/40/40" }
        },
        user: {
          username: "Current User",
          email: "user@example.com",
          phone: "+1234567890",
          gender: "Male",
          role: "user",
          id: 1,
          is_verified: 1,
          image_id: 1,
          image: { id: 1, url: "/api/placeholder/40/40" }
        }
      };
    }
  }

  async updateResearch(id: number, data: Partial<CreateResearchData>): Promise<ResearchContribution> {
    try {
      const response = await apiClient.put(`/researchs/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to update research contribution');
      }

      return response.data;
    } catch (error) {
      console.warn('Simulating research update due to API error:', error);
      throw error;
    }
  }

  async deleteResearch(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`/researchs/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to delete research contribution');
      }
    } catch (error) {
      console.warn('Simulating research deletion due to API error:', error);
      // Simulate successful deletion
    }
  }

  private getToken(): string {
    // Get token from localStorage, sessionStorage, or context
    return localStorage.getItem('accessToken') || 'dummy-token';
  }

  private getDummyData(): ResearchContribution[] {
    return [
      {
        id: 1,
        type: "Grant",
        title: "Developing AI-driven solutions for sustainable agriculture",
        description: "Research focused on implementing artificial intelligence technologies to improve sustainable farming practices and crop yield optimization.",
        date: "2023",
        institution: "Agricultural Research Institute",
        journal: "National Science Foundation",
        link: "https://example.com/grant1",
        supervisor_id: 1,
        user_id: 1,
        supervisor: {
          username: "Dr. Anya Sharma",
          email: "anya.sharma@example.com",
          phone: "+1234567890",
          gender: "Female",
          role: "supervisor",
          id: 1,
          is_verified: 1,
          image_id: 1,
          image: { id: 1, url: "/api/placeholder/40/40" }
        },
        user: {
          username: "Research Assistant",
          email: "assistant@example.com",
          phone: "+1234567891",
          gender: "Male",
          role: "user",
          id: 1,
          is_verified: 1,
          image_id: 1,
          image: { id: 1, url: "/api/placeholder/40/40" }
        }
      },
      {
        id: 2,
        type: "Fellowship",
        title: "Postdoctoral Fellowship in AI Ethics",
        description: "Advanced research in ethical implications of artificial intelligence in healthcare and education sectors.",
        date: "2023",
        institution: "Institute for Ethical AI",
        journal: "Center for AI Ethics",
        link: "https://example.com/fellowship1",
        supervisor_id: 2,
        user_id: 2,
        supervisor: {
          username: "Dr. Fiona Green",
          email: "fiona.green@example.com",
          phone: "+1234567892",
          gender: "Female",
          role: "supervisor",
          id: 2,
          is_verified: 1,
          image_id: 2,
          image: { id: 2, url: "/api/placeholder/40/40" }
        },
        user: {
          username: "Research Fellow",
          email: "fellow@example.com",
          phone: "+1234567893",
          gender: "Female",
          role: "user",
          id: 2,
          is_verified: 1,
          image_id: 2,
          image: { id: 2, url: "/api/placeholder/40/40" }
        }
      },
      {
        id: 3,
        type: "Publication",
        title: "AI for Sustainable Agriculture: A Review",
        description: "Comprehensive review of current AI applications in sustainable farming and future research directions.",
        date: "2023",
        institution: "University Research Center",
        journal: "Journal of Sustainable Agriculture",
        link: "https://example.com/publication1",
        supervisor_id: 1,
        user_id: 3,
        supervisor: {
          username: "Dr. Anya Sharma",
          email: "anya.sharma@example.com",
          phone: "+1234567890",
          gender: "Female",
          role: "supervisor",
          id: 1,
          is_verified: 1,
          image_id: 1,
          image: { id: 1, url: "/api/placeholder/40/40" }
        },
        user: {
          username: "Research Author",
          email: "author@example.com",
          phone: "+1234567894",
          gender: "Male",
          role: "user",
          id: 3,
          is_verified: 1,
          image_id: 3,
          image: { id: 3, url: "/api/placeholder/40/40" }
        }
      },
      {
        id: 4,
        type: "Grant",
        title: "Enhancing cybersecurity in IoT devices",
        description: "Research project aimed at developing advanced security protocols for Internet of Things devices in smart home environments.",
        date: "2022",
        institution: "Cybersecurity Research Lab",
        journal: "Cybersecurity Research Initiative",
        link: "https://example.com/grant2",
        supervisor_id: 3,
        user_id: 4,
        supervisor: {
          username: "Dr. Ben Carter",
          email: "ben.carter@example.com",
          phone: "+1234567895",
          gender: "Male",
          role: "supervisor",
          id: 3,
          is_verified: 1,
          image_id: 3,
          image: { id: 3, url: "/api/placeholder/40/40" }
        },
        user: {
          username: "Security Researcher",
          email: "security@example.com",
          phone: "+1234567896",
          gender: "Male",
          role: "user",
          id: 4,
          is_verified: 1,
          image_id: 4,
          image: { id: 4, url: "/api/placeholder/40/40" }
        }
      },
      {
        id: 5,
        type: "Fellowship",
        title: "Research Fellowship in Cybersecurity",
        description: "Advanced fellowship program focusing on cybersecurity research and development in enterprise environments.",
        date: "2022",
        institution: "Center for Cybersecurity Studies",
        journal: "Cybersecurity Foundation",
        link: "https://example.com/fellowship2",
        supervisor_id: 4,
        user_id: 5,
        supervisor: {
          username: "Dr. George Harris",
          email: "george.harris@example.com",
          phone: "+1234567897",
          gender: "Male",
          role: "supervisor",
          id: 4,
          is_verified: 1,
          image_id: 4,
          image: { id: 4, url: "/api/placeholder/40/40" }
        },
        user: {
          username: "Cybersecurity Fellow",
          email: "fellow2@example.com",
          phone: "+1234567898",
          gender: "Female",
          role: "user",
          id: 5,
          is_verified: 1,
          image_id: 5,
          image: { id: 5, url: "/api/placeholder/40/40" }
        }
      },
      {
        id: 6,
        type: "Publication",
        title: "Cybersecurity in IoT: Challenges and Solutions",
        description: "Research paper examining current cybersecurity challenges in IoT ecosystems and proposing innovative solutions.",
        date: "2022",
        institution: "Tech Security Institute",
        journal: "International Conference on IoT Security",
        link: "https://example.com/publication2",
        supervisor_id: 3,
        user_id: 6,
        supervisor: {
          username: "Dr. Ben Carter",
          email: "ben.carter@example.com",
          phone: "+1234567895",
          gender: "Male",
          role: "supervisor",
          id: 3,
          is_verified: 1,
          image_id: 3,
          image: { id: 3, url: "/api/placeholder/40/40" }
        },
        user: {
          username: "IoT Researcher",
          email: "iot@example.com",
          phone: "+1234567899",
          gender: "Female",
          role: "user",
          id: 6,
          is_verified: 1,
          image_id: 6,
          image: { id: 6, url: "/api/placeholder/40/40" }
        }
      }
    ];
  }
}

// Create service instance
export const researchService = new ResearchService();