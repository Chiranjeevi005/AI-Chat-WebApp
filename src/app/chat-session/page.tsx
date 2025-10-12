'use client';

import { useState, useEffect } from 'react';
import AIPanelSession from '@/app/components/AIPanelSession';
import Image from 'next/image';

export default function ChatSessionPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading AI environment
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/30">
                <Image 
                  src="/assets/logo.png" 
                  alt="AI Chat Logo" 
                  width={80} 
                  height={80} 
                  className="rounded-full"
                />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-500/10 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing AI Environment</h2>
          <p className="text-gray-400">Preparing your intelligent chat experience...</p>
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black">
      <AIPanelSession />
    </div>
  );
}