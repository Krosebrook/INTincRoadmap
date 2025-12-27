
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Menu, X, Sun, Moon, Zap } from 'lucide-react';
import { NavbarProps } from '../../types';
import { APP_CONFIG, SECTIONS } from '../../data/content';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navbar Component
 * 
 * Provides accessible, high-performance navigation.
 * Uses semantic <nav> and <button> elements for WCAG compliance.
 */
export const Navbar: React.FC<NavbarProps> = ({ 
  scrolled, 
  isDarkMode, 
  toggleTheme, 
  menuOpen, 
  setMenuOpen, 
  scrollToSection 
}) => {
  const navLinks = useMemo(() => [
    { id: SECTIONS.introduction.id, label: 'Districts' },
    { id: SECTIONS.infrastructure.id, label: 'Stack' },
    { id: SECTIONS.roadmap.id, label: 'Expansion' },
    { id: SECTIONS.governance.id, label: 'Board' },
  ], []);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 dark:bg-stone-950/90 backdrop-blur-xl shadow-2xl py-3 border-b border-stone-200/50 dark:border-stone-800/50' 
          : 'bg-transparent py-8'
      }`}
    >
      <div className="container flex items-center justify-between px-6 mx-auto">
        <button 
          aria-label="Back to Top"
          className="flex items-center gap-4 focus:outline-none group focus-visible:ring-2 focus-visible:ring-fusion-bolt rounded-xl" 
          onClick={handleLogoClick}
        >
          <div className="relative flex items-center justify-center w-10 h-10 text-white rounded-xl shadow-lg bg-fusion-bolt overflow-hidden">
            <Zap size={22} className="fill-current" />
          </div>
          <div className="flex flex-col text-left">
            <span className={`font-serif font-bold text-xl tracking-tight leading-none text-stone-900 dark:text-stone-100 transition-all ${scrolled ? 'scale-90 origin-left' : ''}`}>
              {APP_CONFIG.appName}
            </span>
            <span className="text-[9px] font-bold tracking-[0.3em] text-stone-400 uppercase leading-none mt-1">
              Architecture v4.5
            </span>
          </div>
        </button>
        
        {/* Desktop Navigation */}
        <div className="items-center hidden gap-8 text-[11px] font-bold tracking-[0.2em] uppercase md:flex text-stone-500 dark:text-stone-400">
          {navLinks.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={scrollToSection(link.id)} 
              className="relative transition-colors hover:text-fusion-bolt group focus-visible:text-fusion-bolt focus:outline-none"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fusion-bolt transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
            </a>
          ))}
          
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />
          
          <button 
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            onClick={toggleTheme} 
            className="p-2 transition-all rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-fusion-bolt text-stone-400 focus-visible:ring-2 focus-visible:ring-fusion-bolt focus:outline-none"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <a 
            href={APP_CONFIG.paperLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-6 py-2.5 text-white dark:text-stone-900 transition-all rounded-full shadow-lg bg-stone-900 dark:bg-stone-100 hover:bg-fusion-bolt dark:hover:bg-fusion-bolt dark:hover:text-white transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-fusion-bolt focus:outline-none"
          >
            Blueprint
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            aria-label="Toggle Theme"
            onClick={toggleTheme} 
            className="p-3 text-stone-400 hover:text-fusion-bolt focus:outline-none"
          >
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-3 text-stone-900 dark:text-stone-100 hover:text-fusion-bolt focus:outline-none"
          >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6 text-[12px] font-bold uppercase tracking-widest text-stone-500">
              {navLinks.map(link => (
                <a 
                  key={link.id} 
                  href={`#${link.id}`} 
                  onClick={(e) => {
                    scrollToSection(link.id)(e);
                    setMenuOpen(false);
                  }}
                  className="hover:text-fusion-bolt transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-stone-100 dark:border-stone-900" />
              <a 
                href={APP_CONFIG.paperLink} 
                target="_blank" 
                className="text-fusion-bolt"
              >
                Whitepaper
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
