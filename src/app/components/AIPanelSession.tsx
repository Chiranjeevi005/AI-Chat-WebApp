'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ChatArea from './ChatArea';
import RoomSidebar from './RoomSidebar';
import AIAssistantPanel from './AIAssistantPanel';

// Define types for our data
interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
  self: boolean;
  isAI?: boolean;
}

interface AIState {
  listening: boolean;
  analyzing: boolean;
  context: string;
  participants: string[];
}

interface UpdateAIParams {
  listening?: boolean;
  analyzing?: boolean;
  context?: string;
  participants?: string[];
}

// Mock AI session context
const useAIPanelSession = () => {
  const [sessionId] = useState(`AIPanelSession_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      user: 'AI Assistant', 
      text: '👋 Welcome to your AI Session. Ready to co-create ideas or chat with the team?', 
      time: 'Just now', 
      self: false,
      isAI: true
    }
  ]);
  const [aiState, setAiState] = useState<AIState>({
    listening: false,
    analyzing: false,
    context: 'Product brainstorming',
    participants: ['You', 'AI Assistant']
  });
  
  const updateAI = (newState: UpdateAIParams) => {
    setAiState(prev => ({ ...prev, ...newState }));
  };
  
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, { ...message, id: Date.now() }]);
  };
  
  return {
    sessionId,
    messages,
    aiState,
    updateAI,
    addMessage
  };
};

export default function AIPanelSession() {
  const { sessionId, messages, aiState, updateAI, addMessage } = useAIPanelSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize AI panel animation
    if (aiPanelRef.current) {
      gsap.fromTo(aiPanelRef.current,
        { x: 400, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power3.out',
          delay: 0.5
        }
      );
    }
    
    // Animate chat area
    if (chatAreaRef.current) {
      gsap.fromTo(chatAreaRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'power2.out',
          delay: 0.3
        }
      );
    }
    
    // Animate sidebar
    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current,
        { x: -300, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.7, 
          ease: 'power2.out',
          delay: 0.1
        }
      );
    }
    
    // Simulate AI analyzing context
    const analyzeTimer = setTimeout(() => {
      updateAI({ analyzing: true });
      
      setTimeout(() => {
        updateAI({ analyzing: false, listening: true });
      }, 2000);
    }, 3000);
    
    return () => clearTimeout(analyzeTimer);
  }, [updateAI]);
  
  return (
    <div className="flex h-full">
      {/* Room Sidebar */}
      <div ref={sidebarRef}>
        <RoomSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          sessionId={sessionId}
        />
      </div>
      
      {/* Main Chat Area */}
      <div ref={chatAreaRef} className="flex-1 flex">
        <ChatArea 
          messages={messages}
          addMessage={addMessage}
          aiState={aiState}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* AI Assistant Panel */}
        <div ref={aiPanelRef} className="w-96 border-l border-gray-700">
          <AIAssistantPanel 
            messages={messages}
            aiState={aiState}
            updateAI={updateAI}
          />
        </div>
      </div>
    </div>
  );
}