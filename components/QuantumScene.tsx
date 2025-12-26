
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Stars, Environment, Text, MeshDistortMaterial, Sparkles, Sphere } from '@react-three/drei';
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
    ref.current.position.y = position[1] + Math.sin(t * 1.4 + delay) * 0.12;
    ref.current.rotation.y = t * 0.15 + delay;
    if (lightRef.current) {
      lightRef.current.intensity = 2.2 + Math.sin(t * 1.8 + delay) * 0.8;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={1}>
        <mesh geometry={NODE_GEOM}>
          <MeshDistortMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={1.4}
            roughness={0}
            metalness={1}
            distort={0.4}
            speed={3.5}
          />
        </mesh>
        <mesh geometry={SHELL_GEOM}>
          <meshStandardMaterial 
            color={color} 
            wireframe 
            transparent 
            opacity={0.07} 
            metalness={1}
            roughness={0}
          />
        </mesh>
        <pointLight ref={lightRef} distance={6} intensity={2.5} color={color} />
      </Float>
      {label && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.26}
          color={color}
          anchorX="center"
          outlineWidth={0.012}
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
  const scrollVal = scrollYProgress || useMotionValue(0);

  const rotationY = useTransform(scrollVal, [0, 1], [0, -Math.PI * 1.5]);
  const rotationX = useTransform(scrollVal, [0, 1], [0, Math.PI * 0.2]);
  const positionZ = useTransform(scrollVal, [0, 1], [0, -22]);
  const driftY = useTransform(scrollVal, [0, 1], [0, 7]);
  const spreadScale = useTransform(scrollVal, [0, 1], [1, 2.5]);

  useFrame((state) => {
    if (!groupRef.current || !satellitesRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotationY.get(), 0.035);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotationX.get(), 0.035);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, positionZ.get(), 0.035);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, driftY.get(), 0.035);
    const targetScale = spreadScale.get();
    satellitesRef.current.scale.setScalar(THREE.MathUtils.lerp(satellitesRef.current.scale.x, targetScale, 0.035));
  });

  return (
    <group ref={groupRef}>
      {/* Primary Transit Hub Core (n8n) */}
      <DataNode position={[0, 2.5, 0]} color="#FF6B6B" label="n8n METRO" delay={0} scale={1.5} />
      
      {/* 7 Federated Satellite Domains */}
      <group ref={satellitesRef}>
        <DataNode position={[-7, -2, 4]} color="#4F46E5" label="DEV" delay={1} />
        <DataNode position={[7, -2, 4]} color="#2563EB" label="DATA" delay={2} />
        <DataNode position={[0, -8, -5]} color="#10B981" label="AI" delay={3} />
        <DataNode position={[-8, 4, -8]} color="#E11D48" label="OPS" delay={4} />
        <DataNode position={[8, 4, -8]} color="#D97706" label="GROWTH" delay={5} />
        <DataNode position={[-4, -10, 0]} color="#7C3AED" label="COMMERCE" delay={6} />
        <DataNode position={[4, -10, 0]} color="#0D9488" label="COLLAB" delay={7} />
        
        <Line points={[[0, 2.5, 0], [-7, -2, 4]]} color="#FF6B6B" lineWidth={1} transparent opacity={0.15} />
        <Line points={[[0, 2.5, 0], [7, -2, 4]]} color="#FF6B6B" lineWidth={1} transparent opacity={0.15} />
        <Line points={[[0, 2.5, 0], [0, -8, -5]]} color="#FF6B6B" lineWidth={1} transparent opacity={0.15} />
      </group>

      <Sparkles count={150} scale={25} size={3} speed={0.4} opacity={0.25} color="#FF6B6B" />
    </group>
  );
};

export const HeroScene: React.FC<{ scrollYProgress?: MotionValue<number> }> = ({ scrollYProgress }) => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <Canvas camera={{ position: [0, 0, 16], fov: 42 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.25} />
      <spotLight position={[25, 25, 25]} angle={0.2} penumbra={1} intensity={3.5} color="#FF6B6B" />
      <HeroSceneContent scrollYProgress={scrollYProgress} />
      <Environment preset="night" />
      <Stars radius={160} depth={90} count={9000} factor={6} saturation={0} fade speed={1.2} />
    </Canvas>
  </div>
);

export const QuantumComputerScene: React.FC = () => (
  <div className="w-full h-full absolute inset-0">
    <Canvas camera={{ position: [6, 4, 6], fov: 32 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[12, 12, 12]} intensity={2} color="#FF6B6B" />
      <Float rotationIntensity={0.15} floatIntensity={0.15} speed={1.5}>
        {[0, 1, 2, 3, 4].map((l) => (
          <group key={l} position={[0, l * 0.8 - 1.6, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[4, 4, 0.05]} />
              <meshStandardMaterial color={l === 4 ? "#FF6B6B" : "#1c1917"} transparent opacity={0.85} metalness={0.8} />
            </mesh>
          </group>
        ))}
      </Float>
      <Environment preset="night" />
    </Canvas>
  </div>
);
