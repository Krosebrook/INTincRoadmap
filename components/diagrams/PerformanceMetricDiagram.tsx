
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Tooltip } from '../ui/Library';
import { COST_TIERS } from '../../data/content';

// CountUp Component
const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const spring = useSpring(0, { bounce: 0, duration: 1500 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

export const CostAnalysisDiagram: React.FC = () => {
    const [activeTier, setActiveTier] = useState<number | null>(null);
    const total = COST_TIERS.reduce((acc, curr) => acc + curr.cost, 0);

    // Donut chart config
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex flex-col items-center gap-8 p-8 my-8 transition-colors duration-500 border shadow-lg md:flex-row bg-stone-900 dark:bg-black text-stone-100 rounded-xl border-stone-800">
            <div className="flex-1 min-w-[240px] w-full">
                <h3 className="flex items-center gap-2 mb-2 text-xl font-serif text-nobel-gold">
                    Investment Analysis
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-stone-400">
                    Total estimated annual investment of <strong>$<CountUp value={total} />k</strong> optimizes for scalability from 50 to 500 employees.
                </p>
                <div className="mt-6 space-y-3" role="list">
                    {COST_TIERS.map((tier) => (
                         <motion.div 
                            key={tier.id} 
                            className="relative cursor-pointer group"
                            onMouseEnter={() => setActiveTier(tier.id)}
                            onMouseLeave={() => setActiveTier(null)}
                            onFocus={() => setActiveTier(tier.id)}
                            onBlur={() => setActiveTier(null)}
                            role="listitem"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: tier.id * 0.1 }}
                         >
                            <div className="flex justify-between mb-1 text-xs">
                                <span className={`transition-colors duration-300 ${activeTier === tier.id ? "text-white font-bold" : "text-stone-400"}`}>{tier.label}</span>
                                <span className="font-mono text-stone-500">$<CountUp value={tier.cost} />k</span>
                            </div>
                            <div className="w-full h-2 overflow-hidden rounded-full bg-stone-800">
                                <motion.div 
                                    className={`h-full rounded-full ${tier.color}`}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(tier.cost / 250) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                                />
                            </div>
                            {/* Hover Details */}
                            {activeTier === tier.id && (
                                <motion.div 
                                    layoutId="desc"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute left-0 font-mono text-[10px] -bottom-5 text-nobel-gold whitespace-nowrap"
                                >
                                    Includes: {tier.desc}
                                </motion.div>
                            )}
                         </motion.div>
                    ))}
                </div>
            </div>
            
            <div className="relative flex items-center justify-center p-6 border rounded-xl w-64 h-72 border-stone-700/50 bg-stone-900/50 shrink-0">
                 {/* Donut Chart Representation */}
                 <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {COST_TIERS.map((tier, i) => {
                            // Calculate cumulative offset
                            const offsetValue = COST_TIERS.slice(0, i).reduce((acc, t) => acc + t.cost, 0);
                            const offsetPercent = (offsetValue / total) * 100;
                            
                            // Calculate dash array (length of this segment)
                            const segmentLength = (tier.cost / total) * circumference;
                            
                            // Calculate dash offset (starting position)
                            const dashOffset = -((offsetPercent / 100) * circumference);

                            return (
                                <Tooltip key={tier.id} content={`${tier.label}: $${tier.cost}k`}>
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        className={`${tier.color} hover:opacity-80 cursor-pointer`}
                                        
                                        // Animation props
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                                        
                                        // Static props that define position
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-2xl font-bold font-serif text-white flex">
                                $<CountUp value={total} />k
                            </span>
                            <span className="text-[10px] text-stone-500 uppercase tracking-widest">Est. Annual</span>
                        </motion.div>
                    </div>
                 </div>
            </div>
        </div>
    )
}
