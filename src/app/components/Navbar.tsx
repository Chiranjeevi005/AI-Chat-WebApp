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

  // Removed navItems array since we're removing all these items

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-gray-900 bg-opacity-90 backdrop-blur-md' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="navbar-item flex items-center">
            <div className="w-12 h-12 rounded-full mr-3">
              <Image src="/assets/logo.png" alt="AI Chat Logo" width={48} height={48} className="rounded-full" />
            </div>
            <span className="text-2xl font-bold text-white">AI Chat</span>
          </div>

          {/* Desktop Navigation - removed all items as requested */}
          <div className="navbar-item hidden md:flex space-x-10">
            {/* Navigation items removed as per request */}
          </div>

          {/* Auth Buttons - removed Sign In, keeping Get Started */}
          <div className="navbar-item hidden md:flex space-x-4">
            {/* Sign In removed as per request */}
            <Link
              href="/signup"
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 glow-cyan"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="navbar-item md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - removed all items as requested */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              {/* Navigation items removed as per request */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-800">
                {/* Sign In removed as per request */}
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 glow-cyan text-center"
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