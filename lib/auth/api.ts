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
    // Use relative URL to go through Next.js proxy
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    // Use relative URL to go through Next.js proxy
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  logout: async (): Promise<void> => {
    try {
      // Use relative URL to go through Next.js proxy
      const token = tokenManager.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers,
      });
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      tokenManager.removeToken();
      tokenManager.removeUser();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    // Use relative URL to go through Next.js proxy
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  updateCurrentUser: async (updateData: Partial<User>): Promise<User> => {
    // Use relative URL to go through Next.js proxy
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch('/api/auth/me', {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  getUsageStats: async (): Promise<UsageStats> => {
    // Use relative URL to go through Next.js proxy
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch('/api/auth/usage', {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
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