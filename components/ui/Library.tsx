
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, ReactNode, ErrorInfo, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { BaseProps, TooltipProps, SectionProps, AuthorCardProps } from '../../types';

/** 
 * Standard container for consistent horizontal padding and max-width.
 * Essential for maintaining the "urban grid" layout.
 */
export const Container: React.FC<BaseProps> = ({ children, className = "" }) => (
  <div className={`container px-6 mx-auto ${className}`}>
    {children}
  </div>
);

interface ErrorBoundaryProps {
  children?: ReactNode;
  /** Custom fallback to display when a component crashes */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/** 
 * Production-grade Error Boundary.
 * Specifically handles Three.js context losses and Framer Motion animation crashes.
 */
// Fix: Use React.Component explicitly to ensure standard React class component property access (props, state, setState) is recognized by the compiler.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Explicitly initialize state with correct typing to satisfy the property existence check.
    this.state = {
      hasError: false
    };
  }

  /**
   * Updates state so the next render shows the fallback UI.
   */
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Records the error in the NOC console for architectural auditing.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('Architectural Fault Detected');
    console.error("Error:", error);
    console.error("Info:", errorInfo);
    console.groupEnd();
  }

  public render(): ReactNode {
    // Fix: Access props and state from the current React.Component instance.
    const { fallback, children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return fallback || (
        <div 
          className="flex flex-col items-center justify-center min-h-[400px] p-12 text-center bg-stone-50 dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800" 
          role="alert"
        >
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h3 className="font-serif text-3xl mb-4 text-stone-900 dark:text-stone-100">System Integrity Fault</h3>
          <p className="text-stone-600 dark:text-stone-400 max-w-md mb-8">
            The visualization engine encountered an unexpected state. This usually occurs during complex GPU-accelerated rendering cycles.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-fusion-bolt transition-colors shadow-lg"
          >
            Re-initialize Module
          </button>
        </div>
      );
    }
    
    return children;
  }
}

/** 
 * Accessible Tooltip with predictive positioning.
 */
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
            className={`absolute ${positionMap[position]} px-4 py-3 bg-stone-900/95 dark:bg-stone-800/95 backdrop-blur-md text-stone-100 text-[11px] font-medium leading-relaxed rounded-xl shadow-2xl z-[100] min-w-[150px] border border-stone-700/50 pointer-events-none`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

/** 
 * High-performance parallax container.
 * Uses hardware-accelerated transforms for smooth vertical depth.
 */
export const ParallaxSection: React.FC<SectionProps> = ({ children, id, className = "", variant = "light", ariaLabel }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  const yOffset = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const springY = useSpring(yOffset, { stiffness: 60, damping: 25 });
  
  const themeStyles = useMemo(() => ({
    light: "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100",
    dark: "bg-stone-950 text-stone-100",
    accent: "bg-stone-50 dark:bg-stone-900/40 text-stone-900 dark:text-stone-100"
  }), []);

  return (
    <section 
      id={id} 
      ref={containerRef} 
      className={`relative py-32 md:py-48 overflow-hidden transition-colors duration-1000 ${themeStyles[variant]} ${className}`}
      aria-label={ariaLabel || id}
    >
      <motion.div style={{ y: springY }} className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-fusion-bolt/10 to-transparent rounded-full blur-[140px]" />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </section>
  );
};

/** 
 * Smooth entry reveal component.
 */
export const FadeIn: React.FC<BaseProps & { delay?: number; direction?: 'up' | 'down' | 'none' }> = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** 
 * Board member visualization card.
 */
export const AuthorCard: React.FC<AuthorCardProps> = ({ name, role, index }) => (
  <motion.article 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="flex flex-col items-center p-12 bg-white dark:bg-stone-800/40 backdrop-blur-xl rounded-[3rem] border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full text-center group"
  >
    <div className="w-20 h-20 rounded-3xl bg-fusion-bolt/10 flex items-center justify-center text-fusion-bolt font-serif text-3xl mb-8 group-hover:scale-110 transition-transform">
      {name.charAt(0)}
    </div>
    <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mb-3">{name}</h3>
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
      {role}
    </p>
  </motion.article>
);
