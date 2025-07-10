export enum UserRole {
  ADMIN = 'ADMIN',
  SALES_MANAGER = 'SALES_MANAGER', 
  SALES_AGENT = 'SALES_AGENT',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole | string;
  organization_id: string;
  is_active: boolean;
  is_verified: boolean;
  api_rate_limit?: number;
  ai_token_limit?: number;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  org_type: string;
  max_users: number;
  max_leads: number;
  ai_token_limit_monthly: number;
  is_active: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole | string;
  organization_id: string;
}

export interface UsageStats {
  api_calls_used: number;
  api_calls_limit: number;
  ai_tokens_used: number;
  ai_tokens_limit: number;
  current_period_start: string;
  current_period_end: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
} 