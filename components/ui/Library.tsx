
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, useRef, useState, ReactNode, ErrorInfo, useMemo } from 'react';
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
}

/** Production-grade Error Boundary with custom fallback support */
/**
 * Fix: Explicitly use Component from the named import and declare state/props 
 * properties to resolve property-not-found errors in the compilation environment.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicit declarations to ensure the compiler recognizes these properties
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Initializing properties inherited from Component
    this.props = props;
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical Runtime Error:", error, errorInfo);
  }

  public render() {
    /** 
     * Accessing props and state which are now explicitly recognized by the compiler.
     */
    const { fallback, children } = this.props;

    if (this.state.hasError) {
      return fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-12 text-center bg-stone-50 dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800" role="alert">
          <h3 className="font-serif text-3xl mb-4 text-stone-900 dark:text-stone-100">Architectural Fault</h3>
          <p className="text-stone-600 dark:text-stone-400 max-w-md">The rendering engine encountered an unexpected state. Please refresh the platform dashboard.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-nobel-gold transition-colors"
          >
            Reload Dashboard
          </button>
        </div>
      );
    }
    
    return children;
  }
}

/** Accessible Tooltip with smart positioning and Framer Motion animations */
export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = "", position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionMap = {
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2"
  };

  return (
    <div 
      className={`relative inline-flex flex-col items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="tooltip"
      aria-expanded={isVisible}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute ${positionMap[position]} px-4 py-3 bg-stone-900/95 dark:bg-stone-800/95 backdrop-blur-md text-stone-100 text-[11px] font-medium leading-relaxed rounded-xl shadow-2xl z-[100] min-w-[200px] max-w-[300px] border border-stone-700/50 pointer-events-none`}
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-stone-900/95 dark:border-t-stone-800/95" />
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
  
  const yOffset = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const springY = useSpring(yOffset, { stiffness: 60, damping: 25 });
  
  const themeStyles = useMemo(() => ({
    light: "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100",
    dark: "bg-stone-950 text-stone-100",
    accent: "bg-nobel-gold/5 dark:bg-nobel-gold/[0.02] text-stone-900 dark:text-stone-100"
  }), []);

  return (
    <section 
      id={id} 
      ref={containerRef} 
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-1000 ${themeStyles[variant]} ${className}`}
      aria-label={ariaLabel || id}
    >
      <motion.div style={{ y: springY }} className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-nobel-gold/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-stone-400/10 to-transparent rounded-full blur-[120px]" />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </section>
  );
};

/** Smooth reveal component for viewport entry animations */
export const FadeIn: React.FC<BaseProps & { delay?: number; direction?: 'up' | 'down' | 'none' }> = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** Presentational card for governance stakeholders */
export const AuthorCard: React.FC<AuthorCardProps> = ({ name, role, index }) => (
  <motion.article 
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="flex flex-col items-center p-10 bg-white dark:bg-stone-800/40 backdrop-blur-md rounded-3xl border border-stone-200 dark:border-stone-700/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full max-w-xs text-center group"
  >
    <div className="w-16 h-16 rounded-2xl bg-nobel-gold/10 flex items-center justify-center text-nobel-gold font-serif text-2xl mb-6 transition-transform group-hover:scale-110">
      {name.charAt(0)}
    </div>
    <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mb-2">{name}</h3>
    <div className="w-8 h-0.5 bg-nobel-gold/40 mb-4 group-hover:w-16 transition-all duration-500" />
    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 leading-relaxed">
      {role}
    </p>
  </motion.article>
);
