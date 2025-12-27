
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useSpring, useTransform, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Tooltip } from '../ui/Library';
import { COST_TIERS } from '../../data/content';
import { TrendingDown, ChevronRight, BarChart3, ShieldCheck } from 'lucide-react';

/** 
 * High-performance spring-based count up for financial data.
 * Uses Framer Motion's useTransform for smooth frame-by-frame interpolation.
 */
const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const spring = useSpring(0, { bounce: 0, duration: 2500, stiffness: 45, damping: 20 });
  const displayValue = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{displayValue}</motion.span>;
};

/**
 * CostAnalysisDiagram Component
 * 
 * Premium financial visualization component for enterprise platform costs.
 * Synchronizes a linear metric list with a radial donut chart using shared hover states.
 */
export const CostAnalysisDiagram: React.FC = () => {
    const [activeTier, setActiveTier] = useState<number | null>(null);
    
    // Audit Logic: Safe calculation for total cost to prevent division by zero edge cases
    const totalCost = useMemo(() => {
      const sum = COST_TIERS.reduce((acc, curr) => acc + curr.cost, 0);
      return sum > 0 ? sum : 1; // Fallback to 1 to avoid NaN
    }, []);

    // Donut SVG constants
    const RADIUS = 40;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    const handleHover = useCallback((id: number | null) => {
      setActiveTier(id);
    }, []);

    const selectedTierData = useMemo(() => 
      COST_TIERS.find(t => t.id === activeTier), [activeTier]);

    return (
      <LayoutGroup>
        <div className="flex flex-col lg:flex-row items-stretch gap-16 p-12 md:p-24 my-16 border border-stone-800 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] bg-stone-950 text-stone-100 rounded-[6rem] overflow-hidden relative group/metrics">
            
            {/* Immersive Background Mesh */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
               <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-nobel-gold/40 to-transparent blur-[180px] rounded-full"
               />
               <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tr from-fusion-bolt/30 to-transparent blur-[200px] rounded-full"
               />
            </div>
            
            <div className="flex-1 w-full relative z-10 flex flex-col justify-between">
                <header className="mb-20">
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-6 mb-8"
                  >
                    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl text-nobel-gold shadow-4xl border border-white/10 ring-1 ring-nobel-gold/20">
                      <TrendingDown size={36} />
                    </div>
                    <div>
                      <span className="text-[13px] font-black uppercase tracking-[0.6em] text-nobel-gold mb-1 block">Capital Distribution</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Audited Q1 2025</span>
                      </div>
                    </div>
                  </motion.div>
                  <h3 className="text-6xl md:text-[5.5rem] font-serif font-bold text-white mb-10 leading-[0.9] tracking-tighter">
                      Stack Economics
                  </h3>
                  <div className="flex items-center gap-8 border-l-2 border-nobel-gold/30 pl-10 py-2">
                    <p className="text-stone-400 text-3xl leading-relaxed font-light">
                      Platform baseline: <span className="text-white font-black italic">$<CountUp value={totalCost} />k</span> /yr
                    </p>
                    <ShieldCheck className="text-emerald-500/40" size={32} />
                  </div>
                </header>

                <div className="space-y-12" role="list">
                    {COST_TIERS.map((tier, idx) => {
                         const isSelected = activeTier === tier.id;
                         return (
                           <motion.div 
                              key={tier.id} 
                              className="relative cursor-pointer group/tier"
                              onMouseEnter={() => handleHover(tier.id)}
                              onMouseLeave={() => handleHover(null)}
                              onFocus={() => handleHover(tier.id)}
                              onBlur={() => handleHover(null)}
                              role="listitem"
                              initial={{ opacity: 0, x: -50 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1, duration: 0.8, ease: "circOut" }}
                           >
                              <div className="flex justify-between items-end mb-5">
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-4">
                                      <motion.div 
                                          animate={isSelected ? { scale: 1.4, rotate: 90, color: "#C5A059" } : { scale: 1, rotate: 0, color: "#555" }}
                                          className="transition-all duration-500"
                                      >
                                          <ChevronRight size={20} />
                                      </motion.div>
                                      <span className={`text-lg font-black uppercase tracking-[0.4em] transition-all duration-700 ${isSelected ? "text-nobel-gold translate-x-4" : "text-stone-500"}`}>
                                          {tier.label}
                                      </span>
                                    </div>
                                    <AnimatePresence>
                                      {isSelected && (
                                        <motion.div 
                                          initial={{ opacity: 0, x: -10 }} 
                                          animate={{ opacity: 1, x: 0 }} 
                                          exit={{ opacity: 0, x: 10 }}
                                          className="text-[15px] text-stone-400 font-light italic max-w-sm pl-11 leading-relaxed border-l border-nobel-gold/20"
                                        >
                                          {tier.desc}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  <div className="text-right">
                                    <span className={`font-serif text-5xl md:text-6xl transition-all duration-700 block ${isSelected ? "text-white scale-110" : "text-stone-400"}`}>
                                      $<CountUp value={tier.cost} />k
                                    </span>
                                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mt-1 block">Allocated</span>
                                  </div>
                              </div>
                              <div className="w-full h-8 overflow-hidden rounded-2xl bg-stone-900/40 border border-stone-800/50 p-1.5 relative transition-all duration-700 shadow-inner">
                                  <motion.div 
                                      className={`h-full rounded-xl ${tier.color} relative shadow-2xl`}
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${(tier.cost / totalCost) * 100}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 2, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
                                  >
                                    <motion.div 
                                      className="absolute inset-0 bg-white/20 blur-xl rounded-full"
                                      animate={{ x: ['-200%', '200%'] }}
                                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    />
                                    <AnimatePresence>
                                      {isSelected && (
                                        <motion.div 
                                          layoutId="active-bar-flare"
                                          className="absolute inset-y-0 right-0 w-24 bg-white/40 blur-2xl rounded-full"
                                        />
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                              </div>
                           </motion.div>
                         );
                    })}
                </div>
            </div>
            
            <div className="relative flex items-center justify-center p-20 border border-stone-800 bg-stone-900/30 backdrop-blur-4xl shrink-0 w-full lg:w-[500px] h-[720px] rounded-[5.5rem] shadow-5xl group/chart overflow-hidden">
                 {/* Visual Orbitals */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-16 rounded-full border border-dashed border-nobel-gold/15 pointer-events-none" 
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-24 rounded-full border border-dotted border-stone-800/60 pointer-events-none" 
                 />

                 <div className="relative w-96 h-96">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                        {COST_TIERS.map((tier, i) => {
                            const offsetValue = COST_TIERS.slice(0, i).reduce((acc, t) => acc + t.cost, 0);
                            const offsetPercent = (offsetValue / totalCost) * 100;
                            const segmentLength = (tier.cost / totalCost) * CIRCUMFERENCE;
                            const dashOffset = -((offsetPercent / 100) * CIRCUMFERENCE);
                            const isSelected = activeTier === tier.id;

                            return (
                                <Tooltip key={tier.id} content={`${tier.label}: $${tier.cost}k`}>
                                    <motion.circle
                                        cx="50" cy="50" r={RADIUS}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={isSelected ? 22 : 16}
                                        strokeLinecap="round"
                                        className={`${tier.color} transition-all duration-1000 cursor-pointer`}
                                        style={{ color: tier.color }}
                                        
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2.5, delay: i * 0.15, ease: "circOut" }}
                                        
                                        strokeDasharray={`${segmentLength} ${CIRCUMFERENCE}`}
                                        strokeDashoffset={dashOffset}
                                        
                                        onMouseEnter={() => handleHover(tier.id)}
                                        onMouseLeave={() => handleHover(null)}
                                        
                                        animate={{
                                          strokeWidth: isSelected ? 26 : 16,
                                          scale: isSelected ? 1.08 : 1,
                                          filter: isSelected ? 'brightness(1.3) drop-shadow(0 0 20px currentColor)' : 'none'
                                        }}
                                    />
                                </Tooltip>
                            );
                        })}
                    </svg>
                    
                    {/* Central Value Engine */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={activeTier ?? 'total'}
                            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="flex flex-col items-center text-center px-10"
                          >
                            <span className="text-8xl font-serif font-black text-white tracking-tighter drop-shadow-4xl">
                              $<CountUp value={activeTier ? (selectedTierData?.cost ?? totalCost) : totalCost} />k
                            </span>
                            <motion.div 
                              layoutId="center-divider"
                              className="w-24 h-1 bg-nobel-gold/50 my-10 shadow-[0_0_25px_rgba(197,160,89,0.8)] rounded-full" 
                            />
                            <motion.span 
                              layoutId="center-label"
                              className="text-[13px] font-black text-stone-500 uppercase tracking-[0.5em] leading-tight"
                            >
                              {activeTier ? selectedTierData?.label : 'Enterprise Baseline'}
                            </motion.span>
                          </motion.div>
                        </AnimatePresence>
                    </div>
                 </div>

                 <div className="absolute inset-12 rounded-[5.5rem] border-2 border-stone-800/30 pointer-events-none shadow-inner" />
            </div>
        </div>
      </LayoutGroup>
    )
}
