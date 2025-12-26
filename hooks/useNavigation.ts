
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';

/**
 * useNavigation Hook
 * 
 * Centralizes scroll tracking and smooth-scrolling logic.
 */
export const useNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Basic intersection logic for active section tracking
      const sections = ['hero', 'introduction', 'infrastructure', 'integration', 'investment', 'roadmap', 'governance'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fix: Added React import to resolve the 'React.MouseEvent' namespace error.
  const scrollToSection = useCallback((id: string) => (e?: React.MouseEvent | string) => {
    if (e && typeof e !== 'string') e.preventDefault();
    
    const targetId = typeof e === 'string' ? e : id;
    const target = document.getElementById(targetId);
    
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return { isScrolled, activeSection, scrollToSection };
};
