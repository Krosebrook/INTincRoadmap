
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

export const HubArchitectureDiagram: React.FC = () => {
  const [activeHub, setActiveHub] = useState<string | null>(null);
  
  // Dimensions
  const SIZE = 320;
  const CENTER = SIZE / 2;
  const RADIUS = 100;

  // Pre-calculate positions
  const hubPositions = useMemo(() => {
    return HUBS_DATA.map((_, i) => calculateHubCoords(i, HUBS_DATA.length, RADIUS, CENTER));
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 my-8 select-none transition-colors duration-500 relative overflow-visible w-full max-w-lg mx-auto">
      <header className="relative z-10 flex items-center gap-2 mb-8">
        <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100">
          The 4-Pillar Hub Architecture
        </h3>
        <Tooltip content={
          <div className="space-y-2">
            <p className="font-bold text-nobel-gold border-b border-stone-700 pb-1">Federated Data Strategy</p>
            <p>Utilizing four best-of-breed "Hubs" connected via native integrations to avoid vendor lock-in.</p>
          </div>
        }>
          <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-help focus:outline-none focus:text-nobel-gold" aria-label="More info">
            <Info size={14} />
          </button>
        </Tooltip>
      </header>
      
      <div className="relative z-10 flex items-center justify-center w-80 h-80">
         {/* Connecting Lines Layer */}
         <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" aria-hidden="true">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="activeGradient" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C5A059" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#C5A059" stopOpacity="1" />
                    <stop offset="100%" stopColor="#C5A059" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#e7e5e4" strokeWidth="2" strokeDasharray="4 4" className="opacity-30 dark:stroke-stone-700" />
            
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
                            {/* Base Line with Continuous Flow */}
                            <motion.path 
                                d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                fill="none"
                                stroke={isActive ? "#C5A059" : "#a8a29e"}
                                strokeWidth={isActive ? 2 : 1}
                                strokeOpacity={isActive ? 0.6 : 0.2}
                                strokeDasharray={isActive ? "none" : "4 4"}
                                animate={{
                                    strokeDashoffset: isActive ? 0 : [0, -8]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            
                            {/* Active Energy Pulse */}
                            {isActive && (
                                <motion.path 
                                    d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                    stroke="url(#activeGradient)"
                                    strokeWidth={4}
                                    fill="none"
                                    filter="url(#glow)"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ 
                                        pathLength: [0, 1, 0], 
                                        opacity: [0, 1, 0],
                                        strokeDashoffset: [0, -20]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        ease: "easeInOut" 
                                    }}
                                />
                            )}

                            {/* Data Particle - Only shows when specific source is active */}
                            {isSource && (
                                <circle r="4" fill="#C5A059" filter="url(#glow)">
                                    <animateMotion 
                                        dur="1.5s" 
                                        repeatCount="indefinite"
                                        path={`M${source.x},${source.y} L${target.x},${target.y}`}
                                        keyPoints="0;1"
                                        keyTimes="0;1"
                                        calcMode="linear"
                                    />
                                </circle>
                            )}
                        </g>
                    );
                });
            })}
         </svg>

         {/* Central Core Node with Dynamic Breathing */}
         <motion.div 
            animate={{ 
                scale: activeHub ? [1, 1.15, 1] : [1, 1.05, 1],
                boxShadow: activeHub 
                    ? ["0 0 0px rgba(197, 160, 89, 0)", "0 0 40px rgba(197, 160, 89, 0.4)", "0 0 0px rgba(197, 160, 89, 0)"] 
                    : "none",
                borderColor: activeHub ? "#C5A059" : "rgba(197, 160, 89, 0.3)"
            }}
            transition={{ duration: activeHub ? 2 : 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-0 flex items-center justify-center w-24 h-24 border-4 border-double rounded-full bg-stone-100 dark:bg-stone-800 transition-colors"
         >
             <div className="text-center relative z-10">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">Unified</span>
                <span className="block text-xs font-serif font-bold text-stone-800 dark:text-stone-200">Data</span>
             </div>
             {/* Core internal glow */}
             {activeHub && (
                 <motion.div 
                    layoutId="core-glow"
                    className="absolute inset-0 rounded-full bg-nobel-gold/10"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                 />
             )}
         </motion.div>

         {/* Hub Interactive Nodes with Floating Animation */}
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
                    animate={{ 
                        x, 
                        y: isHovered ? y : [y - 3, y + 3, y - 3] // Floating effect
                    }} 
                    transition={{ 
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
                        default: { duration: 0.3 }
                    }}
                    onMouseEnter={() => setActiveHub(hub.id)}
                    onMouseLeave={() => setActiveHub(null)}
                    onFocus={() => setActiveHub(hub.id)}
                    onBlur={() => setActiveHub(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${hub.label}`}
                    style={{ zIndex: isHovered ? 50 : 20 }}
                 >
                    {/* Ripple Effect for Active Node */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                className="absolute -inset-4 rounded-full bg-nobel-gold/20 z-0"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>

                    <Tooltip content={hub.desc} className="mt-2 -ml-2">
                        <motion.div
                            animate={{ 
                                scale: isHovered ? 1.2 : 1,
                                opacity: isDimmed ? 0.4 : 1,
                                borderColor: isHovered ? "#C5A059" : "rgba(0,0,0,0)",
                                boxShadow: isHovered ? "0 10px 30px -10px rgba(197, 160, 89, 0.5)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer text-white transition-colors duration-300 ${hub.color} relative z-20 border-2`}
                        >
                            <hub.icon size={24} className="mb-1" aria-hidden="true" />
                            <span className="text-[10px] font-bold">{hub.id}</span>
                        </motion.div>
                    </Tooltip>
                 </motion.div>
             );
         })}
      </div>

      <div className="h-16 max-w-md mt-8 text-center" aria-live="polite">
        <AnimatePresence mode="wait">
             {activeHub ? (
                 <motion.div 
                    key={activeHub}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-stone-600 dark:text-stone-300"
                 >
                    <span className="font-bold text-nobel-gold">{HUBS_DATA.find(h => h.id === activeHub)?.label}:</span> {HUBS_DATA.find(h => h.id === activeHub)?.desc}
                 </motion.div>
             ) : (
                 <motion.div 
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-mono text-stone-400"
                 >
                    HOVER OVER A HUB TO SEE DATA FLOW
                 </motion.div>
             )}
        </AnimatePresence>
      </div>
    </div>
  );
};
