/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, ReactNode, ErrorInfo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { BaseProps, TooltipProps, SectionProps, AuthorCardProps } from '../../types';

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-bold">Something went wrong.</h3>
          <p className="text-sm">Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Tooltip ---

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = "" }) => {
  const [show, setShow] = useState(false);
  const handleFocus = () => setShow(true);
  const handleBlur = () => setShow(false);

  return (
    <div 
      className={`relative flex flex-col items-center ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="tooltip"
      aria-hidden={!show}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full mb-3 px-4 py-3 bg-stone-900/95 dark:bg-stone-800/95 backdrop-blur-sm text-stone-100 text-xs leading-relaxed rounded-lg shadow-xl z-50 whitespace-normal text-left min-w-[220px] max-w-[320px] border border-stone-700 dark:border-stone-600 pointer-events-none"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-stone-900/95 dark:border-t-stone-800/95"></div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

// --- ParallaxSection ---

export const ParallaxSection: React.FC<SectionProps> = ({ 
  children, 
  id, 
  className = "", 
  variant = "light",
  ariaLabel
}) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const rawY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const yBg = useSpring(rawY, { stiffness: 40, damping: 20 });
  
  const isLight = variant === 'light';

  return (
    <section 
      id={id} 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
      aria-label={ariaLabel || id}
    >
      <motion.div 
        style={{ y: yBg }} 
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        {isLight ? (
           <>
             <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-nobel-gold/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 opacity-70 dark:opacity-30" />
             <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-gradient-to-tr from-stone-300/30 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 opacity-70 dark:opacity-20 dark:from-stone-700/20" />
           </>
        ) : (
           <>
             <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-nobel-gold/5 rounded-full blur-[100px]" />
             <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-stone-700/30 rounded-full blur-[100px]" />
           </>
        )}
      </motion.div>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

// --- FadeIn ---

interface FadeInProps extends BaseProps {
  delay?: number;
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" }
  })
};

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => (
    <motion.div
        custom={delay}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInVariants}
    >
        {children}
    </motion.div>
);

// --- AuthorCard ---

interface AuthorCardPropsExtended extends AuthorCardProps, BaseProps {}

export const AuthorCard: React.FC<AuthorCardPropsExtended> = ({ name, role, index }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      className="flex flex-col group items-center p-8 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xs hover:border-nobel-gold/50 dark:hover:border-nobel-gold/50"
    >
      <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 text-center mb-3">{name}</h3>
      <div className="w-12 h-0.5 bg-nobel-gold mb-4 opacity-60"></div>
      <p className="text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-center leading-relaxed">{role}</p>
    </motion.article>
  );
};