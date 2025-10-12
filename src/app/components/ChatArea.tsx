'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function ChatArea({ 
  messages, 
  addMessage,
  aiState,
  sidebarOpen,
  setSidebarOpen
}: { 
  messages: any[]; 
  addMessage: (message: any) => void;
  aiState: any;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Pool of realistic team members
  const teamMembers = [
    { name: 'Alex Morgan', avatar: 'AM', color: 'from-cyan-500 to-blue-500' },
    { name: 'Sam Rivera', avatar: 'SR', color: 'from-violet-500 to-purple-500' },
    { name: 'Jordan Lee', avatar: 'JL', color: 'from-pink-500 to-rose-500' },
    { name: 'Taylor Kim', avatar: 'TK', color: 'from-emerald-500 to-teal-500' },
    { name: 'Casey Smith', avatar: 'CS', color: 'from-amber-500 to-orange-500' },
  ];
  
  // Pool of realistic, humorous messages
  const messagePool = [
    // Tech humor
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why do Java developers wear glasses? Because they don't C#!",
    "There are only 10 types of people in the world: those who understand binary and those who don't.",
    "Why did the programmer quit his job? He didn't get arrays.",
    
    // Office humor
    "I haven't slept for ten days, because that would be too long.",
    "My therapist says I have a preoccupation with vengeance. We'll see about that.",
    "I'm reading a book about anti-gravity. It's impossible to put down!",
    "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
    
    // Work related
    "The new color scheme looks amazing! Who picked it?",
    "I think we need to talk about the deployment schedule...",
    "Anyone else having trouble with the new auth flow?",
    "The client loved the prototype! They want to move forward with phase 2.",
    "Don't forget the team lunch at 1 PM today!",
    
    // AI related
    "I noticed you've been discussing color consistency a lot. Would you like a summary?",
    "Here's a condensed version of this conversation so far.",
    "Would you like to convert this discussion into a design document draft?",
    "I detected 3 recurring topics in our conversation: design, deployment, and user feedback.",
    "Based on our discussion, I can summarize the key points for you.",
  ];
  
  // Emojis to add personality
  const emojis = ['😀', '😎', '🤩', '😂', '🥳', '🤔', '👍', '🔥', '💯', '🚀'];
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      }, 100);
    }
  }, [messages]);
  
  useEffect(() => {
    // Simulate AI messages
    const aiMessages = [
      { 
        id: Date.now() + 100, 
        user: 'AI Assistant', 
        text: 'AI: I noticed you’ve been discussing color consistency a lot. Would you like a summary?', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: false,
        isAI: true
      },
      { 
        id: Date.now() + 200, 
        user: 'AI Assistant', 
        text: 'AI: Here’s a condensed version of this conversation so far.', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: false,
        isAI: true
      }
    ];
    
    // Add AI messages with delay
    const aiTimer1 = setTimeout(() => {
      addMessage(aiMessages[0]);
    }, 5000);
    
    const aiTimer2 = setTimeout(() => {
      addMessage(aiMessages[1]);
    }, 10000);
    
    return () => {
      clearTimeout(aiTimer1);
      clearTimeout(aiTimer2);
    };
  }, [addMessage]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      user: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true
    };
    
    addMessage(message);
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-gray-800 bg-opacity-50 glass p-4 border-b border-gray-700 flex items-center chat-header">
        <button 
          onClick={toggleSidebar}
          className="md:hidden mr-4 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-bold">Design Team</h2>
        <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <div className="ml-2 text-xs text-gray-400">Live</div>
        
        <div className="ml-4 flex items-center">
          {aiState.listening && (
            <div className="flex items-center text-xs text-cyan-400">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-1"></div>
              AI is listening...
            </div>
          )}
          {aiState.analyzing && (
            <div className="flex items-center text-xs text-purple-400 ml-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse mr-1"></div>
              AI analyzing context...
            </div>
          )}
        </div>
        
        <div className="ml-auto flex space-x-4">
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800"
      >
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`mb-6 flex ${message.self ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl message-bubble ${
                message.isAI 
                  ? 'bg-gradient-to-r from-purple-700 to-violet-700 text-white rounded-br-none glow-violet' 
                  : message.self 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none glow-cyan' 
                    : 'bg-gray-700 text-white rounded-bl-none glow-violet'
              }`}
            >
              {!message.self && (
                <div className="font-semibold text-sm mb-1 text-cyan-300">
                  {message.user} {message.isAI && '🤖'}
                </div>
              )}
              <div className="mb-1">{message.text}</div>
              <div 
                className={`text-xs ${
                  message.isAI ? 'text-violet-200' : message.self ? 'text-cyan-200' : 'text-violet-200'
                }`}
              >
                {message.time}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start mb-6">
            <div className="bg-gray-700 text-white rounded-2xl rounded-bl-none px-5 py-3">
              <div className="font-semibold text-sm mb-1 text-cyan-300">{currentSpeaker}</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-gray-800 bg-opacity-50 glass p-4 border-t border-gray-700">
        <div className="flex">
          <div className="flex items-center mr-3">
            <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-gray-700 text-white rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                newMessage.trim() 
                  ? 'text-cyan-400 hover:bg-cyan-500 hover:text-white glow-cyan' 
                  : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}