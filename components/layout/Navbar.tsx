
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NavbarProps } from '../../types';
import { APP_CONFIG, SECTIONS } from '../../data/content';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC<NavbarProps> = ({ 
  scrolled, 
  isDarkMode, 
  toggleTheme, 
  menuOpen, 
  setMenuOpen, 
  scrollToSection 
}) => {
  const navLinks = useMemo(() => [
    { id: SECTIONS.introduction.id, label: 'Overview' },
    { id: SECTIONS.infrastructure.id, label: 'Hubs' },
    { id: SECTIONS.roadmap.id, label: 'Roadmap' },
    { id: SECTIONS.governance.id, label: 'Team' },
  ], []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-stone-950/80 backdrop-blur-lg shadow-xl py-3 border-b border-stone-200/50 dark:border-stone-800/50' 
          : 'bg-transparent py-8'
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="container flex items-center justify-between px-6 mx-auto">
        {/* Brand Identity */}
        <button 
          className="flex items-center gap-4 focus:outline-none group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to home"
        >
          <div className="relative flex items-center justify-center w-10 h-10 pb-1 text-2xl font-bold text-white rounded-xl shadow-lg font-serif bg-nobel-gold overflow-hidden transition-transform group-hover:scale-105">
            α
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="flex flex-col text-left">
            <span className={`font-serif font-bold text-xl tracking-tight leading-none text-stone-900 dark:text-stone-100 transition-all ${scrolled ? 'scale-90 origin-left' : ''}`}>
              {APP_CONFIG.appName}
            </span>
            <span className="text-[9px] font-bold tracking-[0.3em] text-stone-400 uppercase leading-none mt-1">
              Architecture {APP_CONFIG.year}
            </span>
          </div>
        </button>
        
        {/* Desktop Interface */}
        <div className="items-center hidden gap-10 text-[11px] font-bold tracking-[0.2em] uppercase md:flex text-stone-500 dark:text-stone-400">
          {navLinks.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={scrollToSection(link.id)} 
              className="relative transition-colors hover:text-nobel-gold group focus:outline-none"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nobel-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />
          
          <button 
            onClick={toggleTheme} 
            className="p-2 transition-all rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-nobel-gold text-stone-400 focus:outline-none focus:ring-2 focus:ring-nobel-gold" 
            aria-label={isDarkMode ? "Enable Light Mode" : "Enable Dark Mode"}
          >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <a 
            href={APP_CONFIG.paperLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-6 py-2.5 text-white dark:text-stone-900 transition-all rounded-full shadow-lg bg-stone-900 dark:bg-stone-100 hover:bg-nobel-gold dark:hover:bg-nobel-gold dark:hover:text-white transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Scientific Paper
          </a>
        </div>

        {/* Mobile Interface Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={toggleTheme} 
            className="p-3 transition-colors rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800" 
            aria-label="Toggle visual theme"
          >
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="p-3 text-stone-900 dark:text-stone-100 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors" 
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-10 bg-white dark:bg-stone-950 px-6 pt-20"
          >
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${link.id}`} 
                  onClick={scrollToSection(link.id)} 
                  className="text-3xl font-serif text-stone-900 dark:text-stone-100 hover:text-nobel-gold transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-xs h-px bg-stone-100 dark:bg-stone-900 my-4" 
              />
              
              <motion.a 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                href={APP_CONFIG.paperLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full max-w-xs text-center px-8 py-4 text-white rounded-2xl shadow-xl bg-nobel-gold font-bold uppercase tracking-widest text-sm"
              >
                View Scientific Paper
              </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
