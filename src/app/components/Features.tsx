'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Card entrance animations
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
          },
          delay: index * 0.2
        }
      );
    });

    // Hover animations
    cardsRef.current.forEach(card => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -10,
          rotationX: 5,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          rotationX: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup
      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    // Image animations
    if (image1Ref.current) {
      gsap.fromTo(
        image1Ref.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
          scrollTrigger: {
            trigger: image1Ref.current,
            start: 'top 80%',
          }
        }
      );
    }
    
    if (image2Ref.current) {
      gsap.fromTo(
        image2Ref.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
          scrollTrigger: {
            trigger: image2Ref.current,
            start: 'top 80%',
          }
        }
      );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      title: "Real-time Chat",
      description: "Experience seamless communication with zero latency messaging powered by WebSockets.",
      icon: (
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <Image src="/assets/logo.png" alt="Real-time Chat" width={64} height={64} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      title: "Military-grade Security",
      description: "End-to-end encryption ensures your conversations remain private and secure.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Custom Rooms",
      description: "Create personalized chat rooms with custom themes and access controls.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Interactive UI",
      description: "Immersive interface with 3D elements, smooth animations, and intuitive controls.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    }
  ];

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-15 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-15 animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
            Revolutionary Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with intuitive design to deliver an unparalleled communication experience.
          </p>
        </div>

        {/* Feature Showcase with Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image Showcase 1 */}
          <div 
            ref={image1Ref}
            className="rounded-3xl overflow-hidden border border-gray-700 shadow-2xl relative h-[500px] group"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: "url('/assets/LandingPageImg1.png')"
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#1A1A1A]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Immersive Interface</h3>
              <p className="text-cyan-200">Experience our cutting-edge UI with 3D elements and smooth animations</p>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.slice(0, 2).map((feature, index) => (
              <div
                key={index}
                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                className="glass rounded-2xl p-6 transform transition-all duration-300 hover:border-cyan-500 hover:glow-cyan group relative overflow-hidden h-full"
              >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10 text-cyan-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{feature.title}</h3>
                <p className="text-gray-300 text-sm relative z-10">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Second Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 order-2 lg:order-1">
            {features.slice(2, 4).map((feature, index) => (
              <div
                key={index + 2}
                ref={(el) => { if (el) cardsRef.current[index + 2] = el; }}
                className="glass rounded-2xl p-6 transform transition-all duration-300 hover:border-cyan-500 hover:glow-cyan group relative overflow-hidden h-full"
              >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10 text-cyan-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{feature.title}</h3>
                <p className="text-gray-300 text-sm relative z-10">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* Image Showcase 2 */}
          <div 
            ref={image2Ref}
            className="rounded-3xl overflow-hidden border border-gray-700 shadow-2xl relative h-[500px] group order-1 lg:order-2"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: "url('/assets/LandingPageImg2.png')"
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#1A1A1A]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Seamless Experience</h3>
              <p className="text-cyan-200">Intuitive design that enhances productivity and collaboration</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}