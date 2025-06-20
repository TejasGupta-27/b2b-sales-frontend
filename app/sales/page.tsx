'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  ShoppingCart, 
  Plus, 
  MessageSquare, 
  Search, 
  MoreHorizontal, 
  Trash2,
  Menu,
  X,
  Settings,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  Archive,
  Star,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from "../../i18n";

const API_BASE_URL = '/api';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export default function SalesPage() {
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const { language } = useLanguage();
  const t = translations[language];
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'closed' | 'starred'>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  // Load chat sessions on component mount
  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await fetch(`${API_BASE_URL}/leads`);
      if (response.ok) {
        const data = await response.json();
        const sessions: ChatSession[] = data.leads.map((lead: any, index: number) => ({
          id: lead.id,
          title: lead.company_name !== 'Unknown' ? lead.company_name : 
                 lead.contact_name !== 'Unknown' ? lead.contact_name : 
                 `Chat ${lead.id.slice(-6)}`,
          lastMessage: lead.last_message || 'No messages yet',
          timestamp: new Date(lead.last_message_time || lead.created_at),
          messageCount: Math.floor(Math.random() * 20) + 1
        }));
  
        sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setChatSessions(sessions);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const startNewChat = () => {
    setCurrentLeadId(null);
    setChatKey(prev => prev + 1);
  };

  const selectChat = (leadId: string) => {
    setCurrentLeadId(leadId);
    setChatKey(prev => prev + 1);
  };

  const deleteChat = async (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(session => session.id !== leadId));
    if (currentLeadId === leadId) {
      setCurrentLeadId(null);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMinimize = () => {
    setSidebarMinimized(!sidebarMinimized);
  };

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <Layout>
      <div className="flex h-screen bg-white">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Mobile Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 lg:hidden bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-16'} 
                fixed h-full bg-gray-50 border-r border-gray-200 
                flex flex-col z-50 transition-all duration-300 ease-in-out`}>
          
          {/* Sidebar Header */}
          <div className={`p-4 border-b ${sidebarOpen ? 'border-gray-200' : 'border-gray-700'}`}>
            <div className={`flex items-center justify-between mb-4 ${!sidebarOpen ? 'justify-center' : ''}`}>
              <div className={`flex items-center space-x-2 ${!sidebarOpen ? 'justify-center' : ''}`}>
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                {sidebarOpen && <span className="font-bold text-gray-900">{t.agentLabel || "Sales Agent"}</span>}
              </div>
              {sidebarOpen && (
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Settings className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={toggleSidebar}
                    className="p-1 hover:bg-gray-200 rounded lg:hidden"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            {sidebarOpen ? (
              <button
                onClick={startNewChat}
                className="w-full flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-3 py-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">{t.newChat || "New Chat"}</span>
              </button>
            ) : (
              <button
                onClick={startNewChat}
                className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white rounded-lg p-2 transition-colors"
                title={t.newChat || "New Chat"}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search - Only show when expanded */}
          {sidebarOpen && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder || "Search conversations..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingSessions ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                {sidebarOpen && <span>{t.loading || "Loading conversations..."}</span>}
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                {sidebarOpen && (
                  <p className="text-sm">
                    {searchTerm
                      ? t.noMatchesFound || "No conversations found"
                      : t.noConversations || "No conversations yet"}
                  </p>
                )}
              </div>


            ) : (
              <div className="space-y-1 p-2">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => selectChat(session.id)}
                    onMouseEnter={() => setHoveredSession(session.id)}
                    onMouseLeave={() => setHoveredSession(null)}
                    className={`group relative flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentLeadId === session.id
                        ? 'bg-gray-200'
                        : 'hover:bg-gray-100'
                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                    title={!sidebarOpen ? session.title : undefined}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {session.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {sidebarOpen && (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {session.title}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTimestamp(session.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {session.lastMessage}
                          </p>
                        </div>

                        {(hoveredSession === session.id || currentLeadId === session.id) && (
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Archive functionality
                              }}
                              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Archive"
                            >
                              <Archive className="w-3 h-3 text-gray-500" />
                            </button>
                            <button
                              onClick={(e) => deleteChat(session.id, e)}
                              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center space-x-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {t.agentLabel || "Sales Agent"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {t.agentEmail || "agent@company.com"}
                </p>
              </div>
              <button className="p-1 hover:bg-gray-200 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Integrated Toggle Button */}
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={toggleSidebar}
              className="group relative bg-white border border-gray-200 hover:border-orange-300 rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Toggle Icon */}
              <div className="flex items-center justify-center w-6 h-6">
                <div className="flex items-center space-x-1">
                  <div className={`w-0 h-0 transition-all duration-200 ${sidebarOpen ? 'border-r-4 border-r-orange-500 border-t-2 border-b-2 border-t-transparent border-b-transparent' : 'border-l-4 border-l-orange-500 border-t-2 border-b-2 border-t-transparent border-b-transparent'}`}></div>
                  <div className="w-0.5 h-3 bg-orange-500"></div>
                  <div className={`w-0 h-0 transition-all duration-200 ${sidebarOpen ? 'border-l-4 border-l-orange-500 border-t-2 border-b-2 border-t-transparent border-b-transparent' : 'border-r-4 border-r-orange-500 border-t-2 border-b-2 border-t-transparent border-b-transparent'}`}></div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-16'}`}>
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentLeadId ? 
                    filteredSessions.find(s => s.id === currentLeadId)?.title.charAt(0).toUpperCase() : 
                    '+'
                  }
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentLeadId ? 
                    filteredSessions.find(s => s.id === currentLeadId)?.title || 'Chat' : 
                    t.newconvo||'New Conversation'
                  }
                </h1>
                <p className="text-sm text-gray-500">
                  {currentLeadId ? t.activeConversation||'Active conversation' : t.startConversation||'Start a new conversation with a lead'}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Interface Container */}
          <div className="flex-1 bg-white relative">
            <ChatInterface 
              key={currentLeadId ? `lead-${currentLeadId}-${chatKey}` : `new-chat-${chatKey}`}
              leadId={currentLeadId} 
              onNewMessage={loadChatSessions}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}