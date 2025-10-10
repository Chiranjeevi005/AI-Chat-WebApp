'use client';

import ThreeDLogo from '../components/ThreeDLogo';

export default function LogoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8">
      <h1 className="text-4xl font-bold text-white mb-12 gradient-text">3D Logo Showcase</h1>
      <div className="w-64 h-64 md:w-80 md:h-80">
        <ThreeDLogo />
      </div>
      <p className="text-gray-400 mt-8 text-center max-w-2xl">
        This interactive 3D logo is built with React Three Fiber and Three.js. 
        It features a torus knot geometry with metallic materials that respond to light, 
        creating a futuristic and dynamic visual element.
      </p>
    </div>
  );
}