
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { FadeIn } from '../ui/Library';
import { SectionContent } from '../../types';

// Lazy-loaded visual assets for performance
const HeroScene = React.lazy(() => import('../QuantumScene').then(m => ({ default: m.HeroScene })));

interface HeroSectionProps {
  /** Reference to the hero container for scroll tracking */
  heroRef: React.RefObject<HTMLDivElement | null>;
  /** Motion value for vertical parallax offset of the background scene */
  heroY: MotionValue<string>;
  /** Motion value for fading out entire content on scroll */
  heroOpacity: MotionValue<number>;
  /** Raw scroll progress value for the 3D scene and text layers */
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
 * Handles the initial landing experience with multi-layered parallax text 
 * and an interactive 3D background scene.
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
  // Sophisticated multi-layered text parallax for maximum spatial depth perception
  // Values are calibrated to create a feeling of floating layers moving at different physical planes
  const taglineY = useTransform(heroProgress, [0, 1], ["0%", "120%"]);
  const titleY = useTransform(heroProgress, [0, 1], ["0%", "80%"]);
  const titleScale = useTransform(heroProgress, [0, 0.5], [1, 1.05]);
  const descY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const ctaY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);

  return (
    <header ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background Layer */}
      <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-stone-100 dark:bg-stone-900 animate-pulse" />}>
          <HeroScene scrollYProgress={heroProgress} />
        </Suspense>
      </motion.div>
      
      {/* Decorative Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-stone-50/10 to-stone-50 dark:via-stone-950/10 dark:to-stone-950" />
      
      {/* Parallax Text Content */}
      <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container px-6 mx-auto text-center">
        
        <motion.div style={{ y: taglineY }}>
          <FadeIn direction="none">
            <span className="inline-block px-5 py-2 border border-nobel-gold/40 text-nobel-gold text-[11px] tracking-[0.5em] uppercase font-bold rounded-full mb-10 backdrop-blur-md shadow-2xl">
              {content.tagline}
            </span>
          </FadeIn>
        </motion.div>
        
        <motion.div style={{ y: titleY, scale: titleScale }}>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-8xl md:text-9xl lg:text-[10rem] font-serif font-medium leading-none mb-10 tracking-tighter text-stone-900 dark:text-stone-50"
          >
            {content.title}
            <span className="block mt-8 text-4xl md:text-6xl lg:text-7xl font-normal italic text-stone-500 dark:text-stone-400">
              {content.subtitle}
            </span>
          </motion.h1>
        </motion.div>
        
        <motion.div style={{ y: descY }}>
          <FadeIn delay={0.4} className="max-w-3xl mx-auto mb-20">
            <p className="text-xl md:text-2xl font-light text-stone-600 dark:text-stone-300 leading-relaxed">
              {content.description}
            </p>
          </FadeIn>
        </motion.div>
        
        <motion.div style={{ y: ctaY }}>
          <FadeIn delay={0.6}>
            <button 
              onClick={scrollToSection(nextSectionId)}
              className="inline-flex flex-col items-center gap-6 text-[12px] font-bold tracking-[0.4em] text-stone-400 hover:text-nobel-gold transition-all group focus:outline-none"
              aria-label={`Scroll to ${nextSectionId}`}
            >
              <span className="uppercase">Initiate Deep Scan</span>
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="p-5 border rounded-full border-stone-200 dark:border-stone-800 group-hover:border-nobel-gold group-hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all bg-white/5 dark:bg-stone-900/5 backdrop-blur-sm"
              >
                <ArrowDown size={24} />
              </motion.div>
            </button>
          </FadeIn>
        </motion.div>
      </motion.div>
    </header>
  );
};
