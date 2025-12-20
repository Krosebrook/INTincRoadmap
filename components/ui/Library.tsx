
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, useRef, useState, ReactNode, ErrorInfo, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { BaseProps, TooltipProps, SectionProps, AuthorCardProps } from '../../types';

/** Standard container for consistent horizontal padding and max-width */
export const Container: React.FC<BaseProps> = ({ children, className = "" }) => (
  <div className={`container px-6 mx-auto ${className}`}>
    {children}
  </div>
);

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/** 
 * Production-grade Error Boundary 
 * Catches rendering crashes in 3D scenes or complex diagrams.
 */
// Fix: Explicitly use React.Component to ensure props and setState are correctly inherited and recognized by the TypeScript compiler.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('Architectural Fault Detected');
    console.error("Error:", error);
    console.error("Info:", errorInfo);
    console.groupEnd();
  }

  public render() {
    // Accessing this.props through React.Component base class
    const { fallback, children } = this.props;

    if (this.state.hasError) {
      return fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-12 text-center bg-stone-50 dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800" role="alert">
          <h3 className="font-serif text-3xl mb-4 text-stone-900 dark:text-stone-100">System Integrity Fault</h3>
          <p className="text-stone-600 dark:text-stone-400 max-w-md">The platform visualization engine encountered an unexpected state. This usually occurs during complex 3D rendering cycles.</p>
          <button 
            // Accessing this.setState through React.Component base class
            onClick={() => this.setState({ hasError: false })}
            className="mt-8 px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-nobel-gold transition-colors"
          >
            Re-initialize Dashboard
          </button>
        </div>
      );
    }
    
    return children;
  }
}

/** Accessible Tooltip with smart positioning and Framer Motion animations */
export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  className = "", 
  position = "top",
  delay = 100 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  
  const show = () => {
    timeoutRef.current = window.setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const positionMap = useMemo(() => ({
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-y-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2"
  }), []);

  return (
    <div 
      className={`relative inline-flex flex-col items-center ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={0}
      role="tooltip"
      aria-expanded={isVisible}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute ${positionMap[position]} px-4 py-3 bg-stone-900/95 dark:bg-stone-800/95 backdrop-blur-md text-stone-100 text-[11px] font-medium leading-relaxed rounded-xl shadow-2xl z-[100] min-w-[200px] max-w-[300px] border border-stone-700/50 pointer-events-none`}
          >
            {content}
            <div className={`absolute border-[6px] border-transparent ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-stone-900/95 dark:border-t-stone-800/95' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-stone-900/95 dark:border-b-stone-800/95' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-stone-900/95 dark:border-l-stone-800/95' :
              'right-full top-1/2 -translate-y-1/2 border-r-stone-900/95 dark:border-r-stone-800/95'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

/** High-performance parallax container using Framer Motion scroll tracking */
export const ParallaxSection: React.FC<SectionProps> = ({ children, id, className = "", variant = "light", ariaLabel }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  const yOffset = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const springY = useSpring(yOffset, { stiffness: 45, damping: 20 });
  
  const themeStyles = useMemo(() => ({
    light: "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100",
    dark: "bg-stone-950 text-stone-100",
    accent: "bg-nobel-gold/5 dark:bg-nobel-gold/[0.02] text-stone-900 dark:text-stone-100"
  }), []);

  return (
    <section 
      id={id} 
      ref={containerRef} 
      className={`relative py-24 md:py-40 overflow-hidden transition-colors duration-1000 ${themeStyles[variant]} ${className}`}
      aria-label={ariaLabel || id}
    >
      <motion.div style={{ y: springY }} className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-10">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-nobel-gold/15 to-transparent rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-stone-400/15 to-transparent rounded-full blur-[140px]" />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </section>
  );
};

/** Smooth reveal component for viewport entry animations */
export const FadeIn: React.FC<BaseProps & { delay?: number; direction?: 'up' | 'down' | 'none' }> = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** Presentational card for governance stakeholders */
export const AuthorCard: React.FC<AuthorCardProps> = ({ name, role, index }) => (
  <motion.article 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.12, ease: "easeOut" }}
    className="flex flex-col items-center p-12 bg-white dark:bg-stone-800/30 backdrop-blur-xl rounded-[2.5rem] border border-stone-200 dark:border-stone-700/50 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 w-full text-center group"
  >
    <div className="w-20 h-20 rounded-3xl bg-nobel-gold/10 flex items-center justify-center text-nobel-gold font-serif text-3xl mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner">
      {name.charAt(0)}
    </div>
    <h3 className="font-serif text-3xl text-stone-900 dark:text-stone-100 mb-3">{name}</h3>
    <div className="w-10 h-0.5 bg-nobel-gold/30 mb-6 group-hover:w-20 transition-all duration-700" />
    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400 leading-relaxed group-hover:text-nobel-gold transition-colors">
      {role}
    </p>
  </motion.article>
);
