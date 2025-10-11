'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Simplified 3D logo component with proper orange theme
function Enhanced3DLogo() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Continuous rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    
    if (meshRef.current) {
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
      meshRef.current.scale.setScalar(hovered ? scale * 1.1 : scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main logo sphere with orange gradient */}
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial
          color={hovered ? "#FF8C42" : "#FF7A00"}
          roughness={0.1}
          metalness={0.9}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          emissive={hovered ? "#FF8C42" : "#FF7A00"}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.4, 64]} />
        <meshBasicMaterial 
          color={hovered ? "#FF8C42" : "#FF7A00"} 
          transparent={true} 
          opacity={0.4}
        />
      </mesh>
      
      {/* Particle effects in orange theme */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 2 + Math.random() * 0.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.5;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial 
              color="#FF7A00"
              transparent={true}
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ThreeDLogo({ size = 300 }: { size?: number }) {
  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FF7A00" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FF8C42" />
        
        <Enhanced3DLogo />
        
        <Environment preset="city" />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}