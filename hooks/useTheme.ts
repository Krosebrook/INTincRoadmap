
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { ThemeHook } from '../types';

/**
 * useTheme Hook
 * 
 * Manages the visual theme of the application (Light/Dark).
 * Handles persistent storage with error boundaries and system preference synchronization.
 */
export const useTheme = (): ThemeHook => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
    } catch (e) {
      console.warn('LocalStorage access blocked:', e);
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync state to DOM and Storage
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {
      // Silently fail if storage is restricted
    }
  }, [isDarkMode]);

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('theme')) {
          setIsDarkMode(e.matches);
        }
      } catch (err) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return { isDarkMode, toggleTheme };
};
