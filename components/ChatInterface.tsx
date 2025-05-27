'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  leadId?: string | null;
  onNewMessage?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ChatInterface({ leadId, onNewMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(leadId || null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset when leadId changes
  useEffect(() => {
    setCurrentLeadId(leadId || null);
    setHistoryLoaded(false);
    setMessages([]);
    setInput(''); // Also clear the input
  }, [leadId]);

  // Load chat history when leadId changes
  useEffect(() => {
    if (currentLeadId && !historyLoaded) {
      loadChatHistory();
    } else if (!currentLeadId && !historyLoaded) {
      initializeWithWelcome();
    }
  }, [currentLeadId, historyLoaded]);

  const initializeWithWelcome = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: 'Hello! I\'m your AI sales assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setHistoryLoaded(true);
  };

  const loadChatHistory = async () => {
    if (!currentLeadId) return;
    
    try {
      console.log(`Loading chat history for lead: ${currentLeadId}`);
      const response = await fetch(`${API_BASE_URL}/api/chat/history/${currentLeadId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Chat history response:', data);
        
        if (data.history && data.history.length > 0) {
          const historyMessages: Message[] = data.history.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as 'user' | 'assistant',
            timestamp: new Date(msg.timestamp)
          }));
          
          console.log('Setting history messages:', historyMessages);
          setMessages(historyMessages);
        } else {
          console.log('No history found, initializing with welcome message');
          initializeWithWelcome();
        }
      } else {
        console.error('Failed to load chat history:', response.status);
        initializeWithWelcome();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      initializeWithWelcome();
    } finally {
      setHistoryLoaded(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message:', {
        message: messageContent,
        lead_id: currentLeadId,
        conversation_stage: 'discovery'
      });

      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          lead_id: currentLeadId,
          conversation_stage: 'discovery'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Chat response:', data);
        
        // Update current lead ID if it was generated
        if (!currentLeadId && data.lead_id) {
          setCurrentLeadId(data.lead_id);
        }

        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          content: data.message,
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Notify parent component about new message
        if (onNewMessage) {
          onNewMessage();
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sales Assistant</h2>
              <p className="text-sm text-gray-500">AI-powered B2B sales consultant</p>
            </div>
          </div>
          {currentLeadId && (
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              Lead: {currentLeadId}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-2xl px-4 py-3 rounded-2xl relative group ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <button
                  onClick={() => copyToClipboard(message.content, message.id)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ml-2 ${
                    message.role === 'user' ? 'text-blue-100 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {copiedId === message.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="chat-input-field flex-1 resize-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
            style={{ color: '#1f2937' }}
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white rounded-xl px-6 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ 
  message, 
  onCopy,
  copiedId
}: { 
  message: Message; 
  onCopy: (text: string, messageId: string) => void;
  copiedId: string | null;
}) {
  const isUser = message.role === 'user';
  const isCopied = copiedId === message.id;

  return (
    <div className="group">
      <div className="flex items-start space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser 
            ? 'bg-gradient-to-r from-gray-600 to-gray-800' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-200/50">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <p className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </p>
            
            {!isUser && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onCopy(message.content, message.id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isCopied 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                  title={isCopied ? "Copied!" : "Copy message"}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                  title="Good response"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Bad response"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}