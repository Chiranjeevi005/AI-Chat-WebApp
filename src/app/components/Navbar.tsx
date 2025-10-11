'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Animate navbar on load
    gsap.fromTo(
      '.navbar-item',
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-1.5 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/90 backdrop-blur-md border-b border-cyan-500/20' : 'py-3 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="navbar-item flex items-center">
            <div className="w-10 h-10 rounded-full mr-2">
              <Image src="/assets/logo.png" alt="AI Chat Logo" width={40} height={40} className="rounded-full" />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI Chat</span>
          </div>

          {/* Desktop Navigation - removed all items as requested */}
          <div className="navbar-item hidden md:flex space-x-8">
            {/* Navigation items removed as per request */}
          </div>

          {/* Auth Buttons - removed Sign In, keeping Get Started with theme colors */}
          <div className="navbar-item hidden md:flex space-x-3">
            {/* Sign In removed as per request */}
            <Link
              href="/signup"
              className="px-5 py-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-full hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="navbar-item md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-cyan-300 hover:text-purple-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - removed all items as requested */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 py-2 border-t border-cyan-500/20">
            <div className="flex flex-col space-y-2">
              {/* Navigation items removed as per request */}
              <div className="flex flex-col space-y-2 pt-2 border-t border-cyan-500/10">
                {/* Sign In removed as per request */}
                <Link
                  href="/signup"
                  className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-full hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 text-center shadow-lg text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}