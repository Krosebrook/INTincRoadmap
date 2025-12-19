
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sphere, Stars, Environment, Text, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

const NODE_GEOMETRY = new THREE.IcosahedronGeometry(0.4, 0);

/**
 * DataNode Component
 * 
 * Represents an architectural hub in 3D space.
 * Features complex idle animations combining manual frame updates, 
 * Float component physics, and vertex distortion.
 */
const DataNode: React.FC<{ position: [number, number, number]; color: string; label?: string; delay?: number }> = ({ position, color, label, delay = 0 }) => {
  const ref = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    
    // Primary oscillation - Frequency increased for more dynamic presence
    ref.current.position.y = position[1] + Math.sin(t * 1.5 + delay) * 0.25;
    
    // Rotational sway - Frequency and range increased for more dynamic presence
    ref.current.rotation.x = Math.sin(t * 0.8 + delay) * 0.35;
    ref.current.rotation.z = Math.cos(t * 0.6 + delay) * 0.25;

    // Breathing light effect
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(t * 2 + delay) * 1.5;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Physics-based floating - Speed and intensities boosted */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.2}>
        <mesh geometry={NODE_GEOMETRY}>
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.02}
            metalness={0.98}
            distort={0.4}
            speed={4}
          />
        </mesh>
        
        {/* Outer orbital shell */}
        <Sphere args={[0.6, 24, 24]}>
          <meshStandardMaterial 
            color={color} 
            wireframe 
            transparent 
            opacity={0.15} 
            metalness={1}
            roughness={0}
          />
        </Sphere>
        
        <pointLight ref={lightRef} distance={4} intensity={3} color={color} />
      </Float>

      {label && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.22}
          color={color}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          anchorX="center"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const BackgroundAtmosphere: React.FC = () => {
  const lines = useMemo(() => Array.from({ length: 20 }, () => ({
    start: [Math.random() * 14 - 7, Math.random() * 10 - 5, Math.random() * 6 - 3] as [number, number, number],
    end: [Math.random() * 14 - 7, Math.random() * 10 - 5, Math.random() * 6 - 3] as [number, number, number]
  })), []);

  return (
    <group>
      <Sparkles count={50} scale={15} size={2} speed={0.3} opacity={0.3} color="#C5A059" />
      {lines.map((line, i) => (
        <Line key={i} points={[line.start, line.end]} color="#C5A059" lineWidth={0.5} transparent opacity={0.05} />
      ))}
    </group>
  );
};

const SceneContent: React.FC<{ scrollYProgress?: MotionValue<number> }> = ({ scrollYProgress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const scroll = scrollYProgress?.get() ?? 0;
    
    // Decoupled parallax animation
    const targetRotY = -scroll * Math.PI * 0.4;
    const targetPosZ = -scroll * 6;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosZ, 0.08);
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <DataNode position={[0, 1.8, 0]} color="#C5A059" label="CORE HUB" delay={0} />
      <DataNode position={[-4, -0.8, 1.5]} color="#3B82F6" label="CRM EDGE" delay={1.2} />
      <DataNode position={[4, -0.8, 1.5]} color="#10B981" label="PSA OPS" delay={2.4} />
      
      <Line points={[[0, 1.8, 0], [-4, -0.8, 1.5]]} color="#a8a29e" lineWidth={0.8} transparent opacity={0.12} dashed dashScale={15} />
      <Line points={[[0, 1.8, 0], [4, -0.8, 1.5]]} color="#a8a29e" lineWidth={0.8} transparent opacity={0.12} dashed dashScale={15} />
      <Line points={[[-4, -0.8, 1.5], [4, -0.8, 1.5]]} color="#a8a29e" lineWidth={0.8} transparent opacity={0.12} dashed dashScale={15} />

      <BackgroundAtmosphere />
    </group>
  );
};

export const HeroScene: React.FC<{ scrollYProgress?: MotionValue<number> }> = ({ scrollYProgress }) => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <Canvas camera={{ position: [0, 0, 10], fov: 40 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} color="#C5A059" />
      <pointLight position={[-10, -5, -5]} intensity={1} color="#3B82F6" />
      <SceneContent scrollYProgress={scrollYProgress} />
      <Environment preset="night" blur={0.7} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  </div>
);

export const QuantumComputerScene: React.FC = () => (
  <div className="w-full h-full absolute inset-0">
    <Canvas camera={{ position: [5, 5, 5], fov: 35 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#C5A059" />
      <Float rotationIntensity={0.2} floatIntensity={0.2} speed={2}>
        {[0, 1, 2, 3].map((l) => (
          <group key={l} position={[0, l * 0.9 - 1.4, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[3.5, 3.5, 0.08]} />
              <meshStandardMaterial color={l === 3 ? "#C5A059" : "#1c1917"} transparent opacity={0.9} metalness={0.7} roughness={0.1} />
            </mesh>
            <Sphere args={[0.05]} position={[Math.sin(l), 0.5, Math.cos(l)]}>
              <meshBasicMaterial color="#3B82F6" />
            </Sphere>
          </group>
        ))}
      </Float>
      <Environment preset="studio" />
    </Canvas>
  </div>
);
