
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { Tooltip } from '../ui/Library';
import { HUBS_DATA } from '../../data/content';

// Design system constants
const SVG_SIZE = 320;
const CENTER = SVG_SIZE / 2;
const HUB_RADIUS = 115;

/** 
 * Optimized coordinate mapping for radial hub layout 
 */
const getHubPos = (index: number) => {
  const angle = (index * 90) * (Math.PI / 180);
  return {
    x: CENTER + Math.cos(angle) * HUB_RADIUS,
    y: CENTER + Math.sin(angle) * HUB_RADIUS
  };
};

/**
 * DataParticle Component
 * Animates a packet of data between two hubs with organic scaling and opacity.
 */
const DataParticle: React.FC<{ 
  from: {x: number, y: number}; 
  to: {x: number, y: number}; 
  delay?: number 
}> = ({ from, to, delay = 0 }) => (
    <motion.circle
        r={2.5}
        fill="#C5A059"
        filter="url(#p-glow)"
        initial={{ cx: from.x, cy: from.y, opacity: 0, scale: 0 }}
        animate={{
            cx: [from.x, to.x],
            cy: [from.y, to.y],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.4, 0.8, 0.4]
        }}
        transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }}
    />
);

/**
 * HubArchitectureDiagram Component
 * 
 * Interactive SVG visualizing the federated hub strategy.
 * Features high-fidelity path animations and synchronized hub hover states.
 */
