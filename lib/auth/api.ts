import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { LoginRequest, LoginResponse, RegisterRequest, User, UsageStats, Organization } from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'access_token';
const USER_KEY = 'user_data';

export const tokenManager = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 day
  },
  
  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || null;
  },
  
  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },
  
  setUser: (user: User) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 1 });
  },
  
  getUser: (): User | null => {
    const userData = Cookies.get(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  
  removeUser: () => {
    Cookies.remove(USER_KEY);
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenManager.removeToken();
      tokenManager.removeUser();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response: AxiosResponse<User> = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      tokenManager.removeToken();
      tokenManager.removeUser();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<User> = await apiClient.get('/api/auth/me');
    return response.data;
  },

  updateCurrentUser: async (updateData: Partial<User>): Promise<User> => {
    const response: AxiosResponse<User> = await apiClient.put('/api/auth/me', updateData);
    return response.data;
  },

  getUsageStats: async (): Promise<UsageStats> => {
    const response: AxiosResponse<UsageStats> = await apiClient.get('/api/auth/usage');
    return response.data;
  },

  getPublicOrganizations: async (): Promise<Organization[]> => {
    // Use relative URL to go through Next.js proxy
    const response = await fetch('/api/organizations/public');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Helper function to check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = tokenManager.getToken();
    const user = tokenManager.getUser();
    return !!(token && user);
  }
};

export default apiClient; 