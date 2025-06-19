// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { 
//   Plus, 
//   MessageSquare, 
//   Settings, 
//   User, 
//   Search,
//   MoreHorizontal,
//   Trash2,
//   Edit3,
//   Archive,
//   Moon,
//   Sun,
//   LogOut,
//   X,
//   Menu,
//   Clock,
//   Star,
//   Filter,
//   ChevronDown,
//   Sparkles,
//   Zap,
//   Bot,
//   Send,
//   Mic,
//   Paperclip,
//   Smile,
//   Code,
//   FileText,
//   Image,
//   Music,
//   Video,
//   BarChart2,
//   File,
//   Folder,
//   FolderOpen
// } from 'lucide-react';


// interface ChatSession {
//   id: string;
//   title: string;
//   lastMessage: string;
//   timestamp: Date;
//   isActive: boolean;
//   isPinned?: boolean;
//   category?: 'today' | 'yesterday' | 'week' | 'older';
// }

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onNewChat: () => void;
//   onSelectChat: (chatId: string) => void;
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// export default function Sidebar({ isOpen, onClose, onNewChat, onSelectChat }: SidebarProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hoveredChat, setHoveredChat] = useState<string | null>(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState<'all' | 'pinned' | 'recent'>('all');
//   const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['today', 'yesterday']));
//   const [showAITools, setShowAITools] = useState(false);
  
//   const searchInputRef = useRef<HTMLInputElement>(null);
  
//   useEffect(() => {
//     if (isOpen) {
//       loadChatSessions();
//     }
//   }, [isOpen]);

//   const loadChatSessions = async () => {
//     setIsLoading(true);
//     try {
//       // Enhanced mock data with categories and pins
//       const mockSessions: ChatSession[] = [
//         {
//           id: 'chat_1',
//           title: 'Product Launch Strategy',
//           lastMessage: 'Let\'s discuss the Q4 product launch timeline...',
//           timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
//           isActive: true,
//           isPinned: true,
//           category: 'today'
//         },
//         {
//           id: 'chat_2',
//           title: 'Customer Analytics Review',
//           lastMessage: 'The conversion rates have improved by 15%...',
//           timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
//           isActive: false,
//           isPinned: false,
//           category: 'today'
//         },
//         {
//           id: 'chat_3',
//           title: 'Team Performance Metrics',
//           lastMessage: 'Great work on the monthly targets!',
//           timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
//           isActive: false,
//           isPinned: true,
//           category: 'yesterday'
//         },
//         {
//           id: 'chat_4',
//           title: 'Marketing Campaign Ideas',
//           lastMessage: 'The social media strategy looks promising...',
//           timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
//           isActive: false,
//           isPinned: false,
//           category: 'week'
//         },
//         {
//           id: 'chat_5',
//           title: 'Budget Planning Session',
//           lastMessage: 'We need to allocate resources for next quarter...',
//           timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
//           isActive: false,
//           isPinned: false,
//           category: 'older'
//         },
//         {
//           id: 'chat_6',
//           title: 'Technical Documentation',
//           lastMessage: 'The API documentation needs to be updated...',
//           timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
//           isActive: false,
//           isPinned: true,
//           category: 'week'
//         },
//         {
//           id: 'chat_7',
//           title: 'Competitor Analysis',
//           lastMessage: 'Competitor X just launched a new feature...',
//           timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
//           isActive: false,
//           isPinned: false,
//           category: 'older'
//         }
//       ];
//       setChatSessions(mockSessions);
//     } catch (error) {
//       console.error('Error loading chat sessions:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredChats = chatSessions.filter(chat => {
//     const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
//     if (selectedFilter === 'pinned') return matchesSearch && chat.isPinned;
//     if (selectedFilter === 'recent') return matchesSearch && chat.category === 'today';
//     return matchesSearch;
//   });

//   const groupedChats = filteredChats.reduce((groups, chat) => {
//     const category = chat.category || 'older';
//     if (!groups[category]) groups[category] = [];
//     groups[category].push(chat);
//     return groups;
//   }, {} as Record<string, ChatSession[]>);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     document.documentElement.classList.toggle('dark');
//   };

//   const toggleSection = (section: string) => {
//     const newExpanded = new Set(expandedSections);
//     if (newExpanded.has(section)) {
//       newExpanded.delete(section);
//     } else {
//       newExpanded.add(section);
//     }
//     setExpandedSections(newExpanded);
//   };

