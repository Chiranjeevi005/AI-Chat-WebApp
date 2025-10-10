'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { generateMessage } from '@/utils/generateMessage';

export default function ChatPreview() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('AI-Chat'); // Default to AI-Chat

  // Team members with their details including avatar colors
  const teamMembers = [
    { name: 'Priya', role: 'Designer', avatar: 'P', color: 'from-pink-500 to-rose-500' },
    { name: 'Arjun', role: 'Developer', avatar: 'A', color: 'from-blue-500 to-cyan-500' },
    { name: 'Anaya', role: 'UX Strategist', avatar: 'A', color: 'from-purple-500 to-violet-500' },
    { name: 'Rohan', role: 'Project Lead', avatar: 'R', color: 'from-amber-500 to-orange-500' },
    { name: 'AI-Chat', role: 'Assistant', avatar: 'AI', color: 'from-cyan-500 to-blue-500' },
  ];

  useEffect(() => {
    // Initialize with a few messages
    const initialMessages = [];
    for (let i = 0; i < 5; i++) {
      const msg = generateMessage();
      initialMessages.push({
        id: Date.now() + i,
        user: msg.sender,
        text: msg.text,
        time: new Date(Date.now() + i * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
    setMessages(initialMessages);

    // Set up interval for continuous conversation
    const interval = setInterval(() => {
      // Generate the next message to determine who is typing
      const nextMsg = generateMessage();
      setTypingUser(nextMsg.sender);
      
      // Show typing indicator with the name of the next sender
      setIsTyping(true);
      
      // Add new message after a delay to simulate typing
      setTimeout(() => {
        const messageToAdd = {
          id: Date.now(),
          user: nextMsg.sender,
          text: nextMsg.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        
        setMessages(prev => {
          const updated = [...prev, messageToAdd];
          // Keep last 15 messages for performance
          if (updated.length > 15) updated.shift();
          return updated;
        });
        
        setIsTyping(false);
      }, 1500 + Math.random() * 1000); // Typing delay 1.5-2.5s
    }, 4000 + Math.random() * 2000); // New message every 4-6s

    return () => clearInterval(interval);
  }, []);

  // Animate new messages and handle scrolling
  useEffect(() => {
    if (messagesContainerRef.current) {
      const lastMessage = messagesContainerRef.current.lastElementChild;
      if (lastMessage) {
        gsap.fromTo(
          lastMessage,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
      
      // Scroll to bottom
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle scrolling when typing indicator appears
  useEffect(() => {
    if (isTyping && messagesContainerRef.current) {
      // Smooth scroll to bottom to ensure typing indicator is visible
      gsap.to(messagesContainerRef.current, {
        scrollTop: messagesContainerRef.current.scrollHeight,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, [isTyping]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Enhanced background elements for futuristic feel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
            Experience the Future of Chat
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how our platform transforms communication with immersive design and real-time interaction.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Enhanced chat container with futuristic styling */}
          <div className="glass rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
            {/* Enhanced chat header */}
            <div className="bg-gray-900 bg-opacity-70 p-4 border-b border-gray-700 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-4"></div>
                <h3 className="text-white font-semibold">Design Team Chat</h3>
                <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="ml-2 text-xs text-gray-400">Live demo</div>
                <div className="ml-auto flex items-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mr-1 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-violet-400 mr-1 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced messages area with dual alignment and gradient bubbles */}
            <div 
              ref={messagesContainerRef}
              className="p-6 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800"
            >
              {messages.map((message) => {
                const isAIChat = message.user === 'AI-Chat';
                const isTeamMember = !isAIChat;
                
                return (
                  <div 
                    key={message.id}
                    className={`mb-4 flex ${isAIChat ? 'justify-end' : 'justify-start'}`}
                  >
                    {isTeamMember && (
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${teamMembers.find(m => m.name === message.user)?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-xs mr-2 flex-shrink-0`}>
                        {message.user.charAt(0)}
                      </div>
                    )}
                    <div 
                      className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                        isAIChat 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none glow-cyan' 
                          : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-bl-none glow-violet border border-gray-600'
                      } shadow-lg relative`}
                    >
                      {!isAIChat && (
                        <div className="font-semibold text-sm mb-1 text-cyan-300">
                          {message.user}
                        </div>
                      )}
                      {isAIChat && (
                        <div className="font-semibold text-sm mb-1 text-blue-200 flex items-center">
                          <span className="mr-2">🤖</span>
                          {message.user}
                        </div>
                      )}
                      <div className="leading-relaxed">{message.text}</div>
                      <div 
                        className={`text-xs mt-1 flex justify-end ${
                          isAIChat ? 'text-blue-200' : 'text-violet-200'
                        }`}
                      >
                        {message.time}
                      </div>
                    </div>
                    {isAIChat && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs ml-2 flex-shrink-0">
                        AI
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Enhanced typing indicator with position based on sender */}
              {isTyping && (
                <div className={`mb-4 flex ${typingUser === 'AI-Chat' ? 'justify-end' : 'justify-start'}`}>
                  {typingUser !== 'AI-Chat' && (
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${teamMembers.find(m => m.name === typingUser)?.color || 'from-gray-600 to-gray-700'} flex items-center justify-center text-xs mr-2 flex-shrink-0`}>
                      {typingUser.charAt(0)}
                    </div>
                  )}
                  <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                    typingUser === 'AI-Chat' 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none glow-cyan' 
                      : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-bl-none glow-violet border border-gray-600'
                  } shadow-lg relative`}>
                    <div className={`font-semibold text-sm mb-1 ${typingUser === 'AI-Chat' ? 'text-blue-200 flex items-center' : 'text-cyan-300'}`}>
                      {typingUser === 'AI-Chat' && <span className="mr-2">🤖</span>}
                      {typingUser}
                    </div>
                    <div className="flex items-center">
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full ${typingUser === 'AI-Chat' ? 'bg-blue-300' : 'bg-cyan-400'} animate-bounce`}></div>
                        <div className={`w-2 h-2 rounded-full ${typingUser === 'AI-Chat' ? 'bg-blue-200' : 'bg-violet-400'} animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                        <div className={`w-2 h-2 rounded-full ${typingUser === 'AI-Chat' ? 'bg-cyan-300' : 'bg-purple-400'} animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                  {typingUser === 'AI-Chat' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs ml-2 flex-shrink-0">
                      AI
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Enhanced input area */}
            <div className="p-4 border-t border-gray-700 bg-gray-900 bg-opacity-30 backdrop-blur-sm">
              <div className="flex">
                <div className="flex items-center mr-2">
                  <button className="text-gray-400 hover:text-cyan-400 p-2 rounded-full hover:bg-gray-700 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 glow-cyan ml-2">
                  Send
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced room sidebar preview */}
          <div className="mt-8 glass rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Active Rooms</h3>
              <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {['Design Team', 'Marketing', 'Development', 'General'].map((room, index) => (
                <div 
                  key={index}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-cyan-700 to-blue-700 glow-cyan shadow-lg' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mr-3 ${index === 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  <span className="text-white">{room}</span>
                  {index === 0 && (
                    <span className="ml-auto bg-cyan-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">3</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}