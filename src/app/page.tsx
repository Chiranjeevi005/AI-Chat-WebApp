'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debugging: Log user authentication state changes
    console.log('Home page - User authentication state changed:', { user, loading, isAuthenticated });
  }, [user, loading, isAuthenticated]);

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
    // Animate background particles with more subtle, professional movements
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('.particle');
      particles.forEach((particle, i) => {
        // More subtle floating animation
        gsap.to(particle, {
          y: Math.sin(i) * 10,
          x: Math.cos(i) * 10,
          opacity: 0.1 + (i * 0.005),
          duration: 3 + (i * 0.1),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.05
        });
      });
    }

    // Enhanced content entrance with staggered, smooth animations
    if (contentRef.current) {
      // Fade in the entire content with a more professional easing
      // Keep content hidden initially and let GSAP handle the animation
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          ease: 'power2.out',
          delay: 0.1
        }
      );
    }

    // Staggered animation for text elements with more subtle timing
    if (contentRef.current) {
      const title = contentRef.current.querySelector('h1');
      const subtitle = contentRef.current.querySelector('p:first-of-type');
      const button = contentRef.current.querySelector('button');
      const footerText = contentRef.current.querySelector('p:last-of-type');
      
      // Title animation with slight delay
      if (title) {
        gsap.fromTo(title,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.9, 
            delay: 0.4,
            ease: 'power2.out'
          }
        );
      }
      
      // Subtitle animation with gentle stagger
      if (subtitle) {
        gsap.fromTo(subtitle,
          { opacity: 0, y: 15 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            delay: 0.6,
            ease: 'power2.out'
          }
        );
      }
      
      // Button animation with subtle entrance
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { scale: 0.95, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.7, 
            delay: 0.8,
            ease: 'back.out(1.2)'
          }
        );
      }
      
      // Footer text with gentle fade
      if (footerText) {
        gsap.fromTo(footerText,
          { opacity: 0 },
          { 
            opacity: 1, 
            duration: 0.8, 
            delay: 1.0,
            ease: 'power2.out'
          }
        );
      }
    }

    // Subtle background gradient shift for depth
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        backgroundPosition: '100% 100%',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

  const handleStartChatting = () => {
    console.log('Start Chatting clicked - Starting direct transition');
    
    // Start the direct transition animation
    startDirectTransition();
  };
  
  const startDirectTransition = () => {
    // Immediately start the immersive animation without showing button loader
    startImmersiveAnimation();
  };
  
  const startImmersiveAnimation = () => {
    setIsLoading(true);
    
    // Animate particles with a more refined effect
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('.particle');
      gsap.to(particles, {
        scale: 1.5,
        opacity: 0,
        duration: 1.2,
        stagger: 0.015,
        ease: 'power2.inOut'
      });
    }
    
    // Animate glowing orbs with staggered fade
    const orbs = document.querySelectorAll('.absolute:not(.particle)');
    gsap.to(orbs, {
      scale: 0.8,
      opacity: 0,
      duration: 0.9,
      stagger: 0.03,
      ease: 'power2.inOut'
    });
    
    // Button animation sequence
    if (buttonRef.current) {
      // Pulse the button
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        onComplete: () => {
          // Shrink and fade the button with smoother transition
          gsap.to(buttonRef.current, {
            scale: 0.05,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.inOut'
          });
        }
      });
    }
    
    // Animate content text with staggered fade
    if (contentRef.current) {
      const title = contentRef.current.querySelector('h1');
      const subtitle = contentRef.current.querySelector('p:first-of-type');
      const footerText = contentRef.current.querySelector('p:last-of-type');
      const ctaButton = contentRef.current.querySelector('button');
      
      gsap.to([title, subtitle, footerText, ctaButton], {
        opacity: 0,
        y: -20,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.out'
      });
    }
    
    // Container animation with smoother transition
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 0.95,
        opacity: 0.2,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          // Create enhanced tunnel effect
          createEnhancedTunnelEffect();
        }
      });
    }
  };
  
  const createParticleExplosion = () => {
    // Create additional visual effects
    const explosionContainer = document.createElement('div');
    explosionContainer.className = 'absolute inset-0 overflow-hidden pointer-events-none';
    explosionContainer.style.zIndex = '100';
    document.body.appendChild(explosionContainer);
    
    // Create explosion particles with more variation
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#8243cc' : '#ff7a00';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.opacity = '0';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.boxShadow = `0 0 ${size}px ${i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#8243cc' : '#ff7a00'}`;
      explosionContainer.appendChild(particle);
      
      // Animate each particle with keyframes using GSAP's keyframes
      gsap.to(particle, {
        duration: 1,
        keyframes: [
          { x: 0, y: 0, opacity: 0, scale: 0 },
          { x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 300, opacity: 0.7, scale: 1, ease: 'power2.out' },
          { x: (Math.random() - 0.5) * 600, y: (Math.random() - 0.5) * 600, opacity: 0, scale: 0, ease: 'power2.in' }
        ]
      });
    }
    
    // Remove container after animation
    setTimeout(() => {
      explosionContainer.remove();
    }, 1200);
  };
  
  const createEnhancedTunnelEffect = () => {
    // Create multiple tunnel layers for depth effect
    const tunnelLayers = [];
    for (let i = 0; i < 4; i++) {
      const tunnel = document.createElement('div');
      tunnel.className = 'fixed inset-0 z-50 pointer-events-none';
      tunnel.style.background = `radial-gradient(circle, rgba(13,13,13,0) ${60 + i * 5}%, rgba(13,13,13,${0.4 + i * 0.1}) 100%)`;
      tunnel.style.opacity = '0';
      tunnel.style.transform = `scale(${1 + i * 0.1})`;
      document.body.appendChild(tunnel);
      tunnelLayers.push(tunnel);
    }
    
    // Animate tunnel layers with staggered timing
    tunnelLayers.forEach((tunnel, index) => {
      gsap.to(tunnel, {
        duration: 1.2,
        delay: index * 0.08,
        keyframes: [
          { opacity: 0, scale: 1 + index * 0.1 },
          { opacity: 0.7, scale: 1.1 + index * 0.2, ease: 'power2.out' },
          { opacity: 0, scale: 1.3 + index * 0.2, ease: 'power2.in' }
        ]
      });
    });
    
    // Navigate to chat session with enhanced blackout effect
    setTimeout(() => {
      // Create a more dramatic blackout transition
      const blackoutOverlay = document.createElement('div');
      blackoutOverlay.id = 'blackout-overlay';
      blackoutOverlay.className = 'fixed inset-0 z-[1000] bg-black pointer-events-none';
      blackoutOverlay.style.opacity = '0';
      document.body.appendChild(blackoutOverlay);
      
      // Animate the blackout with a smooth build-up
      gsap.to(blackoutOverlay, {
        duration: 1,
        keyframes: [
          { opacity: 0 },
          { opacity: 0.2, ease: 'power1.out' },
          { opacity: 0.6, ease: 'power2.out' },
          { opacity: 1, ease: 'power3.inOut' }
        ],
        onComplete: () => {
          // Add a subtle pulse effect before navigation
          setTimeout(() => {
            gsap.to(blackoutOverlay, {
              duration: 0.2,
              keyframes: [
                { opacity: 1 },
                { opacity: 0.95 },
                { opacity: 1 }
              ],
              onComplete: () => {
                window.location.href = '/chat-session';
              }
            });
          }, 80);
        }
      });
    }, 600);
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
      
      {/* Glowing orbs with subtle pulsing */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      
      {/* Main content with smooth fade-in animation */}
      <div 
        ref={contentRef}
        className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center opacity-0"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Chat Beyond Limits — Real-time Conversations.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Step into a real-time chat experience with seamless communication.
          Connect with others instantly and effortlessly.
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
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500/30">
                        {/* Using a simple animated circle instead of image for loader */}
                        <div className="w-full h-full rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-ping"></div>
                    </div>
                    <span>Initializing Chat Interface...</span>
                  </div>
                </div>
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
          Step into the future of conversations — where people connect instantly.
        </p>
      </div>
    </div>
  );
}