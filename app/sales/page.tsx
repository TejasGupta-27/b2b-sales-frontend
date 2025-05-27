'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Bot, 
  ShoppingCart, 
  FileText, 
  DollarSign,
  CheckCircle,
  Calendar,
  Download,
  X
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface QuoteItem {
  product_name: string;
  tier_name: string;
  monthly_price: number;
  annual_price: number;
  features: string[];
}

interface Quote {
  id: string;
  pricing: {
    items: QuoteItem[];
    monthly_total: number;
    annual_total: number;
    annual_savings: number;
  };
  valid_until: string;
  terms: string[];
}

interface CustomerContext {
  company_name?: string;
  company_size?: string;
  industry?: string;
  budget_range?: string;
  timeline?: string;
  pain_points?: string[];
  requirements?: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SalesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [customerContext, setCustomerContext] = useState<CustomerContext>({});
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: `Hello! I'm your AI sales consultant. I'm here to help you find the perfect solution for your business needs and provide you with detailed pricing and recommendations.

To get started, could you tell me a bit about your company and what challenges you're looking to solve?`,
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sales-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          customer_context: customerContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle quote if provided
      if (data.quote) {
        setCurrentQuote(data.quote);
        setShowQuoteModal(true);
      }

      // Update customer context based on conversation
      updateCustomerContext(userMessage.content);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomerContext = (message: string) => {
    const messageLower = message.toLowerCase();
    const updatedContext = { ...customerContext };

    // Extract company size
    if (messageLower.includes('startup')) {
      updatedContext.company_size = 'startup';
    } else if (messageLower.includes('small')) {
      updatedContext.company_size = 'small';
    } else if (messageLower.includes('medium')) {
      updatedContext.company_size = 'medium';
    } else if (messageLower.includes('large') || messageLower.includes('enterprise')) {
      updatedContext.company_size = 'large';
    }

    // Extract budget information
    if (messageLower.includes('budget')) {
      if (messageLower.includes('10k') || messageLower.includes('10,000')) {
        updatedContext.budget_range = '10k-50k';
      } else if (messageLower.includes('50k') || messageLower.includes('100k')) {
        updatedContext.budget_range = '50k-100k';
      }
    }

    // Extract industry
    if (messageLower.includes('saas') || messageLower.includes('software')) {
      updatedContext.industry = 'saas';
    } else if (messageLower.includes('ecommerce') || messageLower.includes('e-commerce')) {
      updatedContext.industry = 'ecommerce';
    } else if (messageLower.includes('manufacturing')) {
      updatedContext.industry = 'manufacturing';
    }

    setCustomerContext(updatedContext);
  };

  const downloadQuote = () => {
    if (!currentQuote) return;
    
    // Create a simple text version of the quote
    const quoteText = `
SALES QUOTATION
Quote ID: ${currentQuote.id}
Valid Until: ${currentQuote.valid_until}

RECOMMENDED PRODUCTS:
${currentQuote.pricing.items.map(item => `
- ${item.product_name} (${item.tier_name})
  Monthly: $${item.monthly_price}
  Annual: $${item.annual_price}
  Features: ${item.features.join(', ')}
`).join('')}

PRICING SUMMARY:
Monthly Total: $${currentQuote.pricing.monthly_total}
Annual Total: $${currentQuote.pricing.annual_total}
Annual Savings: $${currentQuote.pricing.annual_savings}

TERMS & CONDITIONS:
${currentQuote.terms.map(term => `- ${term}`).join('\n')}
    `;

    const blob = new Blob([quoteText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${currentQuote.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">AI Sales Consultant</h1>
              <p className="text-slate-600">Get personalized recommendations and instant quotes</p>
            </div>
            <div className="flex items-center space-x-4">
              {currentQuote && (
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Quote</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isLoading && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-6 border-t border-slate-200">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={useRef<HTMLTextAreaElement>(null)}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Tell me about your business needs, ask for pricing, or request a quote..."
                className="w-full px-6 py-4 pr-16 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg resize-none"
                disabled={isLoading}
                rows={3}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 bottom-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && currentQuote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Your Custom Quote</h2>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-slate-600 mt-1">Quote ID: {currentQuote.id}</p>
              <p className="text-sm text-slate-500">Valid until: {currentQuote.valid_until}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Recommended Products</h3>
                <div className="space-y-4">
                  {currentQuote.pricing.items.map((item, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{item.product_name}</h4>
                          <p className="text-slate-600">{item.tier_name} Plan</p>
                          <div className="mt-2">
                            <span className="text-sm text-slate-500">Features: </span>
                            <span className="text-sm text-slate-700">{item.features.join(', ')}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-semibold text-slate-800">
                            ${item.monthly_price}/mo
                          </div>
                          <div className="text-sm text-slate-600">
                            ${item.annual_price}/yr
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Pricing Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monthly Total:</span>
                    <span className="font-semibold">${currentQuote.pricing.monthly_total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual Total:</span>
                    <span className="font-semibold">${currentQuote.pricing.annual_total}</span>
                  </div>
                  {currentQuote.pricing.annual_savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Annual Savings:</span>
                      <span className="font-semibold">${currentQuote.pricing.annual_savings}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Terms & Conditions</h3>
                <ul className="space-y-2">
                  {currentQuote.terms.map((term, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 text-sm">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={downloadQuote}
                  className="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Demo</span>
                </button>
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
                  Accept Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className="flex items-start space-x-4">
      {!isUser && (
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-3xl ${isUser ? 'ml-auto' : ''}`}>
        <div className={`inline-block px-6 py-4 shadow-lg ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-sm' 
            : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        
        <p className={`text-xs text-slate-500 mt-2 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-6 py-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-slate-600 font-medium ml-2">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
} 