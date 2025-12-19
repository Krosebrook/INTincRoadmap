
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { Tooltip } from '../ui/Library';
import { HUBS_DATA } from '../../data/content';

// Memoized helper for coordinate calculation
const calculateHubCoords = (index: number, total: number, radius: number, center: number) => {
  const angle = (index * 90) * (Math.PI / 180);
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius
  };
};

/**
 * DataParticle Component
 * 
 * Represents a single 'bit' of data traveling between two architectural hubs.
 * Uses staggered delays and scale pulsing to create a 'streaming' effect.
 */
const DataParticle: React.FC<{ from: {x: number, y: number}; to: {x: number, y: number}; delay?: number }> = ({ from, to, delay = 0 }) => (
    <motion.circle
        r={3}
        fill="#C5A059"
        filter="url(#glow)"
        initial={{ cx: from.x, cy: from.y, opacity: 0, scale: 0 }}
        animate={{
            cx: [from.x, to.x],
            cy: [from.y, to.y],
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1.4, 0.7, 0.3]
        }}
        transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }}
    />
);

/**
 * HubArchitectureDiagram Component
 * 
 * A high-fidelity SVG visualization of the enterprise hub strategy.
 * Features interactive nodes, dynamic connection lines, and a particle
 * system to illustrate real-time data flow on hover.
 */
