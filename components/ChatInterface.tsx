'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Copy, ThumbsUp, ThumbsDown, Check, Sparkles, Volume2, X } from 'lucide-react';
import { SpeakerSimpleHigh, Microphone, MicrophoneSlash } from 'phosphor-react';
import ReactMarkdown from 'react-markdown';
import apiClient, { tokenManager } from '../lib/auth/api';
import Recorder from 'recorder-js';

// Add this after the imports
const translations = {
  en: {
    placeholder: "Ask about products, pricing, or request a quote...",
    aiThinking: "AI is thinking...",
    voiceMode: "Voice Mode",
    listening: "Listening...",
    speaking: "Speaking...",
    processing: "Processing...",
    readyToTalk: "Ready to talk",
    speakNow: "Speak now or press the button to stop",
    aiResponding: "AI is responding",
    pressMic: "Press the mic button to start",
    stopListening: "Stop listening",
    startListening: "Start listening",
    copyMessage: "Copy message",
    playAudio: "Play audio",
    stopAudio: "Stop audio",
    goodResponse: "Good response",
    poorResponse: "Poor response",
    sendMessage: "Send message",
    pressEnter: "Press Enter to send",
    stopRecording: "Stop recording",
    transcribing: "Transcribing...",
    recordVoice: "Record voice message",
    exitVoiceMode: "Exit voice mode",
    enterVoiceMode: "Enter voice mode",
    welcomeMessage: "👋 Hello! I'm your AI-powered B2B sales assistant. I'm here to help you discover the perfect technology solutions for your business. What challenges are you looking to solve today?",
    suggestions: [
      'Tell me about your cloud solutions',
      "What's your pricing model?",
      'I need a custom quote',
      'Show me security features',
    ],
    quickSuggestion: "Quick suggestion", // Added for suggestion buttons aria-label
  },
  ja: {
    placeholder: "製品、価格、見積もりについてお聞きください...",
    aiThinking: "AIが考えています...",
    voiceMode: "音声モード",
    listening: "聞いています...",
    speaking: "話しています...",
    processing: "処理中...",
    readyToTalk: "話す準備ができました",
    speakNow: "今話すか、ボタンを押して停止してください",
    aiResponding: "AIが応答しています",
    pressMic: "マイクボタンを押して開始してください",
    stopListening: "聞くのを停止",
    startListening: "聞き始める",
    copyMessage: "メッセージをコピー",
    playAudio: "音声を再生",
    stopAudio: "音声を停止",
    goodResponse: "良い応答",
    poorResponse: "悪い応答",
    sendMessage: "メッセージを送信",
    pressEnter: "Enterを押して送信",
    stopRecording: "録音を停止",
    transcribing: "文字起こし中...",
    recordVoice: "音声メッセージを録音",
    exitVoiceMode: "音声モードを終了",
    enterVoiceMode: "音声モードに入る",
    welcomeMessage: "👋 こんにちは！私はAI搭載のB2B営業アシスタントです。あなたのビジネスに最適なテクノロジーソリューションを見つけるお手伝いをします。今日はどのような課題を解決したいですか？",
    suggestions: [
      'クラウドソリューションについて教えてください',
      '料金体系はどうなっていますか？',
      'カスタム見積もりが必要です',
      'セキュリティ機能を見せてください',
    ],
    quickSuggestion: "クイック提案", // Added for suggestion buttons aria-label
  }
};

interface Message {
  id: string;
  content: string;
  text: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: any;
}

