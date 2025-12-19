
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sphere, Stars, Environment, Text, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

// Optimized static geometry
const NODE_GEOM = new THREE.IcosahedronGeometry(0.4, 0);
const SHELL_GEOM = new THREE.SphereGeometry(0.65, 32, 32);

/**
 * DataNode Component
 * 
 * Represents an architectural hub in 3D space.
 */
const DataNode: React.FC<{ 
  position: [number, number, number]; 
  color: string; 
  label?: string; 
  delay?: number 
}> = ({ position, color, label, delay = 0 }) => {
  const ref = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const emissiveColor = useMemo(() => new THREE.Color(color), [color]);
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    
    // Primary oscillation
    ref.current.position.y = position[1] + Math.sin(t * 1.2 + delay) * 0.15;
    
    // Rotational sway
    ref.current.rotation.x = Math.sin(t * 0.6 + delay) * 0.2;
    ref.current.rotation.z = Math.cos(t * 0.4 + delay) * 0.15;

    // Breathing light effect
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(t * 1.5 + delay) * 1;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Float speed={2} rotationIntensity={1} floatIntensity={0.8}>
        <mesh geometry={NODE_GEOM}>
          <MeshDistortMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={0.8}
            roughness={0.05}
            metalness={1}
            distort={0.45}
            speed={3}
          />
        </mesh>
        
        <mesh geometry={SHELL_GEOM}>
          <meshStandardMaterial 
            color={color} 
            wireframe 
            transparent 
            opacity={0.12} 
            metalness={1}
            roughness={0}
          />
        </mesh>
        
        <pointLight ref={lightRef} distance={5} intensity={3} color={color} />
      </Float>

      {label && (
        <Text
          position={[0, 1.4, 0]}
          fontSize={0.25}
          color={color}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          anchorX="center"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const AtmosphericEffects: React.FC = () => {
  const lines = useMemo(() => Array.from({ length: 24 }, () => ({
    start: [Math.random() * 16 - 8, Math.random() * 12 - 6, Math.random() * 8 - 4] as [number, number, number],
    end: [Math.random() * 16 - 8, Math.random() * 12 - 6, Math.random() * 8 - 4] as [number, number, number]
  })), []);

  return (
    <group>
      <Sparkles count={60} scale={18} size={2.5} speed={0.25} opacity={0.4} color="#C5A059" />
      {lines.map((line, i) => (
        <Line key={i} points={[line.start, line.end]} color="#C5A059" lineWidth={0.4} transparent opacity={0.04} />
      ))}
    </group>
  );
};

const HeroSceneContent: React.FC<{ scrollYProgress?: MotionValue<number> }> = ({ scrollYProgress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const scroll = scrollYProgress?.get() ?? 0;
    
    const targetRotY = -scroll * Math.PI * 0.5;
    const targetPosZ = -scroll * 8;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosZ, 0.05);
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <DataNode position={[0, 2, 0]} color="#C5A059" label="FEDERATED CORE" delay={0} />
      <DataNode position={[-5, -1, 2]} color="#3B82F6" label="CRM" delay={1} />
      <DataNode position={[5, -1, 2]} color="#10B981" label="PSA" delay={2} />
      <DataNode position={[0, -2, -3]} color="#7C3AED" label="HRIS" delay={3} />
      
      {/* Dynamic connection paths */}
      <Line points={[[0, 2, 0], [-5, -1, 2]]} color="#C5A059" lineWidth={0.6} transparent opacity={0.15} dashed dashScale={12} />
      <Line points={[[0, 2, 0], [5, -1, 2]]} color="#C5A059" lineWidth={0.6} transparent opacity={0.15} dashed dashScale={12} />
      <Line points={[[-5, -1, 2], [5, -1, 2]]} color="#a8a29e" lineWidth={0.4} transparent opacity={0.1} dashed dashScale={12} />

      <AtmosphericEffects />
    </group>
  );
};

export const HeroScene: React.FC<{ scrollYProgress?: MotionValue<number> }> = ({ scrollYProgress }) => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <Canvas camera={{ position: [0, 0, 12], fov: 38 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.25} />
      <spotLight position={[15, 15, 15]} angle={0.25} penumbra={1} intensity={2.5} color="#C5A059" />
      <pointLight position={[-15, -10, -5]} intensity={1.5} color="#3B82F6" />
      <HeroSceneContent scrollYProgress={scrollYProgress} />
      <Environment preset="city" blur={0.8} />
      <Stars radius={120} depth={60} count={6000} factor={4.5} saturation={0} fade speed={1.2} />
    </Canvas>
  </div>
);

export const QuantumComputerScene: React.FC = () => (
  <div className="w-full h-full absolute inset-0">
    <Canvas camera={{ position: [6, 4, 6], fov: 32 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[12, 12, 12]} intensity={2} color="#C5A059" />
      <Float rotationIntensity={0.15} floatIntensity={0.15} speed={1.5}>
        {[0, 1, 2, 3, 4].map((l) => (
          <group key={l} position={[0, l * 0.8 - 1.6, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[4, 4, 0.05]} />
              <meshStandardMaterial 
                color={l === 4 ? "#C5A059" : "#1c1917"} 
                transparent 
                opacity={0.85} 
                metalness={0.8} 
                roughness={0.15} 
              />
            </mesh>
            <Sphere args={[0.045]} position={[Math.sin(l * 1.5), 0.4, Math.cos(l * 1.5)]}>
              <meshBasicMaterial color="#3B82F6" />
            </Sphere>
          </group>
        ))}
      </Float>
      <Environment preset="night" />
    </Canvas>
  </div>
);
