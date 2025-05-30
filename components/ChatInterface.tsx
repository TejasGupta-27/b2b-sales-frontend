'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: any;
}

interface ChatInterfaceProps {
  leadId?: string | null;
  onNewMessage?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Download PDF Component
function DownloadPDFButton() {
  return (
    <button
      className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
      onClick={() => {
        // This would trigger PDF download
        console.log("Download PDF clicked");
      }}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span className="text-sm text-gray-600 dark:text-gray-300">Download PDF</span>
    </button>
  );
}

export default function ChatInterface({ leadId, onNewMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(leadId || null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when leadId changes
  useEffect(() => {
    if (leadId && leadId !== currentLeadId) {
      setCurrentLeadId(leadId);
      setHistoryLoaded(false);
    }
  }, [leadId, currentLeadId]);

  useEffect(() => {
    if (currentLeadId && !historyLoaded) {
      loadChatHistory();
    } else if (!currentLeadId && !historyLoaded) {
      initializeNewChat();
    }
  }, [currentLeadId, historyLoaded]);

  const initializeNewChat = () => {
    const welcomeMessage: Message = {
      id: `welcome_${Date.now()}`,
      content: "Hello! I'm your B2B sales assistant. I'm here to help you find the perfect technology solutions for your business. What challenges are you looking to solve today?",
      type: 'assistant',
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
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No chat history found, starting fresh');
          initializeNewChat();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Chat history loaded:', data);
      
      if (data.history && Array.isArray(data.history)) {
        const formattedMessages: Message[] = data.history.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          type: msg.role,
          timestamp: new Date(msg.timestamp),
          metadata: msg.metadata
        }));
        setMessages(formattedMessages);
      } else {
        console.log('No valid history found, initializing new chat');
        initializeNewChat();
      }
      
      setHistoryLoaded(true);
    } catch (error) {
      console.error('Error loading chat history:', error);
      initializeNewChat();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: input.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to backend:', {
        message: currentInput,
        lead_id: currentLeadId,
        conversation_stage: 'discovery'
      });

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          lead_id: currentLeadId,
          conversation_stage: 'discovery',
          provider: 'azure_openai'
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      // Update current lead ID if it was generated
      if (data.lead_id && !currentLeadId) {
        setCurrentLeadId(data.lead_id);
      }

      // Extract metadata from the response with safe defaults
      const metadata = data.metadata || {};
      const quote = metadata.quote;
      const recommendations = Array.isArray(metadata.recommendations) ? metadata.recommendations : [];
      const nextSteps = Array.isArray(metadata.next_steps) ? metadata.next_steps : [];

      // Ensure we have a valid response message
      const responseMessage = data.response || data.message || 'I apologize, but I encountered an issue processing your request.';

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        content: responseMessage,
        type: 'assistant',
        timestamp: new Date(),
        metadata: {
          quote: quote,
          recommendations: recommendations,
          next_steps: nextSteps,
          conversation_stage: data.conversation_stage,
          model: metadata.model,
          provider: metadata.provider
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Call onNewMessage callback if provided
      if (onNewMessage) {
        try {
          onNewMessage();
        } catch (callbackError) {
          console.error('Error in onNewMessage callback:', callbackError);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: `I apologize, but I'm having trouble connecting right now. Please try again in a moment. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'assistant',
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

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderQuote = (quote: any) => {
    if (!quote) return null;

    return (
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          📋 Quote Summary
        </h4>
        
        {quote.company_name && (
          <div className="mb-2">
            <span className="font-medium">Company:</span> {quote.company_name}
          </div>
        )}
        
        {quote.recommended_products && quote.recommended_products.length > 0 && (
          <div className="mb-3">
            <span className="font-medium">Recommended Products:</span>
            <ul className="mt-1 space-y-1">
              {quote.recommended_products.slice(0, 3).map((product: any, index: number) => (
                <li key={index} className="text-sm">
                  • {product.name} - ${product.monthly_cost}/month
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {(quote.total_monthly_cost || quote.total_annual_cost) && (
          <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded">
            {quote.total_monthly_cost && (
              <div><span className="font-medium">Monthly Total:</span> ${quote.total_monthly_cost}</div>
            )}
            {quote.total_annual_cost && (
              <div><span className="font-medium">Annual Total:</span> ${quote.total_annual_cost}</div>
            )}
            {quote.discount_applied > 0 && (
              <div className="text-green-600"><span className="font-medium">Discount:</span> {quote.discount_applied}%</div>
            )}
          </div>
        )}

        {quote.pdf_url && (
          <div className="mt-3">
            <a 
              href={`${API_BASE_URL}${quote.pdf_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF Quote</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  const renderRecommendations = (recommendations: any[]) => {
    if (!recommendations || recommendations.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
          💡 Recommendations
        </h4>
        <ul className="space-y-2">
          {recommendations.slice(0, 3).map((rec: any, index: number) => (
            <li key={index} className="text-sm">
              <div className="font-medium">{rec.name}</div>
              {rec.justification && (
                <div className="text-gray-600 dark:text-gray-400 mt-1">{rec.justification}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderNextSteps = (nextSteps: string[]) => {
    if (!nextSteps || nextSteps.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
          🎯 Next Steps
        </h4>
        <ul className="space-y-1">
          {nextSteps.map((step: string, index: number) => (
            <li key={index} className="text-sm">
              {index + 1}. {step}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="message-enter">
            <div className={`flex items-start space-x-4 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gray-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl max-w-3xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}>
                  <div className="prose prose-sm max-w-none dark:prose-invert chat-message-content overflow-x-auto">
                    <ReactMarkdown
                      components={{
                        table: ({node, ...props}) => (
                          <table className="min-w-full border-collapse">{props.children}</table>
                        ),
                        th: ({node, ...props}) => (
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-700 font-semibold text-left">{props.children}</th>
                        ),
                        td: ({node, ...props}) => (
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{props.children}</td>
                        ),
                        code: ({node, ...props}) => {
                          const isInline = props.className?.includes('inline');
                          return isInline ? 
                            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">{props.children}</code> :
                            <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">{props.children}</code>;
                        },
                        pre: ({node, ...props}) => (
                          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">{props.children}</pre>
                        )
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Render additional metadata */}
                  {message.metadata?.quote && renderQuote(message.metadata.quote)}
                  {message.metadata?.recommendations && renderRecommendations(message.metadata.recommendations)}
                  {message.metadata?.next_steps && renderNextSteps(message.metadata.next_steps)}
                  
                  {message.type === 'assistant' && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          title="Copy message"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
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
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 min-h-[44px] max-h-32 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about products, pricing, or request a quote..."
              className="w-full px-3 py-2 bg-transparent resize-none focus:outline-none dark:text-white"
              rows={1}
              style={{ minHeight: '40px' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px] h-[44px]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}