export const HubArchitectureDiagram: React.FC = () => {
  const [activeHub, setActiveHub] = useState<string | null>(null);
  
  // Design system dimensions
  const SIZE = 320;
  const CENTER = SIZE / 2;
  const RADIUS = 115;

  // Pre-calculate positions to prevent layout thrashing
  const hubPositions = useMemo(() => {
    return HUBS_DATA.map((_, i) => calculateHubCoords(i, HUBS_DATA.length, RADIUS, CENTER));
  }, []);

  return (
    <div className="flex flex-col items-center p-10 bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 my-8 select-none transition-all duration-1000 relative overflow-visible w-full max-w-lg mx-auto">
      <header className="relative z-10 flex items-center gap-3 mb-10">
        <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
          Federated Core
        </h3>
        <Tooltip content={
          <div className="space-y-2">
            <p className="font-bold text-nobel-gold border-b border-stone-700 pb-1">Best-of-Breed Logic</p>
            <p>Utilizing specialized Hubs for CRM, PSA, ERP, and HRIS to ensure maximum operational efficiency.</p>
          </div>
        }>
          <button className="text-stone-400 hover:text-nobel-gold transition-colors" aria-label="Architecture info">
            <Info size={18} />
          </button>
        </Tooltip>
      </header>
      
      <div className="relative z-10 flex items-center justify-center w-80 h-80">
         {/* Background Visual Layers */}
         <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" aria-hidden="true">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="pathGradient" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C5A059" stopOpacity="0" />
                    <stop offset="50%" stopColor="#C5A059" stopOpacity="1" />
                    <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                </linearGradient>
            </defs>
            
            {/* Pulsing Outer Orbit */}
            <motion.circle 
              cx="50%" cy="50%" r="48%" fill="none" 
              stroke="#C5A059" strokeWidth="0.5" strokeDasharray="4 20" 
              className="opacity-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Connections with Streaming Particles */}
            {HUBS_DATA.map((hub, i) => {
                const source = hubPositions[i];
                return hub.connections.map(targetId => {
                    const targetIndex = HUBS_DATA.findIndex(h => h.id === targetId);
                    if (targetIndex === -1) return null;
                    const target = hubPositions[targetIndex];
                    
                    const isActive = activeHub === hub.id || activeHub === targetId;
                    const isSource = activeHub === hub.id;
                    const key = `${hub.id}-${targetId}`;

                    return (
                        <g key={key}>
                            {/* Base adaptive connector path */}
                            <motion.path 
                                d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                fill="none"
                                stroke={isActive ? "#C5A059" : "#d6d3d1"}
                                strokeWidth={isActive ? 3 : 1.5}
                                strokeOpacity={isActive ? 1 : 0.2}
                                strokeDasharray={isActive ? "none" : "8 12"}
                                initial={false}
                                animate={{
                                    strokeDashoffset: isActive ? 0 : [0, -20],
                                    strokeWidth: isActive ? [3, 4.5, 3] : 1.5,
                                    stroke: isActive ? "#C5A059" : "#d6d3d1"
                                }}
                                transition={{
                                    strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" },
                                    strokeWidth: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                    stroke: { duration: 0.3 }
                                }}
                                className="dark:stroke-stone-700"
                            />
                            
                            {/* Enhanced Active Pulsating Glow Effects */}
                            <AnimatePresence>
                                {isActive && (
                                    <g>
                                      {/* Atmospheric "Atmosphere" Glow */}
                                      <motion.path 
                                          d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                          stroke="#C5A059"
                                          strokeWidth={24}
                                          strokeOpacity={0.08}
                                          fill="none"
                                          filter="url(#glow)"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: [0.05, 0.15, 0.05] }}
                                          exit={{ opacity: 0 }}
                                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                      />
                                      
                                      {/* Focused Inner Core Glow */}
                                      <motion.path 
                                          d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                          stroke="#facc15" // Brighter gold/yellow core
                                          strokeWidth={2}
                                          strokeOpacity={0.6}
                                          fill="none"
                                          initial={{ pathLength: 0, opacity: 0 }}
                                          animate={{ 
                                            pathLength: 1, 
                                            opacity: [0.4, 0.8, 0.4] 
                                          }}
                                          exit={{ opacity: 0 }}
                                          transition={{ 
                                            pathLength: { duration: 0.6 },
                                            opacity: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                                          }}
                                      />

                                      {/* Energy Pulse Streamer */}
                                      <motion.path 
                                          d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                          stroke="url(#pathGradient)"
                                          strokeWidth={6}
                                          fill="none"
                                          filter="url(#glow)"
                                          initial={{ pathLength: 0, opacity: 0 }}
                                          animate={{ 
                                              pathLength: [0, 1, 0], 
                                              opacity: [0, 0.7, 0]
                                          }}
                                          transition={{ 
                                              duration: 2.2, 
                                              repeat: Infinity, 
                                              ease: "easeInOut" 
                                          }}
                                      />
                                    </g>
                                )}
                            </AnimatePresence>

                            {/* Data Particle Stream for the source node */}
                            {isSource && (
                                <>
                                    {[0, 0.5, 1, 1.5].map((d) => (
                                        <DataParticle 
                                            key={`${key}-particle-${d}`} 
                                            from={source} 
                                            to={target} 
                                            delay={d} 
                                        />
                                    ))}
                                </>
                            )}
                        </g>
                    );
                });
            })}
         </svg>

         {/* Central Unified Core */}
         <motion.div 
            animate={{ 
                scale: activeHub ? [1, 1.1, 1] : [1, 1.04, 1],
                borderColor: activeHub ? "#C5A059" : "rgba(197, 160, 89, 0.2)",
                boxShadow: activeHub 
                  ? ["0 0 20px rgba(197,160,89,0)", "0 0 40px rgba(197,160,89,0.3)", "0 0 20px rgba(197,160,89,0)"]
                  : "0 10px 30px -10px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-0 flex items-center justify-center w-36 h-36 border-2 border-double rounded-full bg-white dark:bg-stone-800 shadow-xl transition-colors"
         >
             <div className="text-center relative z-10">
                <span className="block text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.4em] mb-1">Unified</span>
                <span className="block text-sm font-serif font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest">Stack</span>
             </div>
             {activeHub && (
                 <motion.div 
                    layoutId="core-glow"
                    className="absolute inset-0 rounded-full bg-nobel-gold/10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.5 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                 />
             )}
         </motion.div>

         {/* Interactive Hub Nodes */}
         {HUBS_DATA.map((hub, i) => {
             const pos = hubPositions[i];
             const x = pos.x - CENTER; 
             const y = pos.y - CENTER;
             const isHovered = activeHub === hub.id;
             const isDimmed = activeHub && activeHub !== hub.id;

             return (
                 <motion.div 
                    key={hub.id} 
                    className="absolute top-1/2 left-1/2"
                    initial={{ x, y }}
                    animate={{ x, y }} 
                    onMouseEnter={() => setActiveHub(hub.id)}
                    onMouseLeave={() => setActiveHub(null)}
                    onFocus={() => setActiveHub(hub.id)}
                    onBlur={() => setActiveHub(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Show details for ${hub.label}`}
                    style={{ zIndex: isHovered ? 50 : 20 }}
                 >
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                className="absolute -inset-10 rounded-3xl bg-nobel-gold/5 z-0"
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1.6, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>

                    <Tooltip content={hub.desc} className="relative z-20">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.15 }}
                            animate={{ 
                                scale: isHovered ? 1.25 : 1,
                                opacity: isDimmed ? 0.3 : 1,
                                boxShadow: isHovered 
                                  ? "0 30px 60px -15px rgba(197, 160, 89, 0.45)" 
                                  : "0 10px 20px -5px rgba(0, 0, 0, 0.1)"
                            }}
                            transition={{ type: "spring", stiffness: 450, damping: 20 }}
                            className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-white transition-all duration-500 ${hub.color} border-2 border-white/40 dark:border-stone-700 shadow-xl`}
                        >
                            <hub.icon size={26} className="mb-0.5" aria-hidden="true" />
                            <span className="text-[9px] font-bold tracking-tight opacity-80 uppercase">{hub.id}</span>
                        </motion.div>
                    </Tooltip>
                 </motion.div>
             );
         })}
      </div>

      <div className="h-28 max-w-sm mt-12 text-center" aria-live="polite">
        <AnimatePresence mode="wait">
             {activeHub ? (
                 <motion.div 
                    key={activeHub}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="text-sm text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm"
                 >
                    <span className="font-bold text-nobel-gold block mb-2 uppercase tracking-[0.3em] text-[10px]">{HUBS_DATA.find(h => h.id === activeHub)?.label}</span>
                    <p className="leading-relaxed font-light">{HUBS_DATA.find(h => h.id === activeHub)?.desc}</p>
                 </motion.div>
             ) : (
                 <motion.div 
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] font-bold tracking-[0.5em] text-stone-400 uppercase flex flex-col items-center justify-center h-full gap-4"
                 >
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nobel-gold/40 animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-nobel-gold/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-nobel-gold/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    Hover Nodes to Explore Connections
                 </motion.div>
             )}
        </AnimatePresence>
      </div>
    </div>
  );
};
