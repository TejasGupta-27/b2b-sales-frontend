"use client";

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  Bot,
  Shield,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/i18n';

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-sky-100/70 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 bg-blue-50/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-20 h-20 md:w-60 md:h-60 bg-indigo-100/40 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 md:w-40 md:h-40 bg-cyan-100/50 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 relative z-10 max-w-7xl">
        {/* Hero Section */}
        <div className="min-h-[45vh] flex flex-col justify-center text-center mb-6 md:mb-8">
          <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-sky-200/50 to-blue-200/30 backdrop-blur-sm border border-sky-300/50 text-sky-700 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2 text-sky-600" />
            {t.aiSalesTagline || "AI-Powered Sales Intelligence"}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4 leading-tight">
            {t.heroTitle || "B2B SALES"}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500 animate-pulse">
              {t.heroAgent || "AGENT"}
            </span>
          </h1>

          <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto mb-4 md:mb-6 leading-relaxed px-4">
            {t.heroDescription ||
              "Transform your sales process with our intelligent AI assistant. Get personalized product recommendations, instant quotations, and strategic insights that drive revenue growth."}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-4 md:mb-6 px-4">
            <Link
              href="/sales"
              className="group inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-sky-400/30 hover:scale-105 transform w-full sm:w-auto"
            >
              <Bot className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:animate-bounce" />
              {t.ctaStart || "Start AI Conversation"}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm text-slate-500 px-4">
            <div className="flex items-center">
              <Shield className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 mr-1.5 md:mr-2" />
              {t.enterpriseSecurity || "Enterprise Security"}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 mr-1.5 md:mr-2" />
              {t.support247 || "24/7 Support"}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 pb-8 md:pb-12">
          {[
            {
              icon: MessageSquare,
              title: t.features?.smartConvoTitle || "Smart Conversations",
              description:
                t.features?.smartConvoDesc ||
                "Advanced NLP understands context, intent, and nuanced business requirements.",
              gradient: "from-sky-400 to-blue-400",
              hoverColor: "hover:shadow-sky-300/30",
            },
            {
              icon: ShoppingCart,
              title: t.features?.smartRecoTitle || "Smart Recommendations",
              description:
                t.features?.smartRecoDesc ||
                "AI analyzes your industry and requirements to suggest perfect products.",
              gradient: "from-emerald-400 to-teal-400",
              hoverColor: "hover:shadow-emerald-300/30",
            },
            {
              icon: TrendingUp,
              title: t.features?.quoteTitle || "Instant Quotations",
              description:
                t.features?.quoteDesc ||
                "Generate comprehensive quotes with pricing and timelines in seconds.",
              gradient: "from-blue-400 to-indigo-400",
              hoverColor: "hover:shadow-blue-300/30",
            },
            {
              icon: Users,
              title: t.features?.b2bTitle || "B2B Optimized",
              description:
                t.features?.b2bDesc ||
                "Built for complex B2B sales cycles with multi-stakeholder processes.",
              gradient: "from-amber-400 to-orange-400",
              hoverColor: "hover:shadow-amber-300/30",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`group bg-white/90 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl ${feature.hoverColor} transition-all duration-300 hover:-translate-y-2 border border-slate-200/70 hover:border-sky-200/50`}
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-slate-800">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-gradient-to-r from-sky-100 to-blue-50 rounded-3xl p-6 md:p-8 mb-12 border border-sky-200/50 shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-500/10 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-sky-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <blockquote className="text-lg md:text-xl italic text-slate-700 mb-4">
              {t.testimonial || `"Made by Summer Interns at Otsuka Shokai, Japan"`}
            </blockquote>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
            {t.footerTitle || "Ready to transform your sales process?"}
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">
            {t.footerSubtitle ||
              "Join thousands of businesses already accelerating their sales with AI"}
          </p>
          <Link
            href="/sales"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-sky-300/30 transition-all duration-300"
          >
            {t.ctaSecondary || "Get Started Now"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
