
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Tooltip } from '../ui/Library';
import { COST_TIERS } from '../../data/content';
import { TrendingDown, ChevronRight } from 'lucide-react';

// CountUp Component with high-end spring physics
const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const spring = useSpring(0, { bounce: 0, duration: 2500, stiffness: 40, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

/**
 * CostAnalysisDiagram Component
 * 
 * Interactive financial overview visualizing platform investment.
 * Features bi-directional highlighting between the chart and the legend.
 */
export const CostAnalysisDiagram: React.FC = () => {
    const [activeTier, setActiveTier] = useState<number | null>(null);
    const total = useMemo(() => COST_TIERS.reduce((acc, curr) => acc + curr.cost, 0), []);

    // Donut chart path configuration
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex flex-col lg:flex-row items-center gap-16 p-12 md:p-20 my-12 transition-all duration-1000 border border-stone-800 shadow-4xl bg-stone-950 text-stone-100 rounded-[4rem] overflow-hidden relative group">
            
            {/* Ambient Animated Background Overlay */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-nobel-gold/5 rounded-full blur-[180px] pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-1500" />
            
            <div className="flex-1 w-full relative z-10">
                <header className="mb-16">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 mb-6"
                  >
                    <div className="p-3 rounded-xl bg-nobel-gold/15 text-nobel-gold shadow-lg">
                      <TrendingDown size={24} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-nobel-gold">Efficiency Audit</span>
                  </motion.div>
                  <h3 className="text-5xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
                      Financial Integrity
                  </h3>
                  <p className="text-stone-400 text-xl leading-relaxed font-light max-w-2xl">
                      Allocating <span className="text-white font-bold">$<CountUp value={total} />k</span> annually to achieve <span className="text-nobel-gold font-bold">10% OPEX</span> efficiency, benchmarking against Top-Tier consulting standards.
                  </p>
                </header>

                <div className="space-y-10" role="list">
                    {COST_TIERS.map((tier, idx) => (
                         <motion.div 
                            key={tier.id} 
                            className="relative cursor-pointer group/tier"
                            onMouseEnter={() => setActiveTier(tier.id)}
                            onMouseLeave={() => setActiveTier(null)}
                            onFocus={() => setActiveTier(tier.id)}
                            onBlur={() => setActiveTier(null)}
                            role="listitem"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, type: "spring", stiffness: 120, damping: 20 }}
                         >
                            <div className="flex justify-between items-end mb-4">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <motion.div 
                                        animate={activeTier === tier.id ? { scale: 1.5, rotate: 90 } : {}}
                                        className="text-nobel-gold opacity-0 group-hover/tier:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight size={14} />
                                    </motion.div>
                                    <span className={`text-[13px] font-bold uppercase tracking-[0.3em] transition-all duration-500 ${activeTier === tier.id ? "text-nobel-gold translate-x-2" : "text-stone-500"}`}>
                                        {tier.label}
                                    </span>
                                  </div>
                                  <AnimatePresence>
                                    {activeTier === tier.id && (
                                      <motion.span 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-[12px] text-stone-400 font-light italic max-w-sm pl-6"
                                      >
                                        {tier.desc}
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <span className={`font-serif text-3xl transition-all duration-500 ${activeTier === tier.id ? "text-white scale-110" : "text-stone-400"}`}>
                                  $<CountUp value={tier.cost} />k
                                </span>
                            </div>
                            <div className="w-full h-4 overflow-hidden rounded-full bg-stone-900 border border-stone-800/40 p-[4px] relative">
                                <motion.div 
                                    className={`h-full rounded-full ${tier.color} relative overflow-hidden`}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(tier.cost / total) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                >
                                  {activeTier === tier.id && (
                                    <motion.div 
                                      layoutId="bar-active-glow"
                                      className="absolute inset-0 bg-white/30 blur-md rounded-full"
                                      initial={{ x: '-100%' }}
                                      animate={{ x: '100%' }}
                                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                  )}
                                </motion.div>
                            </div>
                         </motion.div>
                    ))}
                </div>
            </div>
            
            <div className="relative flex items-center justify-center p-16 border-2 rounded-[4.5rem] w-full max-w-md h-[500px] border-stone-800 bg-stone-900/30 backdrop-blur-2xl shrink-0 shadow-3xl group/chart">
                 {/* High-Impact Interactive Donut Chart */}
                 <div className="relative w-72 h-72">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {COST_TIERS.map((tier, i) => {
                            const offsetValue = COST_TIERS.slice(0, i).reduce((acc, t) => acc + t.cost, 0);
                            const offsetPercent = (offsetValue / total) * 100;
                            const segmentLength = (tier.cost / total) * circumference;
                            const dashOffset = -((offsetPercent / 100) * circumference);
                            const isSelected = activeTier === tier.id;

                            return (
                                <Tooltip key={tier.id} content={`${tier.label}: $${tier.cost}k`}>
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={isSelected ? 18 : 12}
                                        className={`${tier.color} transition-all duration-700 cursor-pointer`}
                                        style={{ color: tier.color }}
                                        
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                                        
                                        strokeDasharray={`${segmentLength} ${circumference}`}
                                        strokeDashoffset={dashOffset}
                                        
                                        onMouseEnter={() => setActiveTier(tier.id)}
                                        onMouseLeave={() => setActiveTier(null)}
                                        aria-label={`${tier.label}: ${Math.round((tier.cost/total)*100)}%`}
                                    />
                                </Tooltip>
                            );
                        })}
                    </svg>
                    
                    {/* Synchronized Central Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <AnimatePresence mode="wait">
                              <motion.div 
                                key={activeTier ?? 'total'}
                                initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
                                className="flex flex-col items-center"
                              >
                                <span className="text-5xl font-serif font-bold text-white tracking-tighter shadow-nobel-gold/10">
                                  $<CountUp value={activeTier ? (COST_TIERS.find(t => t.id === activeTier)?.cost ?? total) : total} />k
                                </span>
                                <div className="w-20 h-0.5 bg-nobel-gold/50 my-4" />
                                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-[0.4em]">
                                  {activeTier ? 'Target spend' : 'Annual cap'}
                                </span>
                              </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                 </div>

                 {/* High-Detail Interactive Overlay Rings */}
                 <div className="absolute inset-6 rounded-[4rem] border border-stone-800/60 pointer-events-none" />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-10 rounded-full border border-dashed border-nobel-gold/15 pointer-events-none" 
                 />
            </div>
        </div>
    )
}
