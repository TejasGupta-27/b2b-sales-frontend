"use client";

import React, { useState } from 'react';
import { User, LogOut, Settings, Activity, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/auth/context';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'SALES_AGENT': return 'Sales Agent';
      case 'SALES_MANAGER': return 'Sales Manager';
      case 'ADMIN': return 'Administrator';
      case 'VIEWER': return 'Viewer';
      // Legacy support for lowercase values
      case 'sales_agent': return 'Sales Agent';
      case 'sales_manager': return 'Sales Manager';
      case 'admin': return 'Administrator';
      case 'viewer': return 'Viewer';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
      case 'admin': 
        return 'bg-red-100 text-red-800';
      case 'SALES_MANAGER':
      case 'sales_manager': 
        return 'bg-blue-100 text-blue-800';
      case 'SALES_AGENT':
      case 'sales_agent': 
        return 'bg-green-100 text-green-800';
      case 'VIEWER':
      case 'viewer': 
        return 'bg-gray-100 text-gray-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-xs text-gray-500">{getRoleDisplay(user.role)}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* User info header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRoleBadgeColor(user.role)}`}>
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
              </div>
              
              {/* Organization info - only show organization ID since we don't have full org details */}
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700">Organization ID</p>
                <p className="text-sm text-gray-900 font-mono">{user.organization_id}</p>
              </div>
            </div>

            {/* Account status */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Account Status</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Verification</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className={user.is_verified ? 'text-green-600' : 'text-yellow-600'}>
                    {user.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Usage limits - only show if available */}
            {(user.api_rate_limit || user.ai_token_limit) && (
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-700 mb-2">Usage Limits</p>
                <div className="space-y-2">
                  {user.api_rate_limit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">API Rate Limit</span>
                      <span className="text-gray-900">{user.api_rate_limit.toLocaleString()}/day</span>
                    </div>
                  )}
                  {user.ai_token_limit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">AI Token Limit</span>
                      <span className="text-gray-900">{user.ai_token_limit.toLocaleString()}/month</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Menu items */}
            <div className="p-2">
              <button
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
              
              <button
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Activity className="w-4 h-4" />
                <span>Usage Statistics</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 