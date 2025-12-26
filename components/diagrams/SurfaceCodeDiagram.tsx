
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ShieldAlert } from 'lucide-react';
import { Tooltip } from '../ui/Library';
import { HUBS_DATA } from '../../data/content';
import { useCity } from '../../context/CityContext';

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

export const HubArchitectureDiagram: React.FC = () => {
  const { state } = useCity();
  const [activeHub, setActiveHub] = useState<string | null>(null);
  
  const hubPositions = useMemo(() => 
    HUBS_DATA.map((_, i) => getHubPos(i)), []);

  const handleInteraction = useCallback((id: string | null) => {
    setActiveHub(id);
  }, []);

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

  const currentHubData = useMemo(() => 
    HUBS_DATA.find(h => h.id === activeHub), [activeHub]);

  return (
    <div className="flex flex-col items-center p-8 bg-white dark:bg-stone-900 rounded-[3rem] shadow-3xl border border-stone-200 dark:border-stone-800 my-8 select-none transition-all duration-1000 relative overflow-visible w-full max-w-2xl mx-auto group/diagram">
      <header className="relative z-10 flex items-center gap-4 mb-8">
        <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
          City Grid Topology
        </h3>
        <Tooltip content="Live architectural mesh synchronized with the Simulation Engine.">
          <button className="text-stone-400 hover:text-fusion-bolt transition-colors p-2">
            <Map size={20} />
          </button>
        </Tooltip>
      </header>
      
      <div className="relative z-10 flex items-center justify-center w-[360px] h-[360px]">
         <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
            {HUBS_DATA.map((hub, i) => {
                const source = hubPositions[i];
                const hubColor = getThemeColor(hub.color);
                const sourceActive = state.districts[hub.id].isActive;
                
                return hub.connections.map(targetId => {
                    const targetIdx = HUBS_DATA.findIndex(h => h.id === targetId);
                    if (targetIdx === -1) return null;
                    const target = hubPositions[targetIdx];
                    const targetActive = state.districts[targetId].isActive;
                    const isParticipating = activeHub === hub.id || activeHub === targetId;

                    return (
                        <g key={`${hub.id}-${targetId}`}>
                            <path 
                                d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                fill="none"
                                stroke={sourceActive && targetActive ? "#d6d3d1" : "#ef4444"}
                                strokeWidth={1}
                                strokeOpacity={activeHub ? 0.05 : 0.15}
                                strokeDasharray={sourceActive && targetActive ? "0" : "5,5"}
                                className="dark:stroke-stone-700 transition-all duration-700"
                            />
                            <AnimatePresence>
                                {isParticipating && sourceActive && targetActive && (
                                    <motion.path 
                                        d={`M${source.x},${source.y} L${target.x},${target.y}`}
                                        fill="none"
                                        stroke={hubColor}
                                        strokeWidth={2}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                    />
                                )}
                            </AnimatePresence>
                        </g>
                    );
                });
            })}
         </svg>

         <motion.div 
            animate={{ scale: state.simulationActive ? [1, 1.05, 1] : 1 }}
            className={`absolute z-0 flex items-center justify-center w-32 h-32 border-4 border-dotted rounded-full bg-white dark:bg-stone-800 transition-colors duration-700 ${state.simulationActive ? 'border-fusion-bolt/40' : 'border-fusion-metro/20'}`}
         >
             <div className="text-center">
                <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">Transit</span>
                <span className="block text-sm font-serif font-bold text-fusion-bolt uppercase">{state.transitHub}</span>
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
                    animate={{ x: x - CENTER, y: y - CENTER, scale: isHovered ? 1.25 : 1 }} 
                    onMouseEnter={() => handleInteraction(hub.id)}
                    onMouseLeave={() => handleInteraction(null)}
                    style={{ zIndex: isHovered ? 50 : 20 }}
                 >
                    <Tooltip content={`${hub.label}: ${status.isActive ? 'Online' : 'Fault'}`}>
                        <motion.div
                            animate={{ 
                                opacity: isDimmed ? 0.3 : 1,
                                filter: status.isActive ? 'none' : 'grayscale(0.8)',
                                boxShadow: isHovered 
                                  ? `0 20px 50px -10px ${status.isActive ? hubColor : '#ef4444'}AA` 
                                  : "0 5px 15px -5px rgba(0, 0, 0, 0.1)"
                            }}
                            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-white border-2 border-white/20 transition-all duration-300 ${
                              status.isActive ? hub.color : 'bg-red-500'
                            }`}
                        >
                            {status.isActive ? <hub.icon size={20} className="mb-0.5" /> : <ShieldAlert size={20} />}
                            <span className="text-[6px] font-bold tracking-widest opacity-80 uppercase">{hub.id}</span>
                        </motion.div>
                    </Tooltip>
                 </motion.div>
             );
         })}
      </div>

      <div className="h-40 w-full mt-12 text-center overflow-hidden">
        <AnimatePresence mode="wait">
             {activeHub && currentHubData ? (
                 <motion.div 
                    key={activeHub}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className={`p-6 rounded-3xl border flex flex-col h-full transition-colors duration-500 ${
                      state.districts[currentHubData.id].isActive 
                        ? 'bg-stone-50 dark:bg-stone-800/50 border-stone-100 dark:border-stone-800' 
                        : 'bg-red-500/10 border-red-500/20'
                    }`}
                 >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-left">
                        <span className={`font-bold block uppercase tracking-widest text-[10px] ${state.districts[currentHubData.id].isActive ? 'text-fusion-bolt' : 'text-red-500'}`}>
                          {state.districts[currentHubData.id].isActive ? 'District Active' : 'FAULT: Critical Failure'}
                        </span>
                        <h4 className="text-xl font-serif font-bold dark:text-white">{currentHubData.label}</h4>
                      </div>
                      <div className="flex -space-x-2">
                        {currentHubData.subPlatforms.map((sp, idx) => (
                           <div key={idx} className="w-6 h-6 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-700 flex items-center justify-center text-[8px] font-bold text-stone-500">
                             {sp.name.charAt(0)}
                           </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-left mt-auto">
                       {currentHubData.subPlatforms.map((sp, idx) => (
                         <div key={idx} className="flex flex-col">
                            <span className="text-[10px] font-bold text-stone-900 dark:text-stone-100">{sp.name}</span>
                            <span className="text-[8px] text-stone-500 uppercase">{sp.role}</span>
                         </div>
                       ))}
                    </div>
                 </motion.div>
             ) : (
                 <div className="flex flex-col items-center justify-center h-full text-stone-400">
                    <div className="flex gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-fusion-bolt animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-fusion-bolt animate-pulse delay-75" />
                        <div className="w-1.5 h-1.5 rounded-full bg-fusion-bolt animate-pulse delay-150" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                      Inspect District Topology
                    </span>
                 </div>
             )}
        </AnimatePresence>
      </div>
    </div>
  );
};
