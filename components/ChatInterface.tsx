'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, Copy, ThumbsUp, ThumbsDown, Check, Sparkles, Zap, MessageCircle, Download, FileText, Mic, MicOff, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from "../i18n";

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

// Animated typing indicator
function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="ml-2 text-sm text-gray-600">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}

// Enhanced metadata rendering functions
const renderQuote = (quote: any) => {
  if (!quote) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-3">
        <FileText className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Quote Summary</h4>
      </div>
      
      {quote.company_name && (
        <div className="mb-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span className="font-medium text-gray-700 dark:text-gray-300">Company:</span>
          <span className="ml-2 text-gray-900 dark:text-gray-100">{quote.company_name}</span>
        </div>
      )}
      
      {quote.recommended_products && quote.recommended_products.length > 0 && (
        <div className="mb-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">Recommended Products:</span>
          <div className="mt-2 space-y-2">
            {quote.recommended_products.slice(0, 3).map((product: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium">{product.name}</span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">${product.monthly_cost}/month</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {(quote.total_monthly_cost || quote.total_annual_cost) && (
        <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
          {quote.total_monthly_cost && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Monthly Total:</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">${quote.total_monthly_cost}</span>
            </div>
          )}
          {quote.total_annual_cost && (
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">Annual Total:</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">${quote.total_annual_cost}</span>
            </div>
          )}
          {quote.discount_applied > 0 && (
            <div className="mt-2 pt-2 border-t border-green-200/50 dark:border-green-800/50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">Discount Applied:</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{quote.discount_applied}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {quote.pdf_url && (
        <div className="mt-3">
          <a 
            href={`${API_BASE_URL}${quote.pdf_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg"
          >
            <Download className="w-4 h-4" />
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
    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-green-900 dark:text-green-100">AI Recommendations</h4>
      </div>
      <div className="space-y-3">
        {recommendations.slice(0, 3).map((rec: any, index: number) => (
          <div key={index} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="font-medium text-gray-900 dark:text-gray-100">{rec.name}</div>
            {rec.justification && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.justification}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const renderNextSteps = (nextSteps: string[]) => {
  if (!nextSteps || nextSteps.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-3">
        <Zap className="w-5 h-5 text-yellow-600" />
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Next Steps</h4>
      </div>
      <div className="space-y-2">
        {nextSteps.map((step: string, index: number) => (
          <div key={index} className="flex items-start space-x-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {index + 1}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Message Bubble Component
function MessageBubble({ message, onCopy, copiedId }: { message: Message; onCopy: (text: string, id: string) => void; copiedId: string | null }) {
  const [isVisible, setIsVisible] = useState(false);
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleReaction = (type: 'up' | 'down') => {
    setReaction((prev) => (prev === type ? null : type));
  };

  return (
    <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className={`flex items-start space-x-4 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform ${
          message.type === 'user' 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
            : 'bg-gradient-to-r from-purple-500 to-pink-600'
        }`}>
          {message.type === 'user' ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        
        <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
          <div className={`inline-block p-5 rounded-2xl max-w-3xl shadow-lg border backdrop-blur-sm ${
            message.type === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-200'
              : 'bg-white/90 text-gray-900 dark:bg-gray-800/90 dark:text-gray-100 border-white/20 dark:border-gray-700/50'
          }`}>
            {/* Message content */}
            <div className="prose prose-sm max-w-none dark:prose-invert chat-message-content overflow-x-auto">
              <ReactMarkdown
                components={{
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                      <table className="min-w-full border-collapse">{props.children}</table>
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-700 font-semibold text-left">{props.children}</th>
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">{props.children}</td>
                  ),
                  code: ({node, ...props}) => {
                    const isInline = props.className?.includes('inline');
                    return isInline ? 
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">{props.children}</code> :
                      <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto font-mono text-sm">{props.children}</code>;
                  },
                  pre: ({node, ...props}) => (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">{props.children}</pre>
                  )
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            
            {/* Render metadata */}
            {message.metadata?.quote && renderQuote(message.metadata.quote)}
            {message.metadata?.recommendations && renderRecommendations(message.metadata.recommendations)}
            {message.metadata?.next_steps && renderNextSteps(message.metadata.next_steps)}
            
            {/* Message actions */}
            {message.type === 'assistant' && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onCopy(message.content, message.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Copy message"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleReaction('up')}
                    className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                      reaction === 'up'
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/50 animate-pulse'
                        : 'text-gray-400 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReaction('down')}
                    className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                      reaction === 'down'
                        ? 'text-red-600 bg-red-100 dark:bg-red-900/50 animate-pulse'
                        : 'text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title="Poor response"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { language } = useLanguage();
  const t = translations[language];
  const [isTranscribing, setIsTranscribing] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

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
      content: t.greeting || "👋 Hello! I'm your AI-powered B2B sales assistant. I'm here to help you discover the perfect technology solutions for your business. What challenges are you looking to solve today?",
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
        content: `⚠️ I apologize, but I'm having trouble connecting right now. Please try again in a moment. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

    const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await handleVoiceMessage(audioBlob); // Changed from transcribeAudio
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('lead_id', currentLeadId || '');
      if (language) formData.append('language', language);

      // Call a transcription-only endpoint instead of the full chat endpoint
      const response = await fetch(`${API_BASE_URL}/api/speech/chat/voice`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Transcription response:', data);
      
      // Set the transcribed text in the input box instead of processing it
      if (data.transcription) {
        setInput(data.transcription);

        // Optional: Focus the input box so user can immediately edit
        if (inputRef.current) {
          inputRef.current.focus();

          inputRef.current.style.boxShadow = '0 0 0 2px #3B82F6';
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.style.boxShadow = '';
            }
          }, 1000);
        }
      }

    } catch (error) {
      console.error('Error with voice transcription:', error);
      // Show error in input or as a toast notification
      alert(`Voice transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={copyToClipboard}
            copiedId={copiedId}
          />
        ))}
        
        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-blue-200 p-4 bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            {/* Text Input Box */}
            <div className="flex-1 relative">
              <div className="border border-blue-300 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white shadow-md">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about products, pricing, or request a quote..."
                  className="w-full px-4 py-3 bg-white resize-none focus:outline-none text-black placeholder-gray-500 max-h-32 min-h-[48px]"
                  rows={1}
                  disabled={isLoading}
                />

                {/* Footer */}
                <div className="flex items-center justify-between px-4 pb-2 text-xs text-gray-500">
                  <span>{t.aimessage || "Powered by AI"}</span>
                  <span>{t.sendPlaceholder || "Press Enter to send"}</span>
                </div>
              </div>
            </div>

            {/* Voice Button */}
            <button
              onClick={handleVoiceClick}
              disabled={isLoading || isTranscribing}
              className={`p-3 rounded-full transition-all shadow ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                  : isTranscribing
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } ${(isLoading || isTranscribing) ? 'cursor-not-allowed opacity-50' : ''}`}
              title={isRecording ? 'Stop recording' : isTranscribing ? 'Transcribing...' : 'Record voice message'}
            >
              {isRecording ? (
                <Square className="w-5 h-5" />
              ) : isTranscribing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={isLoading || isTranscribing || !input.trim()}
              className={`p-3 rounded-full transition-all shadow ${
                input.trim() && !isLoading && !isTranscribing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
            </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                t.question1 || "Tell me about your cloud solutions",
                t.question2 || "What's your pricing model?",
                t.question3 || "I need a custom quote",
                t.question4 || "Show me security features"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-2 text-xs bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}