
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { Tooltip } from '../ui/Library';
import { HUBS_DATA } from '../../data/content';

// Design system constants for SVG coordinate mapping
const SVG_SIZE = 320;
const CENTER = SVG_SIZE / 2;
const HUB_RADIUS = 115;

/** 
 * Optimized coordinate mapping for radial hub layout 
 */
const getHubPos = (index: number) => {
  // Distribute hubs evenly around the circle
  const angle = (index * 90) * (Math.PI / 180);
  return {
    x: CENTER + Math.cos(angle) * HUB_RADIUS,
    y: CENTER + Math.sin(angle) * HUB_RADIUS
  };
};

/**
 * DataParticle Component
 * 
 * Animates a high-fidelity "packet" of information between architectural nodes.
 * Uses SVG filters for glow and Framer Motion for synchronized path traversal.
 */
const DataParticle: React.FC<{ 
  from: {x: number, y: number}; 
  to: {x: number, y: number}; 
  delay?: number;
  color?: string;
}> = ({ from, to, delay = 0, color = "#C5A059" }) => {
  return (
    <g>
      {/* Primary Glow Layer */}
      <motion.circle
          r={2.5}
          fill={color}
          filter="url(#p-glow)"
          initial={{ cx: from.x, cy: from.y, opacity: 0, scale: 0 }}
          animate={{
              cx: [from.x, to.x],
              cy: [from.y, to.y],
              opacity: [0, 1, 1, 0],
              scale: [0.6, 1.2, 0.8, 0.4]
          }}
          transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay
          }}
      />
      {/* Leading Edge Sparkle - enhances perceived movement speed */}
      <motion.circle
          r={1}
          fill="white"
          initial={{ cx: from.x, cy: from.y, opacity: 0 }}
          animate={{
              cx: [from.x, to.x],
              cy: [from.y, to.y],
              opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay
          }}
      />
      {/* Animated Path Trail */}
      <motion.line
          x1={from.x} y1={from.y}
          x2={to.x} y2={to.y}
          stroke={color}
          strokeWidth={1.2}
          strokeOpacity={0.3}
          strokeDasharray="4 160"
          initial={{ strokeDashoffset: 0, opacity: 0 }}
          animate={{ 
              strokeDashoffset: [0, -164],
              opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay
          }}
      />
    </g>
  );
};

