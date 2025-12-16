
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sphere, Stars, Environment, Text, Icosahedron, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

const DataNode: React.FC<{ position: [number, number, number]; color: string; label?: string; delay?: number }> = ({ position, color, label, delay = 0 }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      // Organic floating motion with delayed phase for variety
      ref.current.position.y = position[1] + Math.sin(t * 0.8 + delay) * 0.15;
      ref.current.rotation.x = Math.sin(t * 0.3 + delay) * 0.2;
      ref.current.rotation.z = Math.cos(t * 0.2 + delay) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            {/* Core Geometry with distortion for "alive" data feel */}
            <Icosahedron args={[0.4, 0]}>
                <MeshDistortMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.6}
                    roughness={0.1}
                    metalness={0.9}
                    distort={0.3}
                    speed={2}
                />
            </Icosahedron>
            
            {/* Outer Energy Field */}
            <Sphere args={[0.65, 16, 16]}>
                <meshStandardMaterial 
                    color={color} 
                    wireframe 
                    transparent 
                    opacity={0.15} 
                    roughness={0}
                    metalness={0}
                />
            </Sphere>
            
            {/* Inner Point Light */}
             <pointLight distance={2} intensity={2} color={color} />
        </Float>

        {label && (
            <Text
                position={[0, 0.8, 0]}
                fontSize={0.25}
                color={color}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#1a1a1a"
            >
                {label}
            </Text>
        )}
    </group>
  );
};

const AnimatedLines: React.FC = () => {
    const lines = useMemo(() => {
        return new Array(25).fill(0).map(() => ({
            start: [Math.random() * 12 - 6, Math.random() * 8 - 4, Math.random() * 6 - 3] as [number, number, number],
            end: [Math.random() * 12 - 6, Math.random() * 8 - 4, Math.random() * 6 - 3] as [number, number, number],
            speed: Math.random() * 0.5 + 0.5
        }));
    }, []);

    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ref.current) {
            // Slow background rotation for dynamic lines
            ref.current.rotation.y += 0.001;
            ref.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
        }
    });

    return (
        <group ref={ref}>
            <Sparkles count={60} scale={12} size={3} speed={0.4} opacity={0.4} color="#C5A059" />
            {lines.map((line, i) => (
                <Line
                    key={i}
                    points={[line.start, line.end]}
                    color="#C5A059"
                    lineWidth={1}
                    transparent
                    opacity={0.08}
                />
            ))}
        </group>
    );
};

interface SceneContentProps {
    scrollYProgress?: MotionValue<number>;
}

const SceneContent: React.FC<SceneContentProps> = ({ scrollYProgress }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        
        const scroll = scrollYProgress ? scrollYProgress.get() : 0;
        const t = state.clock.getElapsedTime();
        
        // --- Smooth Parallax Interactions ---
        // Target rotation based on scroll
        const targetRotY = -scroll * Math.PI * 0.3;
        const targetPosZ = -scroll * 4;
        const targetPosY = scroll * 1;

        // Smoothly interpolate current values to target values (0.1 factor = smooth damping)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosZ, 0.1);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.1);

        // Add subtle constant floating rotation on top
        groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.05;
        groupRef.current.rotation.x = Math.cos(t * 0.1) * 0.05;
    });

    return (
        <group ref={groupRef}>
             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Core Hub Representation */}
                <DataNode position={[0, 1.5, 0]} color="#C5A059" label="ERP Core" delay={0} />
                <DataNode position={[-3, -1, 1]} color="#4F46E5" label="CRM Edge" delay={1.5} />
                <DataNode position={[3, -1, 1]} color="#10B981" label="PSA Ops" delay={2.5} />
                
                {/* Connecting Logic Lines */}
                <Line points={[[0, 1.5, 0], [-3, -1, 1]]} color="#a8a29e" lineWidth={1} transparent opacity={0.15} dashed dashScale={20} gapSize={10} />
                <Line points={[[0, 1.5, 0], [3, -1, 1]]} color="#a8a29e" lineWidth={1} transparent opacity={0.15} dashed dashScale={20} gapSize={10} />
                <Line points={[[-3, -1, 1], [3, -1, 1]]} color="#a8a29e" lineWidth={1} transparent opacity={0.15} dashed dashScale={20} gapSize={10} />

                {/* Abstract Data Cloud */}
                <AnimatedLines />
            </Float>
        </group>
    )
}

interface HeroSceneProps {
    scrollYProgress?: MotionValue<number>;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ scrollYProgress }) => {
  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#C5A059" castShadow />
        <pointLight position={[-10, -5, -5]} intensity={1} color="#4F46E5" />
        <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />
        
        <SceneContent scrollYProgress={scrollYProgress} />
        
        {/* Environment & Atmosphere */}
        <Environment preset="city" blur={0.8} />
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export const QuantumComputerScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [4, 4, 4], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#C5A059" />
        
        <Float rotationIntensity={0.2} floatIntensity={0.1} speed={2}>
            {/* Abstract Stack Layers */}
            {[0, 1, 2, 3].map((level) => (
                <group key={level} position={[0, level * 0.8 - 1.5, 0]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[3, 3, 0.1]} />
                        <meshStandardMaterial 
                            color={level === 3 ? "#C5A059" : "#292524"} 
                            transparent 
                            opacity={0.85}
                            metalness={0.6}
                            roughness={0.2}
                        />
                    </mesh>
                    {/* Data flow particles between layers */}
                    <Sphere args={[0.06]} position={[Math.sin(level * 1.5), 0.4, Math.cos(level * 1.5)]}>
                        <meshBasicMaterial color="#4F46E5" />
                    </Sphere>
                    <Sphere args={[0.04]} position={[Math.cos(level * 2), 0.4, Math.sin(level * 2)]}>
                        <meshBasicMaterial color="#10B981" />
                    </Sphere>
                </group>
            ))}
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
