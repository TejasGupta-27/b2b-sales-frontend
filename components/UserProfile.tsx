"use client";

import React, { useState } from 'react';
import { User, LogOut, Settings, Activity, ChevronDown, Shield, Zap, Clock } from 'lucide-react';
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
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'SALES_MANAGER':
      case 'sales_manager': 
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'SALES_AGENT':
      case 'sales_agent': 
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'VIEWER':
      case 'viewer': 
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
      default: 
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
      case 'admin': 
        return <Shield className="w-3 h-3" />;
      case 'SALES_MANAGER':
      case 'sales_manager': 
        return <Zap className="w-3 h-3" />;
      case 'SALES_AGENT':
      case 'sales_agent': 
        return <User className="w-3 h-3" />;
      case 'VIEWER':
      case 'viewer': 
        return <Clock className="w-3 h-3" />;
      default: 
        return <User className="w-3 h-3" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-200"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">{getRoleDisplay(user.role)}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-300 group-hover:text-gray-600 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-10 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute left-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-20 ml-4 overflow-hidden backdrop-blur-xl">
            {/* User info header */}
            <div className="relative bg-gradient-to-br from-slate-50 to-gray-100 p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate mb-2">{user.email}</p>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getRoleBadgeColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span>{getRoleDisplay(user.role)}</span>
                  </span>
                </div>
              </div>
              
              {/* Organization info */}
              <div className="mt-4 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50">
                <p className="text-xs font-semibold text-gray-700 mb-1">Organization ID</p>
                <p className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded-lg inline-block">{user.organization_id}</p>
              </div>
            </div>

            {/* Account status */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Account Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-sm font-medium ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verification</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user.is_verified ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className={`text-sm font-medium ${user.is_verified ? 'text-green-600' : 'text-amber-600'}`}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage limits */}
            {(user.api_rate_limit || user.ai_token_limit) && (
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Usage Limits</h4>
                <div className="space-y-3">
                  {user.api_rate_limit && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-sm text-gray-600">API Rate Limit</span>
                      <span className="text-sm font-semibold text-gray-900 bg-blue-100 px-2 py-1 rounded-full">
                        {user.api_rate_limit.toLocaleString()}/day
                      </span>
                    </div>
                  )}
                  {user.ai_token_limit && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-sm text-gray-600">AI Token Limit</span>
                      <span className="text-sm font-semibold text-gray-900 bg-purple-100 px-2 py-1 rounded-full">
                        {user.ai_token_limit.toLocaleString()}/month
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Menu items */}
            <div className="p-4">
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200 hover:shadow-sm group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="font-medium">Account Settings</span>
              </button>
              
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200 hover:shadow-sm group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-medium">Usage Statistics</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-200 hover:shadow-sm group mt-2"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}