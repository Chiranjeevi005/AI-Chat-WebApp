'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedTorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate continuously
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Pulsing effect on hover
      if (hovered) {
        meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
        meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
        meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
      }
    }
  });

  return (
    <TorusKnot
      ref={meshRef}
      args={[1, 0.3, 128, 32]} // radius, tube, tubularSegments, radialSegments
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={hovered ? '#90caf9' : '#4fc3f7'}
        emissive={hovered ? '#01579b' : '#0277bd'}
        roughness={0.1}
        metalness={0.9}
      />
    </TorusKnot>
  );
}

export default function ThreeDLogo({ size = 300 }: { size?: number }) {
  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{ height: size, width: size }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7e57c2" />
        <AnimatedTorusKnot />
        <Environment preset="night" />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}