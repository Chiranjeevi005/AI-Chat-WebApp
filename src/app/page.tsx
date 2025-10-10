'use client';

import Hero from './components/Hero';
import Features from './components/Features';
import ChatPreview from './components/ChatPreview';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <ChatPreview />
      <Footer />
    </div>
  );
}
