'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function RoomSidebar({ 
  sidebarOpen, 
  setSidebarOpen,
  sessionId
}: { 
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void;
  sessionId: string;
}) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sidebarRef.current) {
      if (sidebarOpen) {
        gsap.fromTo(
          sidebarRef.current,
          { x: -300 },
          { x: 0, duration: 0.5, ease: 'power2.out' }
        );
      } else {
        gsap.to(sidebarRef.current, {
          x: -300,
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
    }
  }, [sidebarOpen]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div 
      ref={sidebarRef}
      className={`absolute md:relative z-30 w-64 bg-gray-800 bg-opacity-50 glass h-full transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 sidebar-container border-r border-gray-700`}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Chat Rooms</h2>
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-2">SESSION ID</div>
          <div className="text-sm font-mono bg-gray-700/50 p-2 rounded-lg text-cyan-300">
            {sessionId}
          </div>
        </div>
        
        <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl mb-4 flex items-center justify-center glow-cyan">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Room
        </button>
        
        <div className="space-y-2 mt-6">
          {[
            { name: 'Design Team', unread: 3, active: true, isAI: false },
            { name: 'Marketing', unread: 0, active: false, isAI: false },
            { name: 'Development', unread: 1, active: false, isAI: false },
            { name: 'General', unread: 0, active: false, isAI: false },
            { name: 'AI Room 🧠', unread: 5, active: false, isAI: true },
          ].map((room, index) => (
            <div 
              key={index}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                room.active 
                  ? 'bg-gradient-to-r from-cyan-700 to-blue-700 glow-cyan' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mr-3 ${room.active ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <span className="flex-1">{room.name}</span>
              {room.isAI && (
                <span className="ml-2 text-xs bg-gradient-to-r from-purple-500 to-violet-500 text-white px-2 py-1 rounded-full">
                  AI
                </span>
              )}
              {room.unread > 0 && (
                <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                  {room.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}