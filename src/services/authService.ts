import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  type: string;
  email: string;
  user_role: string;
  user_id: number;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  role: string;
}

// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store token in localStorage with the correct key
    localStorage.setItem('accessToken', response.data.access_token);
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('id', response.data.user_id.toString());
    localStorage.setItem('role', response.data.user_role);
    
    return response.data;
  },

  // Signup user
  async signup(userData: SignupRequest): Promise<any> {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  // Logout user
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  },

  // Get current user info from localStorage
  getCurrentUser(): any {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    
    if (token && role && id) {
      return {
        id,
        role,
        token
      };
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
};
