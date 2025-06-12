'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowUp
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  // Initialize mounted state
  useEffect(() => {
    setIsMounted(true);
    
    // Set initial window size
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, []);

  // Initialize particles for background animation
  useEffect(() => {
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 20
    }));
    setBackgroundParticles(particles);
  }, []);

  // Track mouse for subtle interactive effects
  useEffect(() => {
    if (!isMounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMounted]);

  // Track window resize
  useEffect(() => {
    if (!isMounted) return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate mouse following gradient position safely
  const getGradientPosition = () => {
    if (!isMounted || windowSize.width === 0 || windowSize.height === 0) {
      return { left: 0, top: 0 };
    }
    
    return {
      left: Math.max(0, Math.min(windowSize.width - 192, mousePosition.x - 96)),
      top: Math.max(0, Math.min(windowSize.height - 192, mousePosition.y - 96))
    };
  };

  const gradientPosition = getGradientPosition();

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 transition-all duration-1000">
        
        {/* Animated Particles */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {backgroundParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Subtle Mouse-following Gradient - Only render when mounted */}
        {isMounted && (
          <div 
            className="absolute w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-radial from-blue-500/5 via-purple-500/3 to-transparent rounded-full blur-3xl transition-all duration-700 ease-out pointer-events-none"
            style={{
              left: gradientPosition.left,
              top: gradientPosition.top,
              transform: 'translate3d(0, 0, 0)'
            }}
          />
        )}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        {/* Interactive Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400/40 rounded-full floating-slow glow-pulse shadow-lg shadow-blue-400/20"></div>
          <div className="absolute top-1/5 right-1/3 w-2 h-2 bg-purple-400/50 rounded-full floating-medium glow-pulse shadow-lg shadow-purple-400/25" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-1/3 right-1/5 w-4 h-4 bg-pink-400/35 rounded-full floating-slow glow-pulse shadow-lg shadow-pink-400/20" style={{animationDelay: '3s'}}></div>
          
          {/* Gradient Lines */}
          <div className="absolute top-1/3 right-1/4 w-1 h-16 bg-gradient-to-b from-blue-500/60 via-purple-500/40 to-transparent rounded-full floating-medium rotate-12"></div>
          <div className="absolute bottom-1/4 left-1/6 w-1 h-20 bg-gradient-to-t from-purple-500/50 via-pink-500/30 to-transparent rounded-full floating-slow -rotate-6" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-2/3 left-1/3 w-12 h-1 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent rounded-full floating-fast"></div>
          
          {/* Animated Borders */}
          <div className="absolute top-1/2 right-1/6 w-6 h-6 border-2 border-amber-400/60 rounded-full floating-medium border-pulse" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute bottom-1/5 left-1/4 w-8 h-8 border border-cyan-400/50 rounded-lg floating-slow rotate-45 border-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Sparkle Effects */}
          <div className="absolute top-1/6 left-1/2 w-1 h-1 bg-white/80 rounded-full sparkle" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-2/5 right-1/3 w-1 h-1 bg-white/70 rounded-full sparkle" style={{animationDelay: '3.5s'}}></div>
          <div className="absolute top-3/5 left-1/5 w-1 h-1 bg-white/90 rounded-full sparkle" style={{animationDelay: '2.2s'}}></div>
          
          {/* Interactive Gradient Blobs */}
          <div className="absolute top-1/8 right-1/5 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/15 rounded-full blur-sm floating-slow scale-pulse"></div>
          <div className="absolute bottom-1/6 left-1/8 w-20 h-20 bg-gradient-to-tr from-purple-400/15 to-pink-400/20 rounded-full blur-md floating-medium scale-pulse" style={{animationDelay: '3s'}}></div>
        </div>
      </div>

      {/* Main Content with Enhanced Styling */}
      <main className="relative z-10 min-h-screen w-full">
        <div className="relative w-full">
          {/* Content wrapper with subtle animations */}
          <div className="animate-in fade-in duration-700 ease-out w-full">
            {children}
          </div>
          
          {/* Decorative Elements - Smaller and responsive */}
          <div className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 pointer-events-none">
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <div className="w-1 sm:w-2 h-4 sm:h-8 bg-gradient-to-t from-blue-400 to-transparent rounded-full opacity-30"></div>
              <div className="w-1 sm:w-2 h-2 sm:h-4 bg-gradient-to-t from-purple-400 to-transparent rounded-full opacity-20"></div>
              <div className="w-1 sm:w-2 h-1 sm:h-2 bg-pink-400 rounded-full opacity-40 animate-pulse"></div>
            </div>
          </div>

          <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 pointer-events-none">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="w-4 sm:w-8 h-1 sm:h-2 bg-gradient-to-r from-transparent to-blue-400 rounded-full opacity-30"></div>
              <div className="w-2 sm:w-4 h-1 sm:h-2 bg-gradient-to-r from-transparent to-purple-400 rounded-full opacity-20"></div>
              <div className="w-1 sm:w-2 h-1 sm:h-2 bg-pink-400 rounded-full opacity-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button - Only render when mounted */}
      {isMounted && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 group"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .animate-in {
          animation: animate-in 0.7s ease-out;
        }

        .fade-in {
          animation: fade-in 0.7s ease-out;
        }

        .floating-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .floating-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .floating-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        .glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .border-pulse {
          animation: border-pulse 2s ease-in-out infinite;
        }

        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .scale-pulse {
          animation: scale-pulse 4s ease-in-out infinite;
        }

        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-3px);
          }
          75% {
            transform: translateY(-15px) translateX(8px);
          }
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) translateX(-5px) rotate(2deg);
          }
          66% {
            transform: translateY(-12px) translateX(7px) rotate(-1deg);
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0px) scaleX(1);
          }
          50% {
            transform: translateY(-6px) scaleX(1.1);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
            box-shadow: 0 0 10px currentColor;
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
            box-shadow: 0 0 20px currentColor;
          }
        }

        @keyframes border-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotate(180deg);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes scale-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.25;
          }
        }

        /* Prevent horizontal overflow */
        body {
          overflow-x: hidden;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for the entire page */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }

        /* Ensure no elements overflow */
        * {
          box-sizing: border-box;
        }

        /* Light mode styling */
        body {
          color: #1f2937;
        }

        input,
        textarea,
        select {
          background-color: rgba(255, 255, 255, 0.8);
          color: #1f2937;
          border-color: rgba(209, 213, 219, 0.5);
        }

        input:focus,
        textarea:focus,
        select:focus {
          background-color: rgba(255, 255, 255, 0.95);
          border-color: #4f46e5;
          outline: none;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        input::placeholder,
        textarea::placeholder {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}