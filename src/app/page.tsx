'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useAuth } from './components/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debugging: Log user authentication state changes
    console.log('Home page - User authentication state changed:', { user, loading });
  }, [user, loading]);

  const particlePositions = [
    { width: 4, height: 5, top: 12, left: 20 },
    { width: 5, height: 4, top: 28, left: 80 },
    { width: 3, height: 6, top: 42, left: 15 },
    { width: 6, height: 3, top: 58, left: 85 },
    { width: 4, height: 5, top: 72, left: 25 },
    { width: 5, height: 4, top: 18, left: 45 },
    { width: 3, height: 6, top: 32, left: 65 },
    { width: 6, height: 3, top: 48, left: 75 },
    { width: 4, height: 5, top: 62, left: 18 },
    { width: 5, height: 4, top: 78, left: 70 },
    { width: 3, height: 6, top: 22, left: 35 },
    { width: 6, height: 3, top: 38, left: 90 },
    { width: 4, height: 5, top: 52, left: 28 },
    { width: 5, height: 4, top: 68, left: 60 },
    { width: 3, height: 6, top: 85, left: 40 },
    { width: 6, height: 3, top: 15, left: 55 },
    { width: 4, height: 5, top: 30, left: 78 },
    { width: 5, height: 4, top: 45, left: 12 },
    { width: 3, height: 6, top: 60, left: 95 },
    { width: 6, height: 3, top: 75, left: 38 },
    { width: 4, height: 5, top: 20, left: 68 },
    { width: 5, height: 4, top: 35, left: 18 },
    { width: 3, height: 6, top: 50, left: 88 },
    { width: 6, height: 3, top: 65, left: 28 },
    { width: 4, height: 5, top: 80, left: 72 },
    { width: 5, height: 4, top: 25, left: 16 },
    { width: 3, height: 6, top: 40, left: 92 },
    { width: 6, height: 3, top: 55, left: 38 },
    { width: 4, height: 5, top: 70, left: 62 },
    { width: 5, height: 4, top: 87, left: 48 }
  ];

  useEffect(() => {
    // Animate background particles
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('.particle');
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          opacity: 0.2 + (i * 0.008),
          duration: 2.5 + (i * 0.08),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.07
        });
      });
    }

    // Fade in the entire content smoothly
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power2.out'
        }
      );
    }

    // Staggered animation for text elements
    if (contentRef.current) {
      const title = contentRef.current.querySelector('h1');
      const subtitle = contentRef.current.querySelector('p:first-of-type');
      const button = contentRef.current.querySelector('button');
      const footerText = contentRef.current.querySelector('p:last-of-type');
      
      if (title) {
        gsap.fromTo(title,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            delay: 0.2,
            ease: 'power2.out'
          }
        );
      }
      
      if (subtitle) {
        gsap.fromTo(subtitle,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            delay: 0.4,
            ease: 'power2.out'
          }
        );
      }
      
      // Initial button animation
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { scale: 0.9, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.6, 
            delay: 0.6,
            ease: 'elastic.out(1, 0.3)'
          }
        );
      }
      
      if (footerText) {
        gsap.fromTo(footerText,
          { opacity: 0 },
          { 
            opacity: 1, 
            duration: 0.8, 
            delay: 0.8,
            ease: 'power2.out'
          }
        );
      }
    }
  }, []);

  const handleStartChatting = () => {
    if (isLoading) return;
    
    console.log('Start Chatting clicked - Current auth state:', { user, loading });
    
    // Check if user is authenticated - more reliable check
    // We need to check if we have a user with an ID or email
    const isUserAuthenticated = user && (user.id || user.email);
    
    console.log('Auth check result:', { isUserAuthenticated, user, loading });
    
    // If user is authenticated, redirect immediately to chat session
    if (isUserAuthenticated) {
      console.log('User is authenticated, redirecting to chat session');
      router.push('/chat-session');
      return;
    }
    
    // If not authenticated, proceed with animation and redirect to login
    console.log('User is not authenticated, proceeding with animation to login');
    startAnimation(false);
  };
  
  const startAnimation = (isUserAuthenticated: boolean) => {
    setIsLoading(true);
    
    // Button animation on click
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.2,
        onComplete: () => {
          gsap.to(buttonRef.current, {
            scale: 1.1,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in'
          });
        }
      });
    }
    
    // Animate logo
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        scale: 1.2,
        rotation: 360,
        duration: 1,
        ease: 'power2.inOut'
      });
    }
    
    // Container zoom animation
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 3,
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          // Navigate based on authentication status
          console.log('Animation complete - Navigating. Authenticated:', isUserAuthenticated);
          
          if (isUserAuthenticated) {
            console.log('Redirecting to chat session');
            router.push('/chat-session');
          } else {
            console.log('Redirecting to login');
            router.push('/auth/login');
          }
        }
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[rgb(var(--gradient-start))] to-[rgb(var(--gradient-end))]"
    >
      {/* Animated background particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20"
            style={{
              width: `${pos.width}px`,
              height: `${pos.height}px`,
              top: `${pos.top}%`,
              left: `${pos.left}%`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl"></div>
      
      {/* Main content with smooth fade-in animation */}
      <div 
        ref={contentRef}
        className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center opacity-0"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Chat Beyond Limits — Where AI Joins the Conversation.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Step into a real-time chat experience powered by contextual intelligence.
          Every word you type helps AI understand, enhance, and co-create.
        </p>
        
        <div className="flex justify-center w-full">
          <button
            ref={buttonRef}
            onClick={handleStartChatting}
            disabled={isLoading}
            className="relative px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center group border border-cyan-500/30 overflow-hidden hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 glow-cyan"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center">
              {isLoading ? (
                <>
                  <div className="flex items-center">
                    <div ref={logoRef} className="relative mr-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500/30">
                        <Image 
                          src="/assets/logo.png" 
                          alt="AI Chat Logo" 
                          width={40} 
                          height={40} 
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                    </div>
                    <span>Initializing AI Environment...</span>
                  </div>
                </>
              ) : (
                <>
                  Start Chatting 🚀
                  <svg 
                    className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mt-6">
          Step into the future of conversations — where AI and humans think together.
        </p>
      </div>
    </div>
  );
}