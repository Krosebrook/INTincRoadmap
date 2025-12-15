
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sphere, Stars, Environment, Text, Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

const DataNode: React.FC<{ position: [number, number, number]; color: string; label?: string; delay?: number }> = ({ position, color, label, delay = 0 }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      // Complex floating animation
      ref.current.position.y = position[1] + Math.sin(t * 1 + delay) * 0.1;
      ref.current.rotation.x = Math.sin(t * 0.5 + delay) * 0.2;
      ref.current.rotation.z = Math.cos(t * 0.3 + delay) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
        {/* Core Geometry */}
        <Icosahedron args={[0.3, 0]}>
            <MeshDistortMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                roughness={0.2}
                metalness={0.8}
                distort={0.4}
                speed={2}
            />
        </Icosahedron>
        
        {/* Outer Halo */}
        <Sphere args={[0.45, 16, 16]}>
            <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
        </Sphere>

        {label && (
            <Text
                position={[0, 0.6, 0]}
                fontSize={0.25}
                color={color} // Dark mode text color handled by scene lighting/contrast usually, but here fixed color
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        )}
    </group>
  );
};

const AnimatedLines: React.FC = () => {
    const lines = useMemo(() => {
        return new Array(20).fill(0).map(() => ({
            start: [Math.random() * 10 - 5, Math.random() * 6 - 3, Math.random() * 5 - 5] as [number, number, number],
            end: [Math.random() * 10 - 5, Math.random() * 6 - 3, Math.random() * 5 - 5] as [number, number, number],
            speed: Math.random() * 0.5 + 0.5
        }));
    }, []);

    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.001;
        }
    });

    return (
        <group ref={ref}>
            {lines.map((line, i) => (
                <Line
                    key={i}
                    points={[line.start, line.end]}
                    color="#C5A059"
                    lineWidth={1}
                    transparent
                    opacity={0.1}
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

    useFrame(() => {
        if (groupRef.current && scrollYProgress) {
            const progress = scrollYProgress.get();
            // Parallax rotation and slight zoom out on scroll
            groupRef.current.rotation.y = -progress * 0.5; 
            groupRef.current.position.z = -progress * 2; 
        }
    });

    return (
        <group ref={groupRef}>
             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Core Hub Representation */}
                <DataNode position={[0, 1.5, 0]} color="#C5A059" label="ERP" delay={0} />
                <DataNode position={[-2.5, -0.5, 1]} color="#4F46E5" label="CRM" delay={1} />
                <DataNode position={[2.5, -0.5, 1]} color="#10B981" label="PSA" delay={2} />
                
                {/* Connecting Lines */}
                <Line points={[[0, 1.5, 0], [-2.5, -0.5, 1]]} color="#666" lineWidth={1} transparent opacity={0.2} dashed dashScale={10} gapSize={5} />
                <Line points={[[0, 1.5, 0], [2.5, -0.5, 1]]} color="#666" lineWidth={1} transparent opacity={0.2} dashed dashScale={10} gapSize={5} />
                <Line points={[[-2.5, -0.5, 1], [2.5, -0.5, 1]]} color="#666" lineWidth={1} transparent opacity={0.2} dashed dashScale={10} gapSize={5} />

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
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#C5A059" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4F46E5" />
        
        <SceneContent scrollYProgress={scrollYProgress} />
        
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
};

export const QuantumComputerScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [4, 4, 4], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#C5A059" />
        
        <Float rotationIntensity={0.2} floatIntensity={0.1} speed={2}>
            {/* Abstract Stack Layers */}
            {[0, 1, 2, 3].map((level) => (
                <group key={level} position={[0, level * 0.8 - 1.5, 0]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[3, 3, 0.1]} />
                        <meshStandardMaterial 
                            color={level === 3 ? "#C5A059" : "#333"} 
                            transparent 
                            opacity={0.8}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                    {/* Data flow particles between layers */}
                    <Sphere args={[0.05]} position={[Math.sin(level), 0.4, Math.cos(level)]}>
                        <meshBasicMaterial color="#4F46E5" />
                    </Sphere>
                </group>
            ))}
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
