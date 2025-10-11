'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Simple, reliable logo implementation focusing only on the texture
function SimpleTexturedLogo() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load your actual logo texture
  const logoTexture = useTexture('/assets/logo.png');
  
  useFrame((state) => {
    if (meshRef.current) {
      // Very subtle animation focused only on the logo itself
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
      meshRef.current.scale.setScalar(scale);
      
      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        map={logoTexture}
        transparent={true}
        opacity={0.95}
      />
    </mesh>
  );
}

// Minimal, reliable implementation
export default function ThreeDLogo({ size = 300 }: { size?: number }) {
  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <img 
        src="/assets/HeroImage.png" 
        alt="AI Chat 3D Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
