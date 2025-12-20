
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Tooltip } from '../ui/Library';
import { COST_TIERS } from '../../data/content';
import { TrendingDown, ChevronRight, BarChart3 } from 'lucide-react';

/** 
 * High-performance spring-based count up for financial data.
 * Uses Framer Motion's useTransform for smooth frame-by-frame interpolation.
 */
const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const spring = useSpring(0, { bounce: 0, duration: 2500, stiffness: 40, damping: 18 });
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

    return (
        <div className="flex flex-col lg:flex-row items-center gap-20 p-14 md:p-28 my-16 border border-stone-800 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] bg-stone-950 text-stone-100 rounded-[5rem] overflow-hidden relative group/metrics">
            
            {/* Ambient Lighting Layer */}
            <div className="absolute -top-1/3 -right-1/4 w-[900px] h-[900px] bg-nobel-gold/10 rounded-full blur-[220px] pointer-events-none opacity-40 group-hover/metrics:opacity-80 transition-opacity duration-[3000ms]" />
            
            <div className="flex-1 w-full relative z-10">
                <header className="mb-24">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-6 mb-10"
                  >
                    <div className="p-4 rounded-2xl bg-nobel-gold/20 text-nobel-gold shadow-3xl border border-nobel-gold/20">
                      <TrendingDown size={32} />
                    </div>
                    <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-nobel-gold">Global Investment Portfolio</span>
                  </motion.div>
                  <h3 className="text-6xl md:text-8xl font-serif font-bold text-white mb-12 leading-[1.05] tracking-tight">
                      Stack Economics
                  </h3>
                  <p className="text-stone-400 text-3xl leading-relaxed font-light max-w-2xl border-l-[1px] border-stone-800 pl-10">
                      Optimized for a <span className="text-white font-bold">$<CountUp value={totalCost} />k</span> annual baseline, ensuring federated system integrity.
                  </p>
                </header>

                <div className="space-y-14" role="list">
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
                              initial={{ opacity: 0, x: -40 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                           >
                              <div className="flex justify-between items-end mb-6">
                                  <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                      <motion.div 
                                          animate={isSelected ? { scale: 1.5, rotate: 90, color: "#C5A059" } : { scale: 1, rotate: 0, color: "#444" }}
                                          className="transition-all"
                                      >
                                          <ChevronRight size={18} />
                                      </motion.div>
                                      <span className={`text-[16px] font-bold uppercase tracking-[0.4em] transition-all duration-700 ${isSelected ? "text-nobel-gold translate-x-4" : "text-stone-500"}`}>
                                          {tier.label}
                                      </span>
                                    </div>
                                    <AnimatePresence>
                                      {isSelected && (
                                        <motion.span 
                                          initial={{ opacity: 0, height: 0, y: -5 }} 
                                          animate={{ opacity: 1, height: 'auto', y: 0 }} 
                                          exit={{ opacity: 0, height: 0, y: -5 }}
                                          className="text-base text-stone-400 font-light italic max-w-md pl-10 leading-relaxed"
                                        >
                                          {tier.desc}
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  <span className={`font-serif text-5xl transition-all duration-700 ${isSelected ? "text-white scale-110 tracking-tight" : "text-stone-400"}`}>
                                    $<CountUp value={tier.cost} />k
                                  </span>
                              </div>
                              <div className="w-full h-6 overflow-hidden rounded-full bg-stone-900/60 border border-stone-800/60 p-1 relative transition-all duration-700 shadow-inner">
                                  <motion.div 
                                      className={`h-full rounded-full ${tier.color} relative shadow-[0_0_20px_rgba(0,0,0,0.6)]`}
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${(tier.cost / totalCost) * 100}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 2.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                  >
                                    <AnimatePresence>
                                      {isSelected && (
                                        <motion.div 
                                          layoutId="bar-pulse-shimmer"
                                          className="absolute inset-0 bg-white/50 blur-xl rounded-full"
                                          animate={{ x: ['-100%', '100%'] }}
                                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
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
            
            <div className="relative flex items-center justify-center p-24 border-2 rounded-[6rem] w-full lg:max-w-md h-[620px] border-stone-800 bg-stone-900/50 backdrop-blur-3xl shrink-0 shadow-2xl group/chart overflow-hidden">
                 {/* Visual Energy Rings */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-10 rounded-full border border-dashed border-nobel-gold/10 pointer-events-none" 
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-16 rounded-full border border-dotted border-stone-800 pointer-events-none" 
                 />

                 <div className="relative w-80 h-80">
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
                                        strokeWidth={isSelected ? 20 : 14}
                                        strokeLinecap="round"
                                        className={`${tier.color} transition-all duration-1000 cursor-pointer`}
                                        style={{ color: tier.color }}
                                        
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 3, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                                        
                                        strokeDasharray={`${segmentLength} ${CIRCUMFERENCE}`}
                                        strokeDashoffset={dashOffset}
                                        
                                        onMouseEnter={() => handleHover(tier.id)}
                                        onMouseLeave={() => handleHover(null)}
                                        
                                        animate={{
                                          strokeWidth: isSelected ? 24 : 14,
                                          scale: isSelected ? 1.05 : 1,
                                          filter: isSelected ? 'brightness(1.2) drop-shadow(0 0 15px currentColor)' : 'none'
                                        }}
                                    />
                                </Tooltip>
                            );
                        })}
                    </svg>
                    
                    {/* Central Value Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={activeTier ?? 'total'}
                            initial={{ opacity: 0, scale: 0.85, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: -15 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col items-center text-center px-6"
                          >
                            <span className="text-7xl font-serif font-bold text-white tracking-tighter shadow-2xl">
                              $<CountUp value={activeTier ? (COST_TIERS.find(t => t.id === activeTier)?.cost ?? totalCost) : totalCost} />k
                            </span>
                            <div className="w-20 h-0.5 bg-nobel-gold/60 my-8 shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
                            <span className="text-[12px] font-bold text-stone-500 uppercase tracking-[0.5em] leading-relaxed">
                              {activeTier ? 'Segment Target' : 'Enterprise Total'}
                            </span>
                          </motion.div>
                        </AnimatePresence>
                    </div>
                 </div>

                 <div className="absolute inset-10 rounded-[5.2rem] border border-stone-800/50 pointer-events-none shadow-inner" />
            </div>
        </div>
    )
}
