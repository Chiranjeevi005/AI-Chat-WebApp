'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initial messages for the chat interface with unique IDs
  const [messages, setMessages] = useState([
    { id: Date.now() + 1, user: 'Alex Morgan', text: 'Hey team, how\'s the new UI coming along?', time: '10:30 AM', self: false },
    { id: Date.now() + 2, user: 'You', text: 'Making great progress! The new dashboard is almost ready.', time: '10:32 AM', self: true },
    { id: Date.now() + 3, user: 'Sam Rivera', text: 'Just finished the API integration. Ready for testing!', time: '10:35 AM', self: false },
    { id: Date.now() + 4, user: 'You', text: 'Perfect! Let\'s schedule a review for tomorrow.', time: '10:36 AM', self: true },
  ]);
  
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
    
    // Random fun
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a fake noodle? An impasta!",
    "How does a penguin build its house? Igloos it together!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
  ];
  
  // Emojis to add personality
  const emojis = ['😀', '😎', '🤩', '😂', '🥳', '🤔', '👍', '🔥', '💯', '🚀'];

  useEffect(() => {
    // Animate sidebar on load
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: sidebarOpen ? 0 : -300 },
        { x: 0, duration: 0.5, ease: 'power2.out' }
      );
    }

    // Function to add a new message
    const addNewMessage = () => {
      // Randomly decide if we should add an emoji
      const shouldAddEmoji = Math.random() > 0.7;
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      // Select a random team member (not the last speaker)
      let randomMember;
      do {
        randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
      } while (randomMember.name === currentSpeaker);
      
      // Select a random message
      const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
      
      // Create the new message with a unique ID
      const newMessage = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        user: randomMember.name,
        text: shouldAddEmoji ? `${randomMessage} ${randomEmoji}` : randomMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: false // All messages from team members, not self
      };
      
      // Update state
      setMessages(prev => [...prev, newMessage]);
      setCurrentSpeaker(randomMember.name);
      setTyping(false);
      
      // Scroll to bottom
      if (chatContainerRef.current) {
        setTimeout(() => {
          chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
        }, 100);
      }
    };

    // Simulate typing indicator
    const typingTimer = setTimeout(() => {
      // Select a random team member to "type"
      let randomMember;
      do {
        randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
      } while (randomMember.name === currentSpeaker);
      
      setCurrentSpeaker(randomMember.name);
      setTyping(true);
      
      // Remove typing indicator and add message after delay
      const removeTyping = setTimeout(() => {
        addNewMessage();
      }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
      
      return () => clearTimeout(removeTyping);
    }, 3000); // Initial delay before first message

    // Set up interval for continuous conversation
    const conversationInterval = setInterval(() => {
      if (!typing) {
        // Select a random team member to "type"
        let randomMember;
        do {
          randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
        } while (randomMember.name === currentSpeaker);
        
        setCurrentSpeaker(randomMember.name);
        setTyping(true);
        
        // Remove typing indicator and add message after delay
        const removeTyping = setTimeout(() => {
          addNewMessage();
        }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
        
        return () => clearTimeout(removeTyping);
      }
    }, 8000 + Math.random() * 7000); // New message every 8-15 seconds

    return () => {
      clearTimeout(typingTimer);
      clearInterval(conversationInterval);
    };
  }, [currentSpeaker, typing, sidebarOpen]);

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      if (sidebarOpen) {
        gsap.to(sidebarRef.current, {
          x: -300,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => setSidebarOpen(false)
        });
      } else {
        setSidebarOpen(true);
        gsap.fromTo(
          sidebarRef.current,
          { x: -300 },
          { x: 0, duration: 0.5, ease: 'power2.out' }
        );
      }
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message = {
      id: Date.now() + Math.floor(Math.random() * 10000), // Unique ID for the new message
      user: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Scroll to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`absolute md:relative z-30 w-64 bg-gray-800 bg-opacity-50 glass h-full transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 sidebar-container`}
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
          <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl mb-4 flex items-center justify-center glow-cyan">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Room
          </button>
          
          <div className="space-y-2 mt-6">
            {[
              { name: 'Design Team', unread: 3, active: true },
              { name: 'Marketing', unread: 0, active: false },
              { name: 'Development', unread: 1, active: false },
              { name: 'General', unread: 0, active: false },
              { name: 'Project Alpha', unread: 5, active: false },
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
      
      {/* Main Chat Area */}
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
                  message.self 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none glow-cyan' 
                    : 'bg-gray-700 text-white rounded-bl-none glow-violet'
                }`}
              >
                {!message.self && (
                  <div className="font-semibold text-sm mb-1 text-cyan-300">{message.user}</div>
                )}
                <div className="mb-1">{message.text}</div>
                <div 
                  className={`text-xs ${
                    message.self ? 'text-cyan-200' : 'text-violet-200'
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
      
      {/* Right Sidebar - Online Users */}
      <div className="hidden lg:block w-64 bg-gray-800 bg-opacity-50 glass border-l border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Online Users</h2>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {teamMembers.map((user, index) => (
              <div key={index} className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${user.color} flex items-center justify-center`}>
                    <span className="font-semibold">{user.avatar}</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    index < 3 ? 'bg-green-500' : 
                    index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                </div>
                <div className="ml-3">
                  <div className="font-medium">{user.name}</div>
                  <div className={`text-xs ${
                    index < 3 ? 'text-green-400' : 
                    index === 3 ? 'text-yellow-400' : 'text-gray-500'
                  }`}>
                    {index < 3 ? 'Online' : index === 3 ? 'Away' : 'Offline'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}