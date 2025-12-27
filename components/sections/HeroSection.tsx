
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useMemo } from 'react';
import { motion, MotionValue, useTransform, useSpring } from 'framer-motion';
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
 * and an interactive 3D background scene. Refactored for physics-based 
 * scroll smoothing and integrated animation control.
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
  /**
   * Integrated Animation Controller
   * We apply a spring to the raw scroll progress to smooth out hardware jitters
   * and create a luxurious, inertia-based parallax effect.
   * Calibrated for a "heavier" and smoother cinematic feel.
   */
  const smoothProgress = useSpring(heroProgress, {
    stiffness: 45,
    damping: 22,
    restDelta: 0.001
  });

  // Sophisticated multi-layered text parallax for maximum spatial depth perception
  // Values are calibrated to create a pronounced feeling of floating layers moving at different physical planes.
  // Front-to-back layers are assigned varying speeds and blurs to simulate focal depth.
  
  const tagline = {
    y: useTransform(smoothProgress, [0, 1], ["0%", "320%"]),
    opacity: useTransform(smoothProgress, [0, 0.2], [1, 0]),
    rotateX: useTransform(smoothProgress, [0, 1], [0, 15])
  };
  
  const title = {
    y: useTransform(smoothProgress, [0, 1], ["0%", "180%"]),
    scale: useTransform(smoothProgress, [0, 0.7], [1, 1.25]),
    opacity: useTransform(smoothProgress, [0, 0.8], [1, 0]),
    filter: useTransform(smoothProgress, [0, 0.6], ["blur(0px)", "blur(20px)"])
  };
  
  const desc = {
    y: useTransform(smoothProgress, [0, 1], ["0%", "100%"]),
    opacity: useTransform(smoothProgress, [0, 0.7], [1, 0]),
    scale: useTransform(smoothProgress, [0, 1], [1, 0.9]),
    filter: useTransform(smoothProgress, [0.1, 0.7], ["blur(0px)", "blur(18px)"])
  };
  
  const cta = {
    y: useTransform(smoothProgress, [0, 1], ["0%", "50%"]),
    scale: useTransform(smoothProgress, [0, 0.5], [1, 0.75]),
    opacity: useTransform(smoothProgress, [0, 0.5], [1, 0]),
    filter: useTransform(smoothProgress, [0.2, 0.6], ["blur(0px)", "blur(10px)"])
  };

  return (
    <header ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-50 dark:bg-stone-950">
      {/* 3D Background Layer */}
      <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-stone-100 dark:bg-stone-900 animate-pulse" />}>
          <HeroScene scrollYProgress={heroProgress} />
        </Suspense>
      </motion.div>
      
      {/* Decorative Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-stone-50/10 to-stone-50 dark:via-stone-950/20 dark:to-stone-950" />
      
      {/* Parallax Text Content */}
      <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container px-6 mx-auto text-center perspective-1000">
        
        <motion.div style={tagline}>
          <FadeIn direction="none">
            <span className="inline-block px-6 py-2.5 border border-nobel-gold/40 text-nobel-gold text-[11px] tracking-[0.6em] uppercase font-bold rounded-full mb-12 backdrop-blur-md shadow-2xl bg-white/5">
              {content.tagline}
            </span>
          </FadeIn>
        </motion.div>
        
        <motion.div style={title}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl lg:text-[10.5rem] font-serif font-medium leading-none mb-12 tracking-tighter text-stone-900 dark:text-stone-50"
          >
            {content.title}
            <span className="block mt-10 text-4xl md:text-6xl lg:text-7xl font-normal italic text-stone-500 dark:text-stone-400">
              {content.subtitle}
            </span>
          </motion.h1>
        </motion.div>
        
        <motion.div style={desc}>
          <FadeIn delay={0.4} className="max-w-4xl mx-auto mb-20">
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-stone-600 dark:text-stone-300 leading-relaxed tracking-tight">
              {content.description}
            </p>
          </FadeIn>
        </motion.div>
        
        <motion.div style={cta}>
          <FadeIn delay={0.7}>
            <button 
              onClick={scrollToSection(nextSectionId)}
              className="inline-flex flex-col items-center gap-8 text-[11px] font-bold tracking-[0.5em] text-stone-400 hover:text-nobel-gold transition-all group focus:outline-none"
              aria-label={`Scroll to ${nextSectionId}`}
            >
              <span className="uppercase">Initiate Deep Scan</span>
              <motion.div 
                animate={{ y: [0, 12, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="p-6 border rounded-full border-stone-200 dark:border-stone-800 group-hover:border-nobel-gold group-hover:shadow-[0_0_45px_rgba(197,160,89,0.35)] transition-all bg-white/5 dark:bg-stone-900/20 backdrop-blur-md"
              >
                <ArrowDown size={28} strokeWidth={1.5} />
              </motion.div>
            </button>
          </FadeIn>
        </motion.div>
      </motion.div>
    </header>
  );
};
