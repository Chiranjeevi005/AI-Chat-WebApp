'use client';

import { useState, useRef, useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import EmojiPicker from './EmojiPicker';

// Define types for our data
interface Message {
  id: string;
  user_id: string;
  user: string;
  text: string;
  time: string;
  self: boolean;
  isAI: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface TeamMember {
  name: string;
  avatar: string;
  color: string;
}

interface ChatAreaProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  newMessage?: string;
  setNewMessage?: (text: string) => void;
  sendMessage?: () => void;
  handleLogout?: () => void;
  userRole?: string;
  deleteMessage?: (messageId: string) => void;
  loadMoreMessages?: () => void;
  hasMoreMessages?: boolean;
  isTyping?: boolean;
  typingUsers?: string[];
}

export default function ChatArea({
  messages,
  addMessage,
  sidebarOpen,
  setSidebarOpen,
  newMessage = '',
  setNewMessage = () => {},
  sendMessage = () => {},
  handleLogout = () => {},
  userRole = 'user',
  deleteMessage = () => {},
  loadMoreMessages = () => {},
  hasMoreMessages = false,
  isTyping = false,
  typingUsers = []
}: ChatAreaProps) {
  const [currentSpeaker, setCurrentSpeaker] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollPositionRef = useRef(0);
  const messageElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Pool of realistic team members
  const teamMembers: TeamMember[] = [
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
  ];
  
  // Emojis to add personality
  const emojis = ['😀', '😎', '🤩', '😂', '🥳', '🤔', '👍', '🔥', '💯', '🚀'];
  
  useEffect(() => {
    // Scroll to bottom when messages change (only for new messages, not when loading history)
    if (messagesEndRef.current && chatContainerRef.current && scrollPositionRef.current === 0) {
      // Use native scroll with smooth behavior instead of GSAP scrollTo plugin
      chatContainerRef.current.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  }, [messages]);
  
  useEffect(() => {
    // Animate new messages with staggered entrance
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const messageElement = messageElementsRef.current.get(lastMessage.id);
      
      if (messageElement) {
        // Animate with GSAP for smooth entrance
        gsap.fromTo(messageElement,
          { opacity: 0, y: 20, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.4, 
            ease: 'back.out(1.4)',
            onStart: () => {
              // Ensure the message is visible
              messageElement.style.visibility = 'visible';
            }
          }
        );
      }
    }
  }, [messages]);
  
  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      scrollPositionRef.current = scrollTop;
      
      // Load more when scrolled to top
      if (scrollTop === 0 && hasMoreMessages) {
        loadMoreMessages();
      }
    };
    
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMoreMessages, loadMoreMessages]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: Date.now() + Math.floor(Math.random() * 10000) + '',
      user_id: 'current-user-id', // This will be replaced with actual user ID
      user: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true,
      isAI: false,
      status: 'sending'
    };
    
    addMessage(message);
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    const newMessageValue = newMessage + emoji;
    setNewMessage(newMessageValue);
    setShowEmojiPicker(false);
    
    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // Format message text with basic markdown
  const formatMessage = (text: string) => {
    // Bold text: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic text: *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links: [text](url)
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-cyan-300 hover:underline">$1</a>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
  };
  
  // Get status indicator icon
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return (
          <svg className="w-3 h-3 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'sent':
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'read':
        return (
          <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full chat-area">
      {/* Chat Header */}
      <div className="bg-gray-800 bg-opacity-50 glass p-4 border-b border-gray-700 flex items-center chat-header flex-shrink-0">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden mr-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-bold">Design Team</h2>
        <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <div className="ml-2 text-xs text-gray-400">Live</div>
        
        <div className="ml-auto flex space-x-4">
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-gray-900 to-gray-800 relative"
      >
        {/* Loading indicator for infinite scroll */}
        {hasMoreMessages && (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id}
            ref={(el) => {
              if (el) {
                messageElementsRef.current.set(message.id, el);
              } else {
                messageElementsRef.current.delete(message.id);
              }
            }}
            className={`mb-4 sm:mb-6 flex ${message.self ? 'justify-end' : 'justify-start'}`}
            style={{ visibility: 'hidden' }} // Hidden until animation starts
          >
            <div 
              className={`max-w-xs sm:max-w-md md:max-w-lg px-4 py-2 sm:px-5 sm:py-3 rounded-2xl message-bubble relative ${
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
              <div 
                className="mb-1 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
              ></div>
              <div 
                className={`text-xs flex justify-between items-center ${
                  message.isAI ? 'text-violet-200' : message.self ? 'text-cyan-200' : 'text-violet-200'
                }`}
              >
                <div className="flex items-center">
                  <span>{message.time}</span>
                  {message.self && getStatusIcon(message.status)}
                </div>
                {(userRole === 'admin' || message.self) && (
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="text-red-400 hover:text-red-300 ml-2 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {(isTyping || typingUsers.length > 0) && (
          <div className="flex justify-start mb-4 sm:mb-6">
            <div className="bg-gray-700 text-white rounded-2xl rounded-bl-none px-4 py-2 sm:px-5 sm:py-3">
              <div className="font-semibold text-sm mb-1 text-cyan-300">
                {typingUsers.length > 0 ? typingUsers.join(', ') : 'Someone'} is typing
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="bg-gray-800 bg-opacity-50 glass p-3 sm:p-4 border-t border-gray-700 message-input flex-shrink-0 relative">
        <div className="flex">
          <div className="flex items-center mr-2 sm:mr-3">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-full hover:bg-gray-700 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-full hover:bg-gray-700 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type a message... (**bold**, *italic*, [link](url))"
              className="w-full bg-gray-700 text-white rounded-2xl px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm sm:text-base max-h-40 transition-all duration-200"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-300 ${
                newMessage.trim() 
                  ? 'text-cyan-400 hover:bg-cyan-500 hover:text-white glow-cyan scale-100' 
                  : 'text-gray-500 scale-90'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1 ml-1 hidden sm:block transition-opacity duration-300">
          Markdown supported: **bold**, *italic*, [link](url)
        </div>
        
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2 transition-all duration-300 ease-out">
            <EmojiPicker 
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}