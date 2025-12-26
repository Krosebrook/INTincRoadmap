
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, MousePointer2, Target, Globe, Calendar } from 'lucide-react';
import { FadeIn, ParallaxSection, Container, Tooltip } from '../ui/Library';
import { SectionContent, RoadmapStep } from '../../types';

export const RoadmapSection: React.FC<{ content: SectionContent }> = ({ content }) => {
  const [activeFilter, setActiveFilter] = useState<string | 'All'>('All');
  const categories = ['All', 'Core', 'Intelligence', 'Connectivity', 'UX'];

  const filteredSteps = useMemo(() => {
    if (activeFilter === 'All') return content.steps || [];
    return (content.steps || []).filter(s => s.category === activeFilter);
  }, [activeFilter, content.steps]);

  return (
    <ParallaxSection id={content.id} variant="accent">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <FadeIn>
            <div className="text-xs font-bold tracking-[0.4em] uppercase text-fusion-bolt mb-6">{content.tagline}</div>
            <h2 className="text-5xl md:text-7xl font-serif text-stone-900 dark:text-stone-50 leading-tight">
              Architectural <span className="italic">Evolution</span>
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-2 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md p-2 rounded-2xl border border-stone-200 dark:border-stone-800">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeFilter === cat 
                      ? 'bg-fusion-bolt text-white shadow-lg' 
                      : 'text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSteps.map((step, idx) => (
              <RoadmapCard key={step.title} step={step} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </ParallaxSection>
  );
};

const RoadmapCard: React.FC<{ step: RoadmapStep; index: number }> = ({ step, index }) => {
  const Icon = useMemo(() => {
    switch (step.category) {
      case 'Intelligence': return Zap;
      case 'Connectivity': return Activity;
      case 'UX': return MousePointer2;
      default: return Target;
    }
  }, [step.category]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="group relative bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 hover:border-fusion-bolt/50 transition-all hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-400 group-hover:bg-fusion-bolt group-hover:text-white transition-all">
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
          <Calendar size={12} className="text-stone-400" />
          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-300 uppercase tracking-widest">{step.quarter}</span>
        </div>
      </div>
      <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-3 group-hover:text-fusion-bolt transition-colors">{step.title}</h4>
      <p className="text-sm text-stone-500 dark:text-stone-400 font-light leading-relaxed flex-grow">{step.desc}</p>
    </motion.div>
  );
};
