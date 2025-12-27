
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap } from 'lucide-react';
import { Tooltip } from '../ui/Library';
import { HUBS_DATA } from '../../data/content';
import { useCity } from '../../context/CityContext';
import { HubId } from '../../types';

const SVG_SIZE = 400;
const CENTER = SVG_SIZE / 2;
const HUB_RADIUS = 145;

const getHubPos = (index: number) => {
  const angle = (index * (360 / 7) - 90) * (Math.PI / 180);
  return {
    x: CENTER + Math.cos(angle) * HUB_RADIUS,
    y: CENTER + Math.sin(angle) * HUB_RADIUS
  };
};

const getThemeColor = (colorClass: string) => {
  if (colorClass.includes('indigo')) return '#4F46E5';
  if (colorClass.includes('blue')) return '#2563EB';
  if (colorClass.includes('emerald')) return '#10B981';
  if (colorClass.includes('rose')) return '#E11D48';
  if (colorClass.includes('amber')) return '#D97706';
  if (colorClass.includes('violet')) return '#7C3AED';
  if (colorClass.includes('teal')) return '#0D9488';
  return '#C5A059';
};

export const HubArchitectureDiagram: React.FC = () => {
  const { state } = useCity();
  const [activeHub, setActiveHub] = useState<string | null>(null);
  
  const hubPositions = useMemo(() => 
    HUBS_DATA.map((_, i) => getHubPos(i)), []);

  const handleInteraction = useCallback((id: string | null) => {
    setActiveHub(id);
  }, []);

  /**
   * Optimized connection drawing to avoid duplicate paths and reduce DOM nodes.
   */
  const connections = useMemo(() => {
    const lines: Array<{
      id: string;
      source: { x: number; y: number };
      target: { x: number; y: number };
      sourceId: HubId;
      targetId: HubId;
      color: string;
    }> = [];
    
    const processed = new Set<string>();

    HUBS_DATA.forEach((hub, i) => {
      hub.connections.forEach(targetId => {
        const pair = [hub.id, targetId].sort().join('-');
        if (!processed.has(pair)) {
          const targetIdx = HUBS_DATA.findIndex(h => h.id === targetId);
          if (targetIdx !== -1) {
            lines.push({
              id: pair,
              source: hubPositions[i],
              target: hubPositions[targetIdx],
              sourceId: hub.id as HubId,
              targetId: targetId as HubId,
              color: getThemeColor(hub.color)
            });
            processed.add(pair);
          }
        }
      });
    });
    return lines;
  }, [hubPositions]);

  const currentHubData = useMemo(() => 
    HUBS_DATA.find(h => h.id === activeHub), [activeHub]);

  return (
    <div className="flex flex-col items-center p-8 bg-white dark:bg-stone-900 rounded-[4rem] shadow-4xl border border-stone-200 dark:border-stone-800 my-8 select-none transition-all duration-1000 relative overflow-visible w-full max-w-2xl mx-auto group/diagram">
      <header className="relative z-10 flex flex-col items-center gap-2 mb-10">
        <h3 className="font-serif text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
          City Grid Topology
        </h3>
        <div className="flex items-center gap-2 text-stone-400">
           <Zap size={14} className="text-fusion-bolt animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Real-time Federated Mesh</span>
        </div>
      </header>
      
      <div className="relative z-10 flex items-center justify-center w-[380px] h-[380px]">
         <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {connections.map((conn) => {
                const sourceActive = state.districts[conn.sourceId].isActive;
                const targetActive = state.districts[conn.targetId].isActive;
                const isParticipating = activeHub === conn.sourceId || activeHub === conn.targetId;

                return (
                    <g key={conn.id}>
                        <path 
                            d={`M${conn.source.x},${conn.source.y} L${conn.target.x},${conn.target.y}`}
                            fill="none"
                            stroke={sourceActive && targetActive ? "#d6d3d1" : "#ef4444"}
                            strokeWidth={1}
                            strokeOpacity={activeHub ? 0.05 : 0.15}
                            strokeDasharray={sourceActive && targetActive ? "0" : "5,5"}
                            className="dark:stroke-stone-700 transition-all duration-700"
                        />
                        <AnimatePresence>
                            {isParticipating && sourceActive && targetActive && (
                                <g>
                                  <motion.path 
                                      d={`M${conn.source.x},${conn.source.y} L${conn.target.x},${conn.target.y}`}
                                      fill="none"
                                      stroke={conn.color}
                                      strokeWidth={2.5}
                                      initial={{ pathLength: 0, opacity: 0 }}
                                      animate={{ pathLength: 1, opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.6, ease: "circOut" }}
                                      filter="url(#glow)"
                                  />
                                  <motion.circle 
                                    r="3"
                                    fill={conn.color}
                                    initial={{ offsetDistance: "0%" }}
                                    animate={{ offsetDistance: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    style={{ offsetPath: `path("M${conn.source.x},${conn.source.y} L${conn.target.x},${conn.target.y}")` }}
                                  />
                                </g>
                            )}
                        </AnimatePresence>
                    </g>
                );
            })}
         </svg>

         <motion.div 
            animate={{ 
              scale: state.simulationActive ? [1, 1.08, 1] : 1,
              boxShadow: state.simulationActive ? [
                '0 0 0 0 rgba(255, 107, 107, 0)',
                '0 0 40px 10px rgba(255, 107, 107, 0.2)',
                '0 0 0 0 rgba(255, 107, 107, 0)'
              ] : 'none'
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute z-0 flex items-center justify-center w-36 h-36 border-2 border-dashed rounded-full bg-white dark:bg-stone-800 transition-all duration-700 ${state.simulationActive ? 'border-fusion-bolt/60' : 'border-fusion-metro/30'}`}
         >
             <div className="text-center">
                <motion.span 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1"
                >
                  Metro Core
                </motion.span>
                <span className="block text-lg font-serif font-bold text-fusion-bolt uppercase tracking-tight leading-none">{state.transitHub}</span>
             </div>
         </motion.div>

         {HUBS_DATA.map((hub, i) => {
             const { x, y } = hubPositions[i];
             const isHovered = activeHub === hub.id;
             const status = state.districts[hub.id];
             const isDimmed = activeHub && !isHovered;
             const hubColor = getThemeColor(hub.color);

             return (
                 <motion.div 
                    key={hub.id} 
                    className="absolute top-1/2 left-1/2"
                    initial={{ x: x - CENTER, y: y - CENTER }}
                    animate={{ x: x - CENTER, y: y - CENTER, scale: isHovered ? 1.35 : 1 }} 
                    onMouseEnter={() => handleInteraction(hub.id)}
                    onMouseLeave={() => handleInteraction(null)}
                    style={{ zIndex: isHovered ? 50 : 20 }}
                 >
                    <Tooltip content={`${hub.label}: ${status.isActive ? 'Online' : 'Fault'}`}>
                        <motion.div
                            animate={{ 
                                opacity: isDimmed ? 0.2 : 1,
                                filter: status.isActive ? 'none' : 'grayscale(1)',
                                rotate: isHovered ? 5 : 0,
                                boxShadow: isHovered 
                                  ? `0 25px 60px -15px ${status.isActive ? hubColor : '#ef4444'}CC` 
                                  : "0 8px 25px -10px rgba(0, 0, 0, 0.15)"
                            }}
                            className={`w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer text-white border-2 border-white/30 transition-all duration-500 overflow-hidden relative ${
                              status.isActive ? hub.color : 'bg-red-500'
                            }`}
                        >
                            <AnimatePresence>
                              {isHovered && (
                                <motion.div 
                                  layoutId="hub-shimmer"
                                  className="absolute inset-0 bg-white/20 blur-md"
                                  initial={{ x: '-100%' }}
                                  animate={{ x: '100%' }}
                                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                />
                              )}
                            </AnimatePresence>
                            {status.isActive ? <hub.icon size={24} className="mb-0.5 relative z-10" /> : <ShieldAlert size={24} className="relative z-10" />}
                            <span className="text-[7px] font-bold tracking-[0.2em] opacity-80 uppercase relative z-10">{hub.id}</span>
                        </motion.div>
                    </Tooltip>
                 </motion.div>
             );
         })}
      </div>

      <div className="h-44 w-full mt-12 text-center overflow-hidden">
        <AnimatePresence mode="wait">
             {activeHub && currentHubData ? (
                 <motion.div 
                    key={activeHub}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`p-7 rounded-[2.5rem] border flex flex-col h-full transition-all duration-700 shadow-inner ${
                      state.districts[currentHubData.id].isActive 
                        ? 'bg-stone-50 dark:bg-stone-800/40 border-stone-100 dark:border-stone-800' 
                        : 'bg-red-500/5 border-red-500/10'
                    }`}
                 >
                    <div className="flex justify-between items-start mb-5">
                      <div className="text-left">
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`font-bold block uppercase tracking-[0.3em] text-[10px] mb-1 ${state.districts[currentHubData.id].isActive ? 'text-fusion-bolt' : 'text-red-500'}`}>
                          {state.districts[currentHubData.id].isActive ? 'District Active' : 'SYSTEM FAULT'}
                        </motion.span>
                        <h4 className="text-2xl font-serif font-bold dark:text-white tracking-tight">{currentHubData.label}</h4>
                      </div>
                      <div className="flex -space-x-3">
                        {currentHubData.subPlatforms.map((sp, idx) => (
                           <motion.div 
                            key={idx} 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-700 flex items-center justify-center text-[10px] font-bold text-stone-500 shadow-md"
                           >
                             {sp.name.charAt(0)}
                           </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-left mt-auto">
                       {currentHubData.subPlatforms.map((sp, idx) => (
                         <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.05 }}
                          className="flex flex-col"
                         >
                            <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 truncate">{sp.name}</span>
                            <span className="text-[9px] text-stone-500 uppercase font-medium">{sp.role}</span>
                         </motion.div>
                       ))}
                    </div>
                 </motion.div>
             ) : (
                 <div className="flex flex-col items-center justify-center h-full text-stone-400">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="flex gap-3 mb-5"
                    >
                        <div className="w-2 h-2 rounded-full bg-fusion-bolt" />
                        <div className="w-2 h-2 rounded-full bg-fusion-bolt" />
                        <div className="w-2 h-2 rounded-full bg-fusion-bolt" />
                    </motion.div>
                    <span className="text-[11px] font-bold tracking-[0.4em] uppercase opacity-60">
                      Synchronized Topology Overview
                    </span>
                 </div>
             )}
        </AnimatePresence>
      </div>
    </div>
  );
};