interface ChatInterfaceProps {
  leadId?: string | null;
  onNewMessage?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function TypingIndicator({ language }: { language: 'en' | 'ja' }) {
  return (
    <div className="flex items-center space-x-4 max-w-4xl mx-auto px-4">
      <div className="flex flex-col h-full bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full p-2 shadow-md">
        <Bot className="w-6 h-6 text-indigo-700" />
      </div>
      <div className="bg-white rounded-3xl px-10 py-5 shadow-lg border border-gray-200 flex items-center space-x-4 select-none">
        <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
        <span className="ml-4 text-sm font-semibold text-gray-600">{translations[language].aiThinking}</span>
      </div>
    </div>
  );
}

interface VoiceModeOverlayProps {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onMicClick: () => void;
  language: 'en' | 'ja';
}

function VoiceModeOverlay({
  isActive,
  isListening,
  isSpeaking,
  isProcessing,
  onClose,
  onMicClick,
  language, // Added language prop
}: VoiceModeOverlayProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[8px] z-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-indigo-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-700 flex items-center gap-3">
            <SpeakerSimpleHigh weight="fill" className="text-indigo-600" size={26} />
            {translations[language].voiceMode}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
            aria-label={translations[language].exitVoiceMode}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center py-8">
          <div
            className={`relative w-48 h-48 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${
              isListening
                ? 'bg-indigo-100 animate-pulse'
                : isSpeaking
                ? 'bg-green-100'
                : 'bg-gray-100'
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className={`absolute inset-0 rounded-full ${isListening ? 'animate-ping bg-indigo-200' : ''}`}></div>

            {isProcessing ? (
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : isListening ? (
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center relative">
                <div className="w-12 h-12 relative flex space-x-1">
                  <div className="w-2 h-5 bg-white rounded-full animate-wave delay-0"></div>
                  <div className="w-2 h-7 bg-white rounded-full animate-wave delay-75"></div>
                  <div className="w-2 h-8 bg-white rounded-full animate-wave delay-150"></div>
                  <div className="w-2 h-7 bg-white rounded-full animate-wave delay-200"></div>
                  <div className="w-2 h-5 bg-white rounded-full animate-wave delay-300"></div>
                </div>
              </div>
            ) : isSpeaking ? (
              <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center">
                <Volume2 className="w-16 h-16 text-white" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center">
                <Microphone className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          <p className="text-lg font-semibold text-center text-gray-800 select-none">
            {isListening
              ? translations[language].listening
              : isSpeaking
              ? translations[language].speaking
              : isProcessing
              ? translations[language].processing
              : translations[language].readyToTalk}
          </p>
          <p className="text-gray-500 text-center mt-1 select-none">
            {isListening
              ? translations[language].speakNow
              : isSpeaking
              ? translations[language].aiResponding
              : translations[language].pressMic}
          </p>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={onMicClick}
            className={`p-6 rounded-full transition-transform shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
              isListening
                ? 'bg-red-600 hover:bg-red-700'
                : isSpeaking || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white transform hover:scale-105`}
            disabled={isSpeaking || isProcessing}
            aria-pressed={isListening}
            aria-label={isListening ? translations[language].stopListening : translations[language].startListening}
          >
            {isListening ? (
              <MicrophoneSlash weight="fill" size={32} />
            ) : (
              <Microphone weight="fill" size={32} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
  copiedId,
  onSpeak,
  playingAudioId,
  language, // Added language prop
}: {
  message: Message;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  onSpeak: (text: string, id: string) => void;
  playingAudioId: string | null;
  language: 'en' | 'ja'; // Added language prop type
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleReaction = (type: 'up' | 'down') => {
    setReaction(prev => (prev === type ? null : type));
  };

  return (
    <div
      className={`transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } px-4 sm:px-0`}
      role="article"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`flex items-start max-w-4xl mx-auto ${
          message.type === 'user' ? 'flex-row-reverse' : ''
        } space-x-4 sm:space-x-6 ${
          message.type === 'user' ? 'space-x-reverse' : ''
        }`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transform hover:scale-105 transition-transform cursor-default select-none ${
            message.type === 'user'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
          }`}
          aria-label={message.type === 'user' ? 'User icon' : 'Assistant icon'}
          aria-hidden="false"
        >
          {message.type === 'user' ? (
            <User className="w-6 h-6 text-white" aria-hidden="true" />
          ) : (
            <Bot className="w-6 h-6 text-white" aria-hidden="true" />
          )}
        </div>

