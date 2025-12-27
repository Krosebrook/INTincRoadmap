
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Stars, Environment, Text, MeshDistortMaterial, Sparkles, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue, useTransform, useMotionValue } from 'framer-motion';

const NODE_GEOM = new THREE.IcosahedronGeometry(0.4, 0);
const SHELL_GEOM = new THREE.SphereGeometry(0.65, 32, 32);

const DataNode: React.FC<{ 
  position: [number, number, number]; 
  color: string; 
  label?: string; 
  delay?: number;
  scale?: number;
}> = ({ position, color, label, delay = 0, scale = 1 }) => {
  const ref = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const emissiveColor = useMemo(() => new THREE.Color(color), [color]);
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 1.4 + delay) * 0.15;
    ref.current.rotation.y = t * 0.2 + delay;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    if (lightRef.current) {
      lightRef.current.intensity = 3.0 + Math.sin(t * 2.5 + delay) * 1.5;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh geometry={NODE_GEOM}>
          <MeshDistortMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={1.8}
            roughness={0.1}
            metalness={1}
            distort={0.45}
            speed={4}
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
        <pointLight ref={lightRef} distance={8} intensity={3} color={color} />
      </Float>
      {label && (
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.28}
          color={color}
          font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K_rwGaPaDdkoZCcBDVGmDTVMDxdR-P-v0.woff"
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

const HeroSceneContent: React.FC<{ scrollYProgress?: MotionValue<number> }> = ({ scrollYProgress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const satellitesRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  const scrollVal = scrollYProgress || useMotionValue(0);

  // Cinematic camera and world transforms
  const rotationY = useTransform(scrollVal, [0, 0.5, 1], [0, -Math.PI * 0.8, -Math.PI * 2]);
  const rotationX = useTransform(scrollVal, [0, 1], [0, Math.PI * 0.25]);
  const positionZ = useTransform(scrollVal, [0, 0.4, 1], [0, -10, -35]);
  const driftY = useTransform(scrollVal, [0, 1], [0, 12]);
  const spreadScale = useTransform(scrollVal, [0, 0.6, 1], [1, 2.2, 3.5]);
  const gridOpacity = useTransform(scrollVal, [0, 0.5], [0.3, 0]);

  useFrame((state) => {
    if (!groupRef.current || !satellitesRef.current || !gridRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smooth lerping for cinematic feel
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotationY.get(), 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotationX.get(), 0.04);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, positionZ.get(), 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, driftY.get(), 0.04);
    
    const targetScale = spreadScale.get();
    satellitesRef.current.scale.setScalar(THREE.MathUtils.lerp(satellitesRef.current.scale.x, targetScale, 0.04));
    
    // Subtle ambient rotation
    satellitesRef.current.rotation.y = t * 0.05;
    
    // Grid interaction
    gridRef.current.position.y = -10 + Math.sin(t * 0.2) * 2;
  });

  return (
    <group ref={groupRef}>
      {/* Background Depth Grid */}
      <group ref={gridRef} rotation={[-Math.PI / 2.2, 0, 0]}>
        <Grid 
          infiniteGrid 
          fadeDistance={50} 
          fadeStrength={5} 
          cellSize={1} 
          sectionSize={5} 
          sectionColor="#FF6B6B" 
          cellColor="#2563EB" 
          sectionThickness={1.5}
        />
      </group>

      {/* Primary Transit Hub Core (n8n) */}
      <DataNode position={[0, 3, 0]} color="#FF6B6B" label="n8n METRO" delay={0} scale={1.8} />
      
      {/* 7 Federated Satellite Domains */}
      <group ref={satellitesRef}>
        <DataNode position={[-8, -2, 5]} color="#4F46E5" label="DEV" delay={1} />
        <DataNode position={[8, -2, 5]} color="#2563EB" label="DATA" delay={2} />
        <DataNode position={[0, -10, -6]} color="#10B981" label="AI" delay={3} />
        <DataNode position={[-10, 5, -10]} color="#E11D48" label="OPS" delay={4} />
        <DataNode position={[10, 5, -10]} color="#D97706" label="GROWTH" delay={5} />
        <DataNode position={[-5, -12, 0]} color="#7C3AED" label="COMMERCE" delay={6} />
        <DataNode position={[5, -12, 0]} color="#0D9488" label="COLLAB" delay={7} />
        
        {/* Dynamic Orbital Connectors */}
        <Line points={[[0, 3, 0], [-8, -2, 5]]} color="#FF6B6B" lineWidth={1.5} transparent opacity={0.2} />
        <Line points={[[0, 3, 0], [8, -2, 5]]} color="#FF6B6B" lineWidth={1.5} transparent opacity={0.2} />
        <Line points={[[0, 3, 0], [0, -10, -6]]} color="#FF6B6B" lineWidth={1.5} transparent opacity={0.2} />
      </group>

      <Sparkles count={250} scale={40} size={4} speed={0.6} opacity={0.4} color="#FF6B6B" />
      <Sparkles count={150} scale={60} size={2} speed={0.3} opacity={0.2} color="#2563EB" />
    </group>
  );
};

export const HeroScene: React.FC<{ scrollYProgress?: MotionValue<number> }> = ({ scrollYProgress }) => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <Canvas camera={{ position: [0, 0, 18], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <spotLight position={[30, 30, 30]} angle={0.25} penumbra={1} intensity={4} color="#FF6B6B" />
      <pointLight position={[-20, -20, -20]} intensity={1} color="#2563EB" />
      <HeroSceneContent scrollYProgress={scrollYProgress} />
      <Environment preset="night" />
      <Stars radius={200} depth={100} count={12000} factor={8} saturation={0.5} fade speed={1.5} />
    </Canvas>
  </div>
);

export const QuantumComputerScene: React.FC = () => (
  <div className="w-full h-full absolute inset-0">
    <Canvas camera={{ position: [8, 5, 8], fov: 35 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[15, 15, 15]} intensity={2.5} color="#FF6B6B" />
      <Float rotationIntensity={0.2} floatIntensity={0.2} speed={1.8}>
        {[0, 1, 2, 3, 4].map((l) => (
          <group key={l} position={[0, l * 0.9 - 1.8, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[5, 5, 0.08]} />
              <meshStandardMaterial color={l === 4 ? "#FF6B6B" : "#1c1917"} transparent opacity={0.9} metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </Float>
      <Environment preset="night" />
    </Canvas>
  </div>
);
