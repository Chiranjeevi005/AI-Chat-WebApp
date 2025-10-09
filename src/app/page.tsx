'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  const helloRef = useRef(null);

  useEffect(() => {
    // Animate the "Hello World" message on page load
    if (helloRef.current) {
      gsap.fromTo(
        helloRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 
          ref={helloRef} 
          className="text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Hello World
        </h1>
        <p className="text-lg leading-8 text-gray-600 max-w-xl text-center">
          Welcome to the AI Chat App with Next.js, TailwindCSS, and GSAP animations
        </p>
      </main>
    </div>
  );
}