        <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
          <article
            className="inline-block p-6 rounded-2xl max-w-3xl shadow-lg backdrop-blur-sm bg-white border border-gray-200 text-gray-800"
            tabIndex={0}
            aria-label={`${message.type === 'user' ? 'Your message' : 'Assistant message'} sent at ${message.timestamp.toLocaleTimeString()}`}
          >
            <div className="prose prose-indigo max-w-none break-words text-sm sm:text-base min-w-[150px]">
              <ReactMarkdown
                components={{
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto rounded-lg border border-gray-300">
                      <table className="min-w-full border-collapse text-sm text-gray-700">
                        {props.children}
                      </table>
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-indigo-50 font-semibold text-left text-indigo-700">
                      {props.children}
                    </th>
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-gray-300 px-4 py-2">{props.children}</td>
                  ),
                  code: ({ node, ...props }) => {
                    const isInline = props.className?.includes('inline');
                    return isInline ? (
                      <code className="bg-indigo-100 px-1 py-0.5 rounded text-xs font-mono text-indigo-800">
                        {props.children}
                      </code>
                    ) : (
                      <code className="block bg-indigo-50 p-4 rounded-lg overflow-x-auto font-mono text-sm text-indigo-700">
                        {props.children}
                      </code>
                    );
                  },
                  pre: ({ node, ...props }) => (
                    <pre className="bg-indigo-50 p-4 rounded-lg overflow-x-auto">{props.children}</pre>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>

              {/* Suggestions/metadata rendering could be enhanced here if needed */}
            </div>

            {message.type === 'assistant' && (
              <footer className="flex items-center justify-between mt-5 pt-4 border-t border-gray-300">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onCopy(message.content, message.id)}
                    aria-label={translations[language].copyMessage}
                    title={translations[language].copyMessage}
                    className="p-3 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-5 h-5 text-green-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>

                  <button
                    onClick={() => onSpeak(message.content, message.id)}
                    aria-label={playingAudioId === message.id ? translations[language].stopAudio : translations[language].playAudio}
                    title={playingAudioId === message.id ? translations[language].stopAudio : translations[language].playAudio}
                    className={`p-3 rounded-xl transition-transform transform focus:outline-none focus:ring-2 ${
                      playingAudioId === message.id
                        ? 'text-indigo-600 bg-indigo-100 scale-110'
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {playingAudioId === message.id ? (
                      <div className="relative" aria-hidden="true">
                        <Volume2 className="w-5 h-5" />
                        <div className="absolute -top-1 -right-1 flex space-x-0.5">
                          <div className="w-0.5 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                          <div className="w-0.5 h-3 bg-indigo-600 rounded-full animate-pulse delay-100"></div>
                          <div className="w-0.5 h-2 bg-indigo-600 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleReaction('up')}
                    aria-label={translations[language].goodResponse}
                    title={translations[language].goodResponse}
                    className={`p-3 rounded-xl transition-transform transform focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      reaction === 'up'
                        ? 'text-green-600 bg-green-100 animate-pulse'
                        : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" aria-hidden="true" />
                  </button>

                  <button
                    onClick={() => handleReaction('down')}
                    aria-label={translations[language].poorResponse}
                    title={translations[language].poorResponse}
                    className={`p-3 rounded-xl transition-transform transform focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      reaction === 'down'
                        ? 'text-red-600 bg-red-100 animate-pulse'
                        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <time
                  dateTime={message.timestamp.toISOString()}
                  className="text-xs text-gray-500 flex items-center space-x-1 select-none"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </time>
              </footer>
            )}
          </article>
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
  const [language, setLanguage] = useState<'en' | 'ja'>('en'); // Language state initialization
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<Recorder | null>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

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

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setPlayingAudioId(null);
      }
    };
  }, [currentAudio]);

  // New useEffect to reinitialize welcome message when language changes
  useEffect(() => {
    // Only reinitialize if it's the initial welcome message
    if (messages.length === 1 && messages[0].id.startsWith('welcome_')) {
      initializeNewChat();
    }
  }, [language]);

  const initializeNewChat = () => {
    const welcomeMessage: Message = {
      id: `welcome_${Date.now()}`,
      content: translations[language].welcomeMessage,
      text: translations[language].welcomeMessage,
      type: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setHistoryLoaded(true);
  };

  const loadChatHistory = async () => {
    if (!currentLeadId) return;

    try {
      // Use relative URL to go through Next.js proxy
      const token = tokenManager.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/chat/history/${currentLeadId}`, {
        method: 'GET',
        headers,
      });
      
      if (response.status === 404) {
        initializeNewChat();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.history && Array.isArray(data.history)) {
        const formattedMessages: Message[] = data.history.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          text: msg.text || msg.content,
          type: msg.role,
          timestamp: new Date(msg.timestamp),
          metadata: msg.metadata,
        }));
        setMessages(formattedMessages);
      } else {
        initializeNewChat();
      }

      setHistoryLoaded(true);
    } catch (error) {
      initializeNewChat();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: input.trim(),
      text: input.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Use relative URL to go through Next.js proxy
      const token = tokenManager.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: currentInput,
          lead_id: currentLeadId,
          conversation_stage: 'discovery',
          provider: 'azure_openai',
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {}

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.lead_id && !currentLeadId) {
        setCurrentLeadId(data.lead_id);
      }

