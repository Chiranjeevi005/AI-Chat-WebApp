'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Animate title and subtitle
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          delay: 0.5,
          ease: 'power3.out'
        }
      );
    }
    
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          delay: 0.8,
          ease: 'power3.out'
        }
      );
    }
    
    // Animate CTA buttons
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          delay: 1.2,
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

  return (
    <section 
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/HeroImage.png')"
        }}
      ></div>
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D]/80 to-[#1A1A1A]/80"></div>
      
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
      
      {/* Radial glows */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
        {/* Title and Subtitle */}
        <div className="mb-12">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6"
          >
            AI-Powered Communication
          </h1>
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-cyan-200/90 max-w-2xl mx-auto"
          >
            Experience the future of collaboration with intelligent real-time messaging
          </p>
        </div>

        {/* CTA Buttons */}
        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-6"
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
      </div>
    </section>
  );
}