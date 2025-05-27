'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { ShoppingCart, Plus, MessageSquare, Search, MoreHorizontal, Trash2 } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

  // Load chat sessions on component mount
  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`);
      if (response.ok) {
        const data = await response.json();
        const sessions: ChatSession[] = data.leads.map((lead: any) => ({
          id: lead.id,
          title: lead.company_name !== 'Unknown' ? lead.company_name : 
                 lead.contact_name !== 'Unknown' ? lead.contact_name : 
                 `Chat ${lead.id.slice(-6)}`,
          lastMessage: lead.last_message || 'No messages yet',
          timestamp: new Date(lead.last_message_time || lead.created_at),
          messageCount: 0 // We'll update this if needed
        }));
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
    // Force a re-render by updating the key
  };

  const selectChat = (leadId: string) => {
    setCurrentLeadId(leadId);
  };

  const deleteChat = async (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete functionality
    console.log('Delete chat:', leadId);
  };

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <Layout>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-80 bg-gray-900 text-white flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingSessions ? (
              <div className="p-4 text-center text-gray-400">
                Loading conversations...
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => selectChat(session.id)}
                    className={`group relative flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentLeadId === session.id
                        ? 'bg-gray-800 border border-gray-600'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white truncate">
                          {session.title}
                        </h3>
                        <span className="text-xs text-gray-400 ml-2">
                          {formatTimestamp(session.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {session.lastMessage}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteChat(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sales Agent</p>
                <p className="text-xs text-gray-400">agent@company.com</p>
              </div>
              <button className="p-1 hover:bg-gray-800 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentLeadId ? (
            <ChatInterface 
              key={currentLeadId}
              leadId={currentLeadId} 
              onNewMessage={loadChatSessions}
            />
          ) : (
            <ChatInterface 
              key="new-chat"
              leadId={null} 
              onNewMessage={loadChatSessions}
            />
          )}
        </div>
      </div>
    </Layout>
  );
} 