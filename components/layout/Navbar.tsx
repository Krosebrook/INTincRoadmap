
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NavbarProps } from '../../types';
import { APP_CONFIG, SECTIONS } from '../../data/content';

export const Navbar: React.FC<NavbarProps> = ({ 
  scrolled, 
  isDarkMode, 
  toggleTheme, 
  menuOpen, 
  setMenuOpen, 
  scrollToSection 
}) => {
  const navLinks = [
    { id: SECTIONS.intro.id, label: 'Introduction' },
    { id: SECTIONS.architecture.id, label: 'Infrastructure' },
    { id: SECTIONS.roadmap.id, label: 'Roadmap' },
    { id: SECTIONS.governance.id, label: 'Governance' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F9F8F4]/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="container flex items-center justify-between px-6 mx-auto">
        {/* Logo Area */}
        <button 
          className="flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-lg p-1" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <div className="flex items-center justify-center w-8 h-8 pb-1 text-xl font-bold text-white rounded-full shadow-sm font-serif bg-nobel-gold">α</div>
          <span className={`font-serif font-bold text-lg tracking-wide transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'} text-stone-900 dark:text-stone-100`}>
            {APP_CONFIG.appName} <span className="font-normal text-stone-500 dark:text-stone-400">{APP_CONFIG.year}</span>
          </span>
        </button>
        
        {/* Desktop Menu */}
        <div className="items-center hidden gap-8 text-sm font-medium tracking-wide md:flex text-stone-600 dark:text-stone-400">
          {navLinks.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={scrollToSection(link.id)} 
              className="uppercase transition-all hover:text-stone-900 dark:hover:text-stone-100 hover:underline hover:underline-offset-4 focus:outline-none focus:text-stone-900 dark:focus:text-stone-100"
            >
              {link.label}
            </a>
          ))}
          
          <a 
            href={APP_CONFIG.paperLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-5 py-2 text-white transition-colors rounded-full shadow-sm bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
          >
            View Paper
          </a>
          
          <button 
            onClick={toggleTheme} 
            className="p-2 transition-colors rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-nobel-gold" 
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
              {isDarkMode ? <Sun size={20} className="text-stone-100" /> : <Moon size={20} className="text-stone-600" />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleTheme} className="p-2 transition-colors rounded-full hover:bg-stone-200 dark:hover:bg-stone-800" aria-label="Toggle dark mode">
               {isDarkMode ? <Sun size={20} className="text-stone-100" /> : <Moon size={20} className="text-stone-600" />}
          </button>
          <button className="p-2 text-stone-900 dark:text-stone-100" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
              {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 text-xl font-serif bg-[#F9F8F4] dark:bg-stone-950 text-stone-900 dark:text-stone-100">
            {navLinks.map(link => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                onClick={scrollToSection(link.id)} 
                className="uppercase hover:text-nobel-gold"
              >
                {link.label}
              </a>
            ))}
            <a 
              href={APP_CONFIG.paperLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setMenuOpen(false)} 
              className="px-6 py-3 text-white rounded-full shadow-lg bg-stone-900 dark:bg-stone-100 dark:text-stone-900"
            >
              View Paper
            </a>
        </div>
      )}
    </nav>
  );
};
