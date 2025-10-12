'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

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
    
    // Animate highlight word
    if (highlightRef.current) {
      gsap.fromTo(highlightRef.current,
        { backgroundPosition: '0% 50%' },
        {
          backgroundPosition: '100% 50%',
          duration: 2,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: 1
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
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Primary background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/HeroImage.png')"
        }}
      ></div>
      
      {/* Enhanced overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D]/90 via-[#1A1A1A]/80 to-[#0D0D0D]/90"></div>
      
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
      
      {/* Enhanced radial glows */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-[20rem] h-[20rem] bg-violet-500/25 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-6xl w-full">
        {/* Refined Title and Subtitle */}
        <div className="text-center mb-16">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight tracking-tight"
          >
            Redefining Digital
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-violet-600">
              Communication
            </span>
          </h1>
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Experience the future of collaboration with <span ref={highlightRef} className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-medium">intelligent</span> real-time messaging
          </p>
        </div>

        {/* Enhanced CTA Section */}
        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link 
            href="/chat" 
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center group border border-cyan-500/30 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center">
              Start Chatting
              <svg 
                className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </Link>
          <Link 
            href="#demo" 
            className="px-8 py-4 bg-transparent text-gray-200 font-bold text-lg rounded-xl hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-center border border-gray-700 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center">
              View Demo
              <svg 
                className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}