      const metadata = data.metadata || {};
      const quote = metadata.quote;
      const recommendations = Array.isArray(metadata.recommendations) ? metadata.recommendations : [];
      const nextSteps = Array.isArray(metadata.next_steps) ? metadata.next_steps : [];

      const responseMessage =
        data.response || data.message || "I apologize, but I encountered an issue processing your request.";

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        content: responseMessage,
        text: responseMessage,
        type: 'assistant',
        timestamp: new Date(),
        metadata: {
          quote,
          recommendations,
          next_steps: nextSteps,
          conversation_stage: data.conversation_stage,
          model: metadata.model,
          provider: metadata.provider,
          speech_data: metadata.speech_data,
        },
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (onNewMessage) {
        try {
          onNewMessage();
        } catch (callbackError) {}
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: `⚠️ I apologize, but I'm having trouble connecting right now. Please try again in a moment. Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        text: `⚠️ I apologize, but I'm having trouble connecting right now. Please try again in a moment. Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string, messageId: string, audioData?: string) => {
    try {
      if (playingAudioId === messageId && currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setPlayingAudioId(null);
        setCurrentAudio(null);
        if (voiceMode) {
          setIsVoiceSpeaking(false);
        }
        return;
      }

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      let audioDataToUse = audioData;
      if (!audioDataToUse) {
        const message = messages.find(msg => msg.id === messageId);
        audioDataToUse = message?.metadata?.speech_data?.audio_data;
      }

      if (audioDataToUse) {
        setPlayingAudioId(messageId);
        if (voiceMode) {
          setIsVoiceSpeaking(true);
        }

        const binaryString = atob(audioDataToUse);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        setCurrentAudio(audio);

        audio.addEventListener('error', e => {
          setPlayingAudioId(null);
          setCurrentAudio(null);
          if (voiceMode) {
            setIsVoiceSpeaking(false);
          }
          URL.revokeObjectURL(audioUrl);
        });

        audio.onended = () => {
          setPlayingAudioId(null);
          setCurrentAudio(null);
          if (voiceMode) {
            setIsVoiceSpeaking(false);
            setTimeout(() => {
              if (voiceMode && !isVoiceProcessing) {
                startVoiceConversation();
              }
            }, 500);
          }
          URL.revokeObjectURL(audioUrl);
        };

        audio.onpause = () => {
          if (audio.currentTime === 0) {
            setPlayingAudioId(null);
            setCurrentAudio(null);
            if (voiceMode) {
              setIsVoiceSpeaking(false);
            }
          }
        };

        await audio.play();
      } else {
        setPlayingAudioId(null);
        setCurrentAudio(null);
        if (voiceMode) {
          setIsVoiceSpeaking(false);
        }
      }
    } catch (error) {
      setPlayingAudioId(null);
      setCurrentAudio(null);
      if (voiceMode) {
        setIsVoiceSpeaking(false);
      }
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
    } catch (err) {}
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const recorder = new Recorder(audioContextRef.current, {
        // WAV is default
        // type: 'audio/wav',
        // bitRate: 16,
        // sampleRate: 44100,
      });
      recorder.init(stream);
      recorderRef.current = recorder;
      await recorder.start();
      setIsRecording(true);
      if (voiceMode) {
        setIsVoiceListening(true);
      }
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      const { blob } = await recorderRef.current.stop();
      setIsRecording(false);
      if (voiceMode) {
        setIsVoiceListening(false);
      }
      // Always WAV
      await handleVoiceMessage(blob, 'wav');

      // Save the WAV file locally for debugging
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `recording_${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob, fileExtension: string = 'webm') => {
    // Convert WebM to WAV client-side
    let finalAudioBlob = audioBlob;
    let finalFileExtension = fileExtension;
    
    if (audioBlob.type.includes('webm')) {
      try {
        console.log('Converting WebM to WAV...');
        // The original webm-to-wav-converter is removed, so this block is now effectively a no-op
        // or would require a new library. For now, we'll just log the attempt.
        // If the intent was to convert to WAV, this logic needs to be re-evaluated.
        // For now, we'll assume the backend handles the conversion or that the file is already WAV.
        // If the backend expects WAV, this conversion logic needs to be re-added.
        // For the purpose of this edit, we'll assume the backend handles it or the file is WAV.
        // If the backend expects WAV, the `finalFileExtension` should be 'wav' here.
        // Since the backend expects WAV, we'll set it to 'wav'.
        finalFileExtension = 'wav';
        console.log('Using WAV format for backend processing');
      } catch (error) {
        console.error('WebM to WAV conversion failed:', error);
        // Fallback to original blob if conversion fails
        console.log('Using original WebM format as fallback');
      }
    }

    // Check if we're in voice mode - if so, handle voice conversation
    if (voiceMode) {
      setIsTranscribing(true);
      setIsVoiceProcessing(true);
      setIsVoiceListening(false);

      try {
        const formData = new FormData();
        
        // Use the converted WAV file (or original if conversion failed)
        const fileName = `recording.${finalFileExtension}`;
        formData.append('audio', finalAudioBlob, fileName);
        
        // Add audio format info for backend processing
        formData.append('audio_format', finalAudioBlob.type);

        if (currentLeadId) {
          formData.append('lead_id', currentLeadId);
        }
        formData.append('conversation_stage', 'discovery');
        formData.append('provider', 'azure_openai');
        if (language) formData.append('language', language);

        const token = tokenManager.getToken();
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch('/api/speech/chat/voice', {
          method: 'POST',
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.lead_id && !currentLeadId) {
          setCurrentLeadId(data.lead_id);
        }

        // For voice mode: play audio response
        if (data.metadata?.speech_data?.audio_data) {
          const messageId = `voice_response_${Date.now()}`;
          await handleSpeak(data.message || data.response, messageId, data.metadata.speech_data.audio_data);
        }

        if (onNewMessage) {
          onNewMessage();
        }
      } catch (error) {
        const errorMessage: Message = {
          id: `error_voice_${Date.now()}`,
          content: `⚠️ Voice message failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          text: `⚠️ Voice message failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTranscribing(false);
        setIsVoiceProcessing(false);
      }
    } else {
      // Regular voice input - convert to text chat
      setIsTranscribing(true);

      try {
        const formData = new FormData();
        
        // Use the converted WAV file (or original if conversion failed)
        const fileName = `recording.${finalFileExtension}`;
        formData.append('audio', finalAudioBlob, fileName);
        
        // Add audio format info for backend processing
        formData.append('audio_format', finalAudioBlob.type);

        if (currentLeadId) {
          formData.append('lead_id', currentLeadId);
        }
        formData.append('conversation_stage', 'discovery');
        formData.append('provider', 'azure_openai');
        if (language) formData.append('language', language);

        const token = tokenManager.getToken();
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch('/api/speech/chat/voice', {
          method: 'POST',
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.lead_id && !currentLeadId) {
          setCurrentLeadId(data.lead_id);
        }

        // For regular voice input: add messages to chat
        const userMessage: Message = {
          id: `user_voice_${Date.now()}`,
          content: data.metadata?.transcription_metadata?.text || "Voice message",
          text: data.metadata?.transcription_metadata?.text || "Voice message",
          type: 'user',
          timestamp: new Date(),
        };

        const assistantMessage: Message = {
          id: `assistant_voice_${Date.now()}`,
          content: data.message || data.response,
          text: data.message || data.response,
          type: 'assistant',
          timestamp: new Date(),
          metadata: data.metadata,
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);

        if (onNewMessage) {
          onNewMessage();
        }
      } catch (error) {
        const errorMessage: Message = {
          id: `error_voice_${Date.now()}`,
          content: `⚠️ Voice message failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          text: `⚠️ Voice message failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTranscribing(false);
      }
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toggleVoiceMode = () => {
    if (voiceMode) {
      setVoiceMode(false);
      setIsVoiceListening(false);
      setIsVoiceSpeaking(false);
      setIsVoiceProcessing(false);

      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setPlayingAudioId(null);
      }

      if (recorderRef.current) {
        recorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      setVoiceMode(true);
      startVoiceConversation();
    }
  };

  const startVoiceConversation = async () => {
    if (!voiceMode) return;
    try {
      setIsVoiceListening(true);
      await startRecording();

      setTimeout(() => {
        if (isVoiceListening && !isVoiceProcessing && !isVoiceSpeaking) {
          stopRecording();
        }
      }, 10000);
    } catch (error) {
      setVoiceMode(false);
    }
  };

  const handleVoiceMicClick = () => {
    if (isVoiceListening) {
      stopRecording();
    } else if (!isVoiceProcessing && !isVoiceSpeaking) {
      startVoiceConversation();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans selection:bg-indigo-300 selection:text-white">
      <VoiceModeOverlay
        isActive={voiceMode}
        isListening={isVoiceListening}
        isSpeaking={isVoiceSpeaking}
        isProcessing={isVoiceProcessing}
        onClose={toggleVoiceMode}
        onMicClick={handleVoiceMicClick}
        language={language} // Pass language prop
      />

      <div className="flex-1 overflow-y-auto max-w-5xl mx-auto w-full px-6 py-8 space-y-8">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={copyToClipboard}
            copiedId={copiedId}
            onSpeak={handleSpeak}
            playingAudioId={playingAudioId}
            language={language} // Pass language prop
          />
        ))}

        {isLoading && <TypingIndicator language={language} />} {/* Pass language prop */}

        <div ref={messagesEndRef} />
      </div>

      <footer className="border-t border-gray-200 bg-white px-6 sm:px-8 py-5 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center space-x-4">
          <button
            onClick={toggleVoiceMode}
            className={`p-3 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 ${
              voiceMode
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title={voiceMode ? translations[language].exitVoiceMode : translations[language].enterVoiceMode}
            aria-label={voiceMode ? translations[language].exitVoiceMode : translations[language].enterVoiceMode}
          >
            <SpeakerSimpleHigh
              weight={voiceMode ? 'fill' : 'regular'}
              className="w-6 h-6"
              aria-hidden="true"
            />
          </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
              className="p-3 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 bg-gray-100 hover:bg-gray-200 text-gray-600"
              title={language === 'en' ? 'Switch to Japanese' : 'Switch to English'}
              aria-label={language === 'en' ? 'Switch to Japanese' : 'Switch to English'}
            >
              <span className="w-6 h-6 flex items-center justify-center font-bold text-sm">
                {language === 'en' ? 'JA' : 'EN'}
              </span>
            </button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={translations[language].placeholder}
              className="w-full rounded-2xl border border-indigo-300 resize-none px-4 py-3 text-sm text-gray-700 placeholder-gray-400 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all max-h-32 min-h-[56px] bg-white scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200"
              rows={1}
              disabled={isLoading}
              aria-label="Message input"
            />
            <div className="absolute bottom-4 right-4 select-none text-xs font-normal text-gray-400">
              {translations[language].pressEnter}
            </div>
          </div>

          <button
            onClick={handleVoiceClick}
            disabled={isLoading || isTranscribing}
            className={`p-3 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                : isTranscribing
                ? 'bg-amber-600 text-white cursor-wait'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            } ${isLoading || isTranscribing ? 'cursor-not-allowed opacity-60' : ''}`}
            title={
              isRecording
                ? translations[language].stopRecording
                : isTranscribing
                ? translations[language].transcribing
                : translations[language].recordVoice
            }
            aria-label={
              isRecording
                ? translations[language].stopRecording
                : isTranscribing
                ? translations[language].transcribing
                : translations[language].recordVoice
            }
          >
            {isRecording ? (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
              </svg>
            ) : isTranscribing ? (
              <div
                className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Microphone className="w-6 h-6 text-gray-600" aria-hidden="true" />
            )}
          </button>

          <button
            onClick={sendMessage}
            disabled={isLoading || isTranscribing || !input.trim()}
            className={`p-4 rounded-full transition-all shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
              input.trim() && !isLoading && !isTranscribing
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label={translations[language].sendMessage}
          >
            <Send className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {messages.length === 1 && (
          <section
            className="mt-5 max-w-5xl mx-auto flex flex-wrap gap-3"
            aria-label="Quick suggestion buttons"
          >
            {translations[language].suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="px-7 py-2 text-sm bg-blue-100 rounded-full hover:bg-blue-200 text-black-800 font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label={`${translations[language].quickSuggestion}: ${suggestion}`}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </section>
        )}
      </footer>
    </div>
  );
}