/**
 * HubArchitectureDiagram Component
 * 
 * Interactive SVG visualizing the federated hub strategy.
 * Features high-fidelity data particles that travel along active connecting lines
 * when a user hovers over a hub, illustrating the flow of enterprise data.
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
        <Tooltip content="Utilizing specialized Best-of-Breed Hubs to ensure maximum operational integrity across departments.">
          <button className="text-stone-400 hover:text-nobel-gold transition-colors p-2" aria-label="Architecture Information">
            <Info size={20} />
          </button>
        </Tooltip>
      </header>
      
      <div className="relative z-10 flex items-center justify-center w-80 h-80">
         <svg 
           viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
           className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" 
           aria-hidden="true"
         >
            <defs>
                <filter id="p-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="edgePulse" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C5A059" stopOpacity="0" />
                    <stop offset="50%" stopColor="#facc15" stopOpacity="1" />
                    <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                </linearGradient>
            </defs>
            
            {/* Ambient Background Orbits */}
            <motion.circle 
              cx={CENTER} cy={CENTER} r={HUB_RADIUS * 1.2} fill="none" 
              stroke="#C5A059" strokeWidth="0.5" strokeDasharray="5 25" 
              className="opacity-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            />
            
            {HUBS_DATA.map((hub, i) => {
                const source = hubPositions[i];
                return hub.connections.map(targetId => {
                    const targetIdx = HUBS_DATA.findIndex(h => h.id === targetId);
                    
                    // Fallback to center if target is not a primary hub (e.g. BI)
                    const target = targetIdx === -1 
                      ? { x: CENTER, y: CENTER } 
                      : hubPositions[targetIdx];
                    
                    const isActive = activeHub === hub.id || activeHub === targetId;
                    const isSource = activeHub === hub.id;
                    const key = `${hub.id}-${targetId}`;

                    return (
                        <g key={key}>
                            {/* Static Background Path */}
                            <path 
                                d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                fill="none"
                                stroke="#d6d3d1"
                                strokeWidth={1.2}
                                strokeOpacity={0.15}
                                strokeDasharray="5 10"
                                className="dark:stroke-stone-700 transition-opacity duration-500"
                                style={{ opacity: isActive ? 0.2 : 1 }}
                            />

                            {/* Active Energy Link */}
                            <AnimatePresence>
                                {isActive && (
                                    <g>
                                      <motion.path 
                                          d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                          fill="none"
                                          stroke="#fbbf24"
                                          strokeWidth={3}
                                          initial={{ pathLength: 0, opacity: 0 }}
                                          animate={{ pathLength: 1, opacity: 0.8 }}
                                          exit={{ opacity: 0 }}
                                          transition={{ duration: 0.8, ease: "easeInOut" }}
                                      />
                                      
                                      <motion.path 
                                          d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                          stroke="url(#edgePulse)"
                                          strokeWidth={5}
                                          fill="none"
                                          filter="url(#p-glow)"
                                          initial={{ pathLength: 0, opacity: 0 }}
                                          animate={{ 
                                              pathLength: [0, 1, 0], 
                                              opacity: [0, 1, 0],
                                          }}
                                          transition={{ 
                                            duration: 2.8, 
                                            repeat: Infinity, 
                                            ease: "circInOut" 
                                          }}
                                          strokeDasharray="15 30"
                                      />
                                    </g>
                                )}
                            </AnimatePresence>

                            {/* Animated Data Stream - triggered on hub hover */}
                            {isSource && (
                                <g>
                                    {[0, 0.55, 1.1, 1.65].map((d) => (
                                        <DataParticle 
                                          key={`${key}-particle-${d}`} 
                                          from={source} 
                                          to={target} 
                                          delay={d} 
                                          // Map colors from tailwind classes
                                          color={
                                            hub.color.includes('blue') ? '#3B82F6' : 
                                            hub.color.includes('emerald') ? '#10B981' : 
                                            hub.color.includes('purple') ? '#9333EA' : 
                                            '#C5A059'
                                          }
                                        />
                                    ))}
                                </g>
                            )}
                        </g>
                    );
                });
            })}
         </svg>

         {/* Central Unified Core Node */}
         <motion.div 
            animate={{ 
                scale: activeHub ? 1.08 : 1,
                borderColor: activeHub ? "#C5A059" : "rgba(197, 160, 89, 0.15)",
                boxShadow: activeHub 
                  ? ["0 0 20px rgba(197,160,89,0)", "0 0 60px rgba(197,160,89,0.3)", "0 0 20px rgba(197,160,89,0)"]
                  : "0 10px 30px -10px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-0 flex items-center justify-center w-36 h-36 border-2 border-double rounded-full bg-white dark:bg-stone-800 transition-colors"
         >
             <div className="text-center">
                <span className="block text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.4em] mb-1">Unified</span>
                <span className="block text-sm font-serif font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest">Stack</span>
             </div>
         </motion.div>

         {/* Departmental Hub UI Nodes */}
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
                                className="absolute -inset-16 rounded-full bg-nobel-gold/10 z-0"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 2.2, opacity: 0 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>

                    <Tooltip content={hub.desc} className="relative z-20">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.1 }}
                            animate={{ 
                                opacity: isDimmed ? 0.35 : 1,
                                boxShadow: isHovered 
                                  ? "0 25px 50px -12px rgba(197, 160, 89, 0.4)" 
                                  : "0 10px 20px -10px rgba(0, 0, 0, 0.15)"
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            className={`w-16 h-16 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer text-white ${hub.color} border-2 border-white/30 dark:border-stone-700 transition-all duration-500`}
                        >
                            <hub.icon size={24} className="mb-0.5" />
                            <span className="text-[8px] font-bold tracking-tight opacity-90 uppercase">{hub.id}</span>
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
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    className="bg-stone-50 dark:bg-stone-800/80 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-700 shadow-sm"
                 >
                    <span className="font-bold text-nobel-gold block mb-2 uppercase tracking-[0.4em] text-[10px]">
                      {HUBS_DATA.find(h => h.id === activeHub)?.label}
                    </span>
                    <p className="text-base font-light text-stone-600 dark:text-stone-300 leading-relaxed italic max-w-sm mx-auto">
                      {HUBS_DATA.find(h => h.id === activeHub)?.desc}
                    </p>
                 </motion.div>
             ) : (
                 <motion.div 
                    key="default-instruction"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-6"
                 >
                    <div className="flex gap-4">
                        <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className="w-1.5 h-1.5 rounded-full bg-nobel-gold/40" />
                        <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.6, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-nobel-gold/40" />
                        <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.6, delay: 0.6 }} className="w-1.5 h-1.5 rounded-full bg-nobel-gold/40" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.4em] text-stone-400 uppercase">
                      Hover Hubs to Visualize Data Streams
                    </span>
                 </motion.div>
             )}
        </AnimatePresence>
      </div>
    </div>
  );
};
