"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, RegisterRequest } from '../types/auth';
import { authAPI, tokenManager } from './api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && authAPI.isAuthenticated();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenManager.getToken();
        const savedUser = tokenManager.getUser();
        
        if (token && savedUser) {
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
            tokenManager.setUser(currentUser);
          } catch (error) {
            // Token is invalid, clear stored data
            tokenManager.removeToken();
            tokenManager.removeUser();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user: userData } = response;
      
      tokenManager.setToken(access_token);
      tokenManager.setUser(userData);
      setUser(userData);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await authAPI.register(data);
      // After registration, automatically log in
      await login(data.email, data.password);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
      // Redirect to login page
      window.location.href = '/auth/login';
    }
  };

  const updateUser = async (updateData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = await authAPI.updateCurrentUser(updateData);
      setUser(updatedUser);
      tokenManager.setUser(updatedUser);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update user information.';
      throw new Error(message);
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!authAPI.isAuthenticated()) return;
    
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
      tokenManager.setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, user might be logged out
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 