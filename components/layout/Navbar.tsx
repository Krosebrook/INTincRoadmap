
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Menu, X, Sun, Moon, Zap } from 'lucide-react';
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
    { id: SECTIONS.introduction.id, label: 'Districts' },
    { id: SECTIONS.infrastructure.id, label: 'Stack' },
    { id: SECTIONS.roadmap.id, label: 'Expansion' },
    { id: SECTIONS.governance.id, label: 'Board' },
  ], []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-stone-950/80 backdrop-blur-lg shadow-xl py-3 border-b border-stone-200/50 dark:border-stone-800/50' 
          : 'bg-transparent py-8'
      }`}
    >
      <div className="container flex items-center justify-between px-6 mx-auto">
        <button 
          className="flex items-center gap-4 focus:outline-none group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative flex items-center justify-center w-10 h-10 text-white rounded-xl shadow-lg bg-fusion-bolt overflow-hidden">
            <Zap size={24} className="fill-current" />
          </div>
          <div className="flex flex-col text-left">
            <span className={`font-serif font-bold text-xl tracking-tight leading-none text-stone-900 dark:text-stone-100 transition-all ${scrolled ? 'scale-90 origin-left' : ''}`}>
              {APP_CONFIG.appName}
            </span>
            <span className="text-[9px] font-bold tracking-[0.3em] text-stone-400 uppercase leading-none mt-1">
              District Map {APP_CONFIG.year}
            </span>
          </div>
        </button>
        
        <div className="items-center hidden gap-10 text-[11px] font-bold tracking-[0.2em] uppercase md:flex text-stone-500 dark:text-stone-400">
          {navLinks.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={scrollToSection(link.id)} 
              className="relative transition-colors hover:text-fusion-bolt group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fusion-bolt transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />
          
          <button onClick={toggleTheme} className="p-2 transition-all rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-fusion-bolt text-stone-400">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <a 
            href={APP_CONFIG.paperLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-6 py-2.5 text-white dark:text-stone-900 transition-all rounded-full shadow-lg bg-stone-900 dark:bg-stone-100 hover:bg-fusion-bolt dark:hover:bg-fusion-bolt dark:hover:text-white transform hover:-translate-y-0.5"
          >
            Metro Specs
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggleTheme} className="p-3 text-stone-400">
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-3 text-stone-900 dark:text-stone-100">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
