
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, useRef, useState, ReactNode, ErrorInfo, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { BaseProps, TooltipProps, SectionProps, AuthorCardProps } from '../../types';

/** 
 * Standard container for consistent horizontal layout and max-width.
 */
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
 * Production-grade Error Boundary.
 * Catches rendering exceptions to prevent total app failure.
 */
// Fix: Use React.Component specifically to ensure correct type inheritance for props and state methods
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('System Fault Caught');
    console.error("Error:", error);
    console.info("Stack Trace:", errorInfo.componentStack);
    console.groupEnd();
  }

  public render(): ReactNode {
    const { fallback, children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return fallback || (
        <div 
          role="alert"
          className="flex flex-col items-center justify-center min-h-[400px] p-12 text-center bg-stone-50 dark:bg-stone-900 rounded-[3rem] border border-stone-200 dark:border-stone-800"
        >
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h3 className="font-serif text-3xl mb-4 text-stone-900 dark:text-stone-100">District Isolated</h3>
          <p className="text-stone-600 dark:text-stone-400 max-w-md mb-8">
            An internal process failure was detected. The district has been isolated for diagnostic review.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-fusion-bolt transition-all shadow-xl"
          >
            Re-Initialize Grid
          </button>
        </div>
      );
    }
    
    return children;
  }
}

/** 
 * Accessible, physics-based Tooltip.
 */
export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  className = "", 
  position = "top",
  delay = 150 
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
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
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
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute ${positionMap[position]} px-4 py-2.5 bg-stone-900 dark:bg-stone-800 text-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-2xl z-[150] border border-white/10 pointer-events-none whitespace-nowrap`}
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
 * Modular Parallax Section.
 */
export const ParallaxSection: React.FC<SectionProps> = ({ children, id, className = "", variant = "light", ariaLabel }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  const yOffset = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const springY = useSpring(yOffset, { stiffness: 40, damping: 20 });
  
  const themeStyles = useMemo(() => ({
    light: "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100",
    dark: "bg-stone-950 text-stone-100",
    accent: "bg-stone-50 dark:bg-stone-900/40 text-stone-900 dark:text-stone-100"
  }), []);

  return (
    <section 
      id={id} 
      ref={containerRef} 
      aria-label={ariaLabel || id}
      className={`relative py-32 md:py-48 transition-colors duration-1000 ${themeStyles[variant]} ${className}`}
    >
      <motion.div style={{ y: springY }} className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-br from-fusion-bolt/20 to-transparent rounded-full blur-[160px]" />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </section>
  );
};

/** 
 * Physics-based entrance reveal.
 */
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
      transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** 
 * Team member/Governance board profile card.
 */
export const AuthorCard: React.FC<AuthorCardProps> = ({ name, role, index }) => (
  <motion.article 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    className="flex flex-col items-center p-12 bg-white dark:bg-stone-800/50 backdrop-blur-3xl rounded-[3rem] border border-stone-200 dark:border-stone-800 shadow-xl hover:-translate-y-3 transition-all duration-500 text-center group"
  >
    <div className="w-24 h-24 rounded-3xl bg-fusion-bolt/10 flex items-center justify-center text-fusion-bolt font-serif text-4xl mb-8 transition-transform group-hover:scale-110">
      {name.charAt(0)}
    </div>
    <h3 className="font-serif text-3xl text-stone-900 dark:text-stone-100 mb-3">{name}</h3>
    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">{role}</p>
  </motion.article>
);
