'use client';

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main content */}
      <main className="h-full">
        {children}
      </main>
    </div>
  );
} 