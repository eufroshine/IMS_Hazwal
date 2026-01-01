'use client';

import { useEffect, useState } from 'react';

interface PageLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function PageLoader({ isLoading, children }: PageLoaderProps) {
  const [showContent, setShowContent] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Small delay before showing content for smooth transition
      const timer = setTimeout(() => {
        setShowContent(true);
        // Another small delay for fade in animation
        setTimeout(() => setFadeIn(true), 50);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      setFadeIn(false);
    }
  }, [isLoading]);

  if (isLoading || !showContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-3 border-zinc-700 border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Loading text */}
        <p className="text-zinc-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        fadeIn 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}