export const HubArchitectureDiagram: React.FC = () => {
  const [activeHub, setActiveHub] = useState<string | null>(null);
  
  const hubPositions = useMemo(() => 
    HUBS_DATA.map((_, i) => getHubPos(i)), []);

  const handleInteraction = useCallback((id: string | null) => {
    setActiveHub(id);
  }, []);

  return (
    <div className="flex flex-col items-center p-12 bg-white dark:bg-stone-900 rounded-[3rem] shadow-2xl border border-stone-200 dark:border-stone-800 my-8 select-none transition-all duration-1000 relative overflow-visible w-full max-w-lg mx-auto group/diagram">
      <header className="relative z-10 flex items-center gap-4 mb-12">
        <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
          Federated Core
        </h3>
        <Tooltip content="Utilizing specialized Best-of-Breed Hubs to ensure maximum operational integrity.">
          <button className="text-stone-400 hover:text-nobel-gold transition-colors p-2" aria-label="Learn about core">
            <Info size={20} />
          </button>
        </Tooltip>
      </header>
      
      <div className="relative z-10 flex items-center justify-center w-80 h-80">
         <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" aria-hidden="true">
            <defs>
                <filter id="p-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="edgePulse" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C5A059" stopOpacity="0" />
                    <stop offset="50%" stopColor="#facc15" stopOpacity="1" />
                    <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                </linearGradient>
            </defs>
            
            {/* Background Orbits */}
            <motion.circle 
              cx="50%" cy="50%" r="48%" fill="none" 
              stroke="#C5A059" strokeWidth="0.5" strokeDasharray="5 25" 
              className="opacity-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            />
            
            {HUBS_DATA.map((hub, i) => {
                const source = hubPositions[i];
                return hub.connections.map(targetId => {
                    const targetIdx = HUBS_DATA.findIndex(h => h.id === targetId);
                    if (targetIdx === -1) return null;
                    const target = hubPositions[targetIdx];
                    
                    const isActive = activeHub === hub.id || activeHub === targetId;
                    const isSource = activeHub === hub.id;
                    const key = `${hub.id}-${targetId}`;

                    return (
                        <g key={key}>
                            {/* Static Background Connector */}
                            <path 
                                d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                fill="none"
                                stroke="#d6d3d1"
                                strokeWidth={1.5}
                                strokeOpacity={0.15}
                                strokeDasharray="10 15"
                                className="dark:stroke-stone-700 transition-opacity duration-500"
                                style={{ opacity: isActive ? 0.3 : 1 }}
                            />

                            {/* Active Energy Pulse Path */}
                            <AnimatePresence>
                                {isActive && (
                                    <g>
                                      {/* Primary Active Path */}
                                      <motion.path 
                                          d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                          fill="none"
                                          stroke="#fbbf24"
                                          strokeWidth={4}
                                          initial={{ pathLength: 0, opacity: 0 }}
                                          animate={{ pathLength: 1, opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          transition={{ duration: 0.8, ease: "easeInOut" }}
                                      />
                                      
                                      {/* Atmospheric Halo Glow */}
                                      <motion.path 
                                          d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                          stroke="#fcd34d"
                                          strokeWidth={14}
                                          strokeOpacity={0.15}
                                          fill="none"
                                          filter="url(#p-glow)"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: [0.1, 0.35, 0.1] }}
                                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                      />
                                      
                                      {/* Moving Light Shimmer */}
                                      <motion.path 
                                          d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                          stroke="url(#edgePulse)"
                                          strokeWidth={6}
                                          fill="none"
                                          filter="url(#p-glow)"
                                          initial={{ pathLength: 0, opacity: 0 }}
                                          animate={{ 
                                              pathLength: [0, 1, 0], 
                                              opacity: [0, 1, 0]
                                          }}
                                          transition={{ duration: 2.8, repeat: Infinity, ease: "circInOut" }}
                                      />
                                    </g>
                                )}
                            </AnimatePresence>

                            {/* Staggered Data Particles */}
                            {isSource && (
                                <>
                                    {[0, 0.7, 1.4, 2.1].map((d) => (
                                        <DataParticle key={`${key}-p-${d}`} from={source} to={target} delay={d} />
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
                scale: activeHub ? 1.12 : 1,
                borderColor: activeHub ? "#C5A059" : "rgba(197, 160, 89, 0.15)",
                boxShadow: activeHub 
                  ? ["0 0 15px rgba(197,160,89,0)", "0 0 50px rgba(197,160,89,0.25)", "0 0 15px rgba(197,160,89,0)"]
                  : "0 15px 40px -10px rgba(0,0,0,0.12)"
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-0 flex items-center justify-center w-36 h-36 border-2 border-double rounded-full bg-white dark:bg-stone-800 transition-colors"
         >
             <div className="text-center">
                <span className="block text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.4em] mb-1">Unified</span>
                <span className="block text-sm font-serif font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest">Stack</span>
             </div>
         </motion.div>

         {/* Dept Hub Nodes */}
         {HUBS_DATA.map((hub, i) => {
             const { x, y } = hubPositions[i];
             const isHovered = activeHub === hub.id;
             const isDimmed = activeHub && !isHovered;

             return (
                 <motion.div 
                    key={hub.id} 
                    className="absolute top-1/2 left-1/2"
                    initial={{ x: x - CENTER, y: y - CENTER }}
                    animate={{ 
                      x: x - CENTER, 
                      y: y - CENTER,
                      scale: isHovered ? 1.25 : 1,
                    }} 
                    onMouseEnter={() => handleInteraction(hub.id)}
                    onMouseLeave={() => handleInteraction(null)}
                    style={{ zIndex: isHovered ? 50 : 20 }}
                 >
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                className="absolute -inset-14 rounded-full bg-nobel-gold/10 z-0"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>

                    <Tooltip content={hub.desc} className="relative z-20">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.15 }}
                            animate={{ 
                                opacity: isDimmed ? 0.3 : 1,
                                boxShadow: isHovered 
                                  ? "0 30px 60px -15px rgba(197, 160, 89, 0.4)" 
                                  : "0 12px 25px -10px rgba(0, 0, 0, 0.15)"
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`w-16 h-16 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer text-white ${hub.color} border-2 border-white/40 dark:border-stone-700 transition-all duration-500`}
                        >
                            <hub.icon size={26} className="mb-0.5" />
                            <span className="text-[9px] font-bold tracking-tight opacity-90 uppercase">{hub.id}</span>
                        </motion.div>
                    </Tooltip>
                 </motion.div>
             );
         })}
      </div>

      <div className="h-32 w-full mt-14 text-center" aria-live="polite">
        <AnimatePresence mode="wait">
             {activeHub ? (
                 <motion.div 
                    key={activeHub}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    className="bg-stone-50 dark:bg-stone-800/80 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-700 shadow-sm"
                 >
                    <span className="font-bold text-nobel-gold block mb-2 uppercase tracking-[0.4em] text-[10px]">
                      {HUBS_DATA.find(h => h.id === activeHub)?.label}
                    </span>
                    <p className="text-base font-light text-stone-600 dark:text-stone-300 leading-relaxed italic">
                      {HUBS_DATA.find(h => h.id === activeHub)?.desc}
                    </p>
                 </motion.div>
             ) : (
                 <motion.div 
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-6"
                 >
                    <div className="flex gap-3">
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-nobel-gold/50" />
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-nobel-gold/50" />
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-nobel-gold/50" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.5em] text-stone-400 uppercase">
                      Select Hub to Audit Connections
                    </span>
                 </motion.div>
             )}
        </AnimatePresence>
      </div>
    </div>
  );
};