//   const getCategoryTitle = (category: string) => {
//     const titles = {
//       today: 'Today',
//       yesterday: 'Yesterday',
//       week: 'Previous 7 days',
//       older: 'Older'
//     };
//     return titles[category as keyof typeof titles] || 'Other';
//   };

//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case 'today': return <Zap className="w-4 h-4 text-green-500" />;
//       case 'yesterday': return <Clock className="w-4 h-4 text-blue-500" />;
//       case 'week': return <MessageSquare className="w-4 h-4 text-purple-500" />;
//       default: return <Archive className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const toggleAITools = () => {
//     setShowAITools(!showAITools);
//   };

//   const handleNewChat = () => {
//     onNewChat();
//     setShowAITools(false);
//   };

//   return (
//     <>
//       {/* Mobile overlay with blur effect */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
//           onClick={onClose}
//         />
//       )}

//       {/* Enhanced Sidebar */}
//       <div className={`
//         fixed inset-y-0 left-0 z-50 w-80 
//         bg-gradient-to-b from-white via-white to-gray-50
//         dark:from-gray-900 dark:via-gray-900 dark:to-gray-800
//         border-r border-gray-200/80 dark:border-gray-700/80
//         backdrop-blur-xl
//         transform transition-all duration-300 ease-out
//         ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
//         lg:translate-x-0 lg:static lg:z-auto lg:shadow-lg
//       `}>
        
//         {/* Enhanced Header with gradient */}
//         <div className="relative p-4 border-b border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
//                   <Bot className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   AI Assistant
//                 </h1>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Always ready to help</p>
//               </div>
//             </div>
            
//             <button
//               onClick={onClose}
//               className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200 hover:scale-105"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Enhanced New Chat Button */}
//         <div className="p-4">
//           <button
//             onClick={toggleAITools}
//             className="group w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] relative overflow-hidden"
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//             <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
//             <span>New Chat</span>
//             <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
//           </button>
//         </div>

//         {/* AI Tools Modal */}
//         {showAITools && (
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center p-4 animate-in fade-in duration-300">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all duration-300 scale-95 animate-in zoom-in">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Chat</h2>
//                 <button 
//                   onClick={() => setShowAITools(false)}
//                   className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer">
//                   <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
//                     <FileText className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Text Assistant</h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Chat with AI about any topic</p>
//                 </div>
                
//                 <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer">
//                   <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-3">
//                     <Code className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Code Assistant</h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Generate and debug code</p>
//                 </div>
                
//                 <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer">
//                   <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center mb-3">
//                     <Image className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Image Creator</h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Generate images from text</p>
//                 </div>
                
//                 <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer">
//                   <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-3">
//                     <BarChart2 className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Data Analysis</h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Analyze and visualize data</p>
//                 </div>
//               </div>
              
//               <button 
//                 onClick={handleNewChat}
//                 className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
//               >
//                 Start Chat
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Enhanced Search with filters */}
//         <div className="px-4 pb-4 space-y-3">
//           <div className="relative group">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
//             <input
//               ref={searchInputRef}
//               type="text"
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-600/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 transition-all duration-200 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/80"
//             />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery('')}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Filter buttons */}
//           <div className="flex items-center space-x-2">
//             {['all', 'pinned', 'recent'].map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setSelectedFilter(filter as any)}
//                 className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                   selectedFilter === filter
//                     ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
//                     : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
//                 }`}
//               >
//                 {filter === 'all' && 'All'}
//                 {filter === 'pinned' && (
//                   <div className="flex items-center space-x-1">
//                     <Star className="w-3 h-3" />
//                     <span>Pinned</span>
//                   </div>
//                 )}
//                 {filter === 'recent' && 'Recent'}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Enhanced Chat History */}
//         <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
//           {isLoading ? (
//             <div className="py-6 space-y-4">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="p-3 rounded-xl bg-gray-100/60 dark:bg-gray-800/60 animate-pulse">
//                   <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded w-3/4 mb-2"></div>
//                   <div className="h-3 bg-gray-200/40 dark:bg-gray-700/40 rounded w-full mb-1"></div>
//                   <div className="h-3 bg-gray-200/40 dark:bg-gray-700/40 rounded w-1/2"></div>
//                 </div>
//               ))}
//             </div>
//           ) : Object.keys(groupedChats).length === 0 ? (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <MessageSquare className="w-8 h-8 text-blue-500" />
//               </div>
//               <p className="text-gray-500 dark:text-gray-400 mb-4">No conversations yet</p>
//               <button
//                 onClick={onNewChat}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
//               >
//                 Start Your First Chat
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-6 pb-4">
//               {Object.entries(groupedChats).map(([category, chats]) => (
//                 <div key={category} className="space-y-2">
//                   <button
//                     onClick={() => toggleSection(category)}
//                     className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
//                   >
//                     <div className="flex items-center space-x-2">
//                       {getCategoryIcon(category)}
//                       <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                         {getCategoryTitle(category)}
//                       </h3>
//                       <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
//                         {chats.length}
//                       </span>
//                     </div>
//                     <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
//                       expandedSections.has(category) ? 'transform rotate-180' : ''
//                     }`} />
//                   </button>
                  
