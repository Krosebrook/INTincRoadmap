
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { motion, MotionValue } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { FadeIn } from '../ui/Library';
import { SectionContent } from '../../types';

// Lazy-loaded visual assets
const HeroScene = React.lazy(() => import('../QuantumScene').then(m => ({ default: m.HeroScene })));

interface HeroSectionProps {
  /** Reference to the hero container for scroll tracking */
  heroRef: React.RefObject<HTMLDivElement | null>;
  /** Motion value for vertical parallax offset */
  heroY: MotionValue<string>;
  /** Motion value for fading out content on scroll */
  heroOpacity: MotionValue<number>;
  /** Raw scroll progress value for the 3D scene */
  heroProgress: MotionValue<number>;
  /** Content data for titles and descriptions */
  content: SectionContent;
  /** ID of the next section to scroll to */
  nextSectionId: string;
  /** Callback to trigger smooth scroll */
  scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

/**
 * HeroSection Component
 * 
 * Handles the initial landing view, including the interactive 3D HeroScene
 * and the primary call-to-action for navigating deep into the architecture.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  heroRef,
  heroY,
  heroOpacity,
  heroProgress,
  content,
  nextSectionId,
  scrollToSection
}) => {
  return (
    <header ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-stone-100 dark:bg-stone-900 animate-pulse" />}>
          <HeroScene scrollYProgress={heroProgress} />
        </Suspense>
      </motion.div>
      
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-stone-50/10 to-stone-50 dark:via-stone-950/10 dark:to-stone-950" />
      
      <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container px-6 mx-auto text-center">
        <FadeIn direction="none">
          <span className="inline-block px-4 py-1.5 border border-nobel-gold/40 text-nobel-gold text-[10px] tracking-[0.4em] uppercase font-bold rounded-full mb-8 backdrop-blur-md">
            {content.tagline}
          </span>
        </FadeIn>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-9xl font-serif font-medium leading-none mb-8 tracking-tight text-stone-900 dark:text-stone-50"
        >
          {content.title}
          <span className="block mt-6 text-3xl md:text-5xl lg:text-6xl font-normal italic text-stone-500 dark:text-stone-400">
            {content.subtitle}
          </span>
        </motion.h1>
        
        <FadeIn delay={0.3} className="max-w-2xl mx-auto mb-16">
          <p className="text-lg md:text-xl font-light text-stone-600 dark:text-stone-300 leading-relaxed">
            {content.description}
          </p>
        </FadeIn>
        
        <FadeIn delay={0.5}>
          <button 
            onClick={scrollToSection(nextSectionId)}
            className="inline-flex flex-col items-center gap-4 text-[11px] font-bold tracking-[0.3em] text-stone-400 hover:text-nobel-gold transition-all group"
            aria-label={`Scroll to ${nextSectionId}`}
          >
            <span className="uppercase">Explore Architecture</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="p-4 border rounded-full border-stone-200 dark:border-stone-800 group-hover:border-nobel-gold group-hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all"
            >
              <ArrowDown size={20} />
            </motion.div>
          </button>
        </FadeIn>
      </motion.div>
    </header>
  );
};
