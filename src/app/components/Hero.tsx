'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import ThreeDLogo to avoid SSR issues
const ThreeDLogo = dynamic(() => import('./ThreeDLogo'), { ssr: false });

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations
    if (titleRef.current && subtitleRef.current && ctaRef.current && logoRef.current) {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2
        }
      );

      // Animate subtitle
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.5
        }
      );

      // Animate CTA buttons
      gsap.fromTo(
        ctaRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.8
        }
      );

      // Animate logo container
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
          delay: 1
        }
      );

      // Continuous floating animation for logo container
      gsap.to(logoRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }

    // Parallax effect on scroll
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          scrub: 1.5
        }
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-violet-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 hero-content">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left hero-text">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight hero-title"
            >
              <span className="block gradient-text">Where Human Imagination</span>
              <span className="block gradient-text">Meets AI Conversation</span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl hero-subtitle"
            >
              Step into a new era of communication — a real-time chat experience powered by intelligent AI, crafted for teams that design, build, and innovate together.
            </p>
            
            <div 
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link 
                href="/chat" 
                className="cta-button px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 glow-cyan shadow-lg"
              >
                Start Chatting Now
              </Link>
              <Link 
                href="#demo" 
                className="cta-button px-8 py-4 bg-transparent border-2 border-violet-500 text-violet-300 font-semibold rounded-full hover:bg-violet-500 hover:text-white transition-all duration-300 transform hover:scale-105 glow-violet"
              >
                Watch Demo
              </Link>
            </div>
          </div>
          
          {/* Enhanced 3D Logo */}
          <div 
            ref={logoRef}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden">
              <ThreeDLogo size={384} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}