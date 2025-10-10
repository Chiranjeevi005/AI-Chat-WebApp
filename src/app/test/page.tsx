'use client';

import ThreeDLogo from '../components/ThreeDLogo';
import { useState } from 'react';

export default function TestPage() {
  const [show3D, setShow3D] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 text-center gradient-text">
          Component Testing Page
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3D Logo Test */}
          <div className="glass rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">3D Logo Component</h2>
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 mb-6">
                {show3D ? <ThreeDLogo /> : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-xl">
                    <p className="text-gray-400">3D Logo Hidden</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShow3D(!show3D)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 glow-cyan"
              >
                {show3D ? 'Hide 3D Logo' : 'Show 3D Logo'}
              </button>
            </div>
          </div>
          
          {/* Animation Test */}
          <div className="glass rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Animation Tests</h2>
            <div className="space-y-6">
              <div className="p-4 glass rounded-xl border border-cyan-500 glow-cyan">
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">Glow Effect</h3>
                <p className="text-gray-300">This card has a cyan glow effect applied.</p>
              </div>
              
              <div className="p-4 glass rounded-xl border border-violet-500 glow-violet">
                <h3 className="text-lg font-semibold text-violet-300 mb-2">Violet Glow</h3>
                <p className="text-gray-300">This card has a violet glow effect applied.</p>
              </div>
              
              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-float"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-float-delay"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 animate-float-delay-2"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gradient Text Test */}
        <div className="mt-12 glass rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Gradient Text</h2>
          <p className="text-3xl gradient-text font-bold">
            This is a sample of gradient text styling
          </p>
        </div>
      </div>
    </div>
  );
}