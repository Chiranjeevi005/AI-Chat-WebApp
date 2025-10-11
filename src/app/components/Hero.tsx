'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const panel4Ref = useRef<HTMLDivElement>(null);
  const panel5Ref = useRef<HTMLDivElement>(null);
  const panel6Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the main cube
    if (cubeRef.current) {
      // Floating animation
      gsap.to(cubeRef.current, {
        y: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      // Gentle rotation
      gsap.to(cubeRef.current, {
        rotationY: 15,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
    
    // Animate text panels with staggered fade-in
    const panelRefs = [panel1Ref, panel2Ref, panel3Ref, panel4Ref, panel5Ref, panel6Ref];
    panelRefs.forEach((panelRef, index) => {
      if (panelRef.current) {
        gsap.fromTo(panelRef.current,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            delay: index * 0.25,
            ease: 'power3.out'
          }
        );
        
        // Subtle floating animation after entrance
        gsap.to(panelRef.current, {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2 + index * 0.15
        });
      }
    });
    
    // Animate CTA buttons
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          delay: 1.8,
          ease: 'back.out(1.7)'
        }
      );
    }
    
    // Ambient particle effects
    const particles = document.querySelectorAll('.particle');
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
  }, []);

  // Text panel content
  const panels = [
    { position: 'top-24 left-24', text: 'Collaborate in real-time with AI-enhanced creativity', color: 'text-cyan-400', ref: panel1Ref },
    { position: 'top-24 right-24', text: 'Automate workflows and boost team productivity', color: 'text-purple-400', ref: panel2Ref },
    { position: 'left-24 top-1/2', text: 'Instant chat insights and smart suggestions', color: 'text-cyan-300', ref: panel3Ref },
    { position: 'right-24 top-1/2', text: 'Secure rooms, privacy-first design, and team sync', color: 'text-purple-300', ref: panel4Ref },
    { position: 'bottom-24 left-24', text: 'Integrate effortlessly with your workflow', color: 'text-cyan-200', ref: panel5Ref },
    { position: 'bottom-24 right-24', text: 'AI-powered collaboration for next-gen teams', color: 'text-purple-200', ref: panel6Ref }
  ];

  // Hero highlight text ideas
  const heroHighlights = [
    'Where Human Creativity Meets AI Precision',
    'Real-time Collaboration, Smarter Decisions',
    'Design Teams Powered by Intelligent Chat'
  ];

  // Deterministic particle positions to avoid hydration errors
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

  return (
    <section 
      ref={heroRef}
      className="relative w-full min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] overflow-hidden"
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particlePositions.map((pos, i) => (
          <div 
            key={i}
            className="particle absolute rounded-full bg-gradient-to-r from-cyan-400/40 to-purple-500/40"
            style={{
              width: `${pos.width}px`,
              height: `${pos.height}px`,
              top: `${pos.top}%`,
              left: `${pos.left}%`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Data streams */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
            style={{
              top: `${10 + i * 12}%`,
              width: '100%',
              animation: `flowHorizontal ${25 + i * 4}s linear infinite`,
              animationDelay: `${i * 1.5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Radial glows */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Center Cube - Enlarged for visual appeal */}
      <div className="absolute inset-0 flex justify-center items-center z-10">
        <div 
          ref={cubeRef}
          className="relative w-80 h-80 md:w-[32rem] md:h-[32rem] flex items-center justify-center"
        >
          <img 
            src="/assets/HeroImage.png" 
            alt="AI Cube" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-purple-500/40 rounded-3xl blur-3xl animate-pulse"></div>
          
          {/* Reflection base */}
          <div className="absolute -bottom-12 w-64 h-12 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Fixed Holographic Panels - Repositioned for better spacing */}
      {panels.map((panel, index) => (
        <div 
          key={index}
          ref={panel.ref}
          className={`absolute ${panel.position} ${panel.color} z-20 max-w-xs text-base md:text-lg font-medium`}
          style={{
            textShadow: '0 0 10px currentColor',
            filter: 'drop-shadow(0 0 3px rgba(56, 189, 248, 0.6))'
          }}
        >
          {panel.text}
        </div>
      ))}

      {/* Hero Highlight Text */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center px-4">
          {heroHighlights[0]}
        </h1>
      </div>

      {/* CTA Buttons */}
      <div 
        ref={ctaRef}
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row gap-6 z-20"
      >
        <Link 
          href="/chat" 
          className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-white font-bold text-lg shadow-2xl hover:scale-105 transition-transform flex items-center justify-center"
          style={{
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.7)'
          }}
        >
          Start Chatting Now →
        </Link>
        <Link 
          href="#demo" 
          className="px-10 py-5 border-2 border-cyan-400/60 text-cyan-300 rounded-2xl hover:bg-cyan-400/15 transition-all flex items-center justify-center text-lg font-bold"
        >
          Watch Demo →
        </Link>
      </div>
      
      <style jsx global>{`
        @keyframes flowHorizontal {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }
      `}</style>
    </section>
  );
}