//                   {expandedSections.has(category) && (
//                     <div className="space-y-1 ml-2 animate-in slide-in-from-top-2 duration-200">
//                       {chats.map((chat) => (
//                         <ChatHistoryItem
//                           key={chat.id}
//                           chat={chat}
//                           onSelect={() => onSelectChat(chat.id)}
//                           isHovered={hoveredChat === chat.id}
//                           onHover={(id) => setHoveredChat(id)}
//                           onLeave={() => setHoveredChat(null)}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Quick AI Prompt */}
//         <div className="px-4 pb-4">
//           <div className="bg-gradient-to-r from-blue-50/60 to-purple-50/60 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-xl border border-gray-200/80 dark:border-gray-700/80">
//             <div className="flex items-start space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
//                 <Bot className="w-4 h-4 text-white" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Need help?</p>
//                 <p className="text-xs text-gray-600 dark:text-gray-300">Ask me anything about your projects</p>
//               </div>
//             </div>
            
//             <div className="mt-3 relative">
//               <input
//                 type="text"
//                 placeholder="Ask AI assistant..."
//                 className="w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
//               />
//               <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-blue-500 hover:bg-blue-600 rounded-full text-white">
//                 <Send className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Profile Section */}
//         <div className="border-t border-gray-200/80 dark:border-gray-700/80 p-4 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
//           <div className="relative">
//             <button
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 group relative overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
//                 <User className="w-5 h-5 text-white" />
//                 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
//               </div>
//               <div className="flex-1 text-left">
//                 <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Alex Johnson</p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Premium Plan</p>
//               </div>
//               <MoreHorizontal className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
//             </button>

//             {/* Enhanced Profile Menu */}
//             {showProfileMenu && (
//               <div className="absolute bottom-full left-0 right-0 mb-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-xl shadow-2xl py-2 animate-in slide-in-from-bottom-2 duration-200">
//                 <button
//                   onClick={toggleDarkMode}
//                   className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-left group"
//                 >
//                   <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
//                     {isDarkMode ? (
//                       <Sun className="w-4 h-4 text-amber-500" />
//                     ) : (
//                       <Moon className="w-4 h-4 text-blue-600" />
//                     )}
//                   </div>
//                   <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
//                     {isDarkMode ? 'Light Mode' : 'Dark Mode'}
//                   </span>
//                 </button>
                
//                 <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-left group">
//                   <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
//                     <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//                   </div>
//                   <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Settings</span>
//                 </button>
                
//                 <hr className="my-2 border-gray-200/60 dark:border-gray-600/60" />
                
//                 <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 text-left text-red-600 dark:text-red-400 group">
//                   <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors duration-200">
//                     <LogOut className="w-4 h-4" />
//                   </div>
//                   <span className="text-sm font-medium">Sign Out</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Custom scrollbar styles */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(156, 163, 175, 0.3);
//           border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(156, 163, 175, 0.5);
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(75, 85, 99, 0.3);
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(75, 85, 99, 0.5);
//         }
        
//         @keyframes animate-in {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-in {
//           animation: animate-in 0.2s ease-out;
//         }
        
//         .slide-in-from-top-2 {
//           animation-name: slideInFromTop2;
//         }
        
//         .slide-in-from-bottom-2 {
//           animation-name: slideInFromBottom2;
//         }
        
//         @keyframes slideInFromTop2 {
//           from {
//             opacity: 0;
//             transform: translateY(-8px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes slideInFromBottom2 {
//           from {
//             opacity: 0;
//             transform: translateY(8px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         .fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
        
//         @keyframes zoom-in {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
        
//         .zoom-in {
//           animation: zoom-in 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// }

// function ChatHistoryItem({ 
//   chat, 
//   onSelect,
//   isHovered,
//   onHover,
//   onLeave
// }: { 
//   chat: ChatSession; 
//   onSelect: () => void;
//   isHovered: boolean;
//   onHover: (id: string) => void;
//   onLeave: () => void;
// }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedTitle, setEditedTitle] = useState(chat.title);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isEditing && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isEditing]);

//   const formatTimestamp = (timestamp: Date) => {
//     const now = new Date();
//     const diff = now.getTime() - timestamp.getTime();
//     const minutes = Math.floor(diff / (1000 * 60));
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//     if (minutes < 60) return `${minutes}m ago`;
//     if (hours < 24) return `${hours}h ago`;
//     return `${days}d ago`;
//   };

//   const handleEdit = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsEditing(true);
//     setShowMenu(false);
//   };

//   const handleSave = (e: React.FormEvent) => {
//     e.stopPropagation();
//     setIsEditing(false);
//     // In a real app, you would save the edited title to your state/API
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       setIsEditing(false);
//     } else if (e.key === 'Escape') {
//       setIsEditing(false);
//       setEditedTitle(chat.title);
//     }
//   };

//   return (
//     <div 
//       className="group relative"
//       onMouseEnter={() => onHover(chat.id)}
//       onMouseLeave={onLeave}
//     >
//       <button
//         onClick={onSelect}
//         className={`w-full text-left p-3 rounded-xl transition-all duration-300 transform relative overflow-hidden ${
//           chat.isActive 
//             ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/60 dark:border-blue-700/60 shadow-sm scale-[1.02]' 
//             : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:scale-[1.01] hover:shadow-sm'
//         }`}
//       >
//         {/* Subtle hover effect background */}
//         <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${
//           chat.isActive ? 'opacity-20' : ''
//         }`}></div>
        
//         {/* Glow effect for active chat */}
//         {chat.isActive && (
//           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-30 animate-pulse"></div>
//         )}
        
//         <div className="relative flex items-start justify-between">
//           <div className="flex-1 min-w-0 pr-3">
//             <div className="flex items-center space-x-2 mb-1">
//               {chat.isPinned && (
//                 <Star className="w-3 h-3 text-amber-500 fill-current flex-shrink-0" />
//               )}
              
//               {isEditing ? (
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   value={editedTitle}
//                   onChange={(e) => setEditedTitle(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   onBlur={() => setIsEditing(false)}
//                   onClick={(e) => e.stopPropagation()}
//                   className="bg-transparent border-b border-blue-500 outline-none font-semibold text-sm w-full text-blue-900 dark:text-blue-100"
//                 />
//               ) : (
//                 <h4 className={`font-semibold text-sm truncate transition-colors duration-200 ${
//                   chat.isActive 
//                     ? 'text-blue-900 dark:text-blue-100' 
//                     : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-800 dark:group-hover:text-blue-200'
//                 }`}>
//                   {editedTitle}
//                 </h4>
//               )}
//             </div>
//             <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-relaxed">
//               {chat.lastMessage}
//             </p>
//           </div>
          
//           <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
//             <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
//               {formatTimestamp(chat.timestamp)}
//             </span>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowMenu(!showMenu);
//               }}
//               className={`p-1.5 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-lg transition-all duration-200 ${
//                 isHovered || showMenu ? 'opacity-100' : 'opacity-0'
//               } hover:scale-110`}
//             >
//               <MoreHorizontal className="w-3 h-3 text-gray-400" />
//             </button>
//           </div>
//         </div>
//       </button>

//       {/* Enhanced Context Menu */}
//       {showMenu && (
//         <div className="absolute right-2 top-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-xl shadow-2xl py-2 z-30 min-w-[140px] animate-in slide-in-from-top-2 duration-200">
//           <button 
//             onClick={handleEdit}
//             className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-left group"
//           >
//             <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
//               <Edit3 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
//             </div>
//             <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Rename</span>
//           </button>
//           <button className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-left group">
//             <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
//               <Archive className="w-3 h-3 text-gray-500 dark:text-gray-400" />
//             </div>
//             <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Archive</span>
//           </button>
//           <button className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-left group">
//             <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
//               {chat.isPinned ? (
//                 <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
//               ) : (
//                 <Star className="w-3 h-3 text-gray-500 dark:text-gray-400" />
//               )}
//             </div>
//             <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
//               {chat.isPinned ? 'Unpin' : 'Pin'}
//             </span>
//           </button>
//           <hr className="my-1 border-gray-200/60 dark:border-gray-600/60" />
//           <button className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 text-left text-red-600 dark:text-red-400 group">
//             <div className="p-1 rounded-md bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors duration-200">
//               <Trash2 className="w-3 h-3" />
//             </div>
//             <span className="text-xs font-medium">Delete</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }