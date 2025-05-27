'use client';

import { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  User, 
  Search,
  MoreHorizontal,
  Trash2,
  Edit3,
  Archive,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

export default function Sidebar({ isOpen, onClose, onNewChat, onSelectChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Mock chat history data
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'React Component Help',
      lastMessage: 'How to create a reusable button component?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isActive: true
    },
    {
      id: '2',
      title: 'Python Data Analysis',
      lastMessage: 'Can you help me with pandas dataframes?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      title: 'Travel Planning',
      lastMessage: 'Best places to visit in Japan during spring',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: '4',
      title: 'Machine Learning Basics',
      lastMessage: 'Explain neural networks in simple terms',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: '5',
      title: 'Cooking Recipe Ideas',
      lastMessage: 'Quick and healthy dinner recipes',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    }
  ]);

  const filteredChats = chatSessions.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
              Recent Chats
            </h3>
            
            {filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {searchQuery ? 'No chats found' : 'No chat history yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    onSelect={() => onSelectChat(chat.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-slate-900 dark:text-slate-100">John Doe</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">john@example.com</p>
              </div>
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl py-2 z-10">
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                  <span className="text-slate-700 dark:text-slate-300">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
                
                <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">Settings</span>
                </button>
                
                <hr className="my-2 border-slate-200 dark:border-slate-600" />
                
                <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ChatHistoryItem({ chat, onSelect }: { chat: ChatSession; onSelect: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${
          chat.isActive ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate ${
              chat.isActive 
                ? 'text-blue-900 dark:text-blue-100' 
                : 'text-slate-900 dark:text-slate-100'
            }`}>
              {chat.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
              {chat.lastMessage}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {formatTimestamp(chat.timestamp)}
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </button>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute right-2 top-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl py-1 z-20 min-w-[120px]">
          <button className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left">
            <Edit3 className="w-3 h-3 text-slate-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Rename</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left">
            <Archive className="w-3 h-3 text-slate-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Archive</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 dark:text-red-400">
            <Trash2 className="w-3 h-3" />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
} 