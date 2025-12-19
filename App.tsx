
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useScroll, useTransform } from 'framer-motion';

// Layout & UI
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ui/Library';
import { HeroSection } from './components/sections/HeroSection';
import { MainContent } from './components/sections/MainContent';

// Hooks & Services
import { useTheme } from './hooks/useTheme';
import { ContentService } from './services/contentService';

/**
 * App Component
 * 
 * The primary entry point of the AlphaQubit Platform Architecture dashboard.
 * Orchestrates global states (theme, scroll), data retrieval, and the high-level
 * layout structure.
 */
const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  // Optimized Scroll Event Handling for header transitions
  useEffect(() => {
    let ticking = false;
    const updateScrollState = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  // Hero Scroll Motion values
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ 
    target: heroRef, 
    offset: ["start start", "end start"] 
  });
  
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  /** Smooth scroll utility for internal navigation */
  const scrollToSection = useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // Fetch hierarchical content via ContentService
  const heroContent = ContentService.getSection('hero');
  const introContent = ContentService.getSection('introduction');
  const archContent = ContentService.getSection('infrastructure');
  const integrationContent = ContentService.getSection('integration');
  const investmentContent = ContentService.getSection('investment');
  const roadmapContent = ContentService.getSection('roadmap');
  const governanceContent = ContentService.getSection('governance');
  const governanceTeam = ContentService.getGovernanceTeam();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-nobel-gold/30 transition-colors duration-1000 antialiased">
        <Navbar 
          scrolled={isScrolled} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          menuOpen={isMenuOpen} 
          setMenuOpen={setIsMenuOpen} 
          scrollToSection={scrollToSection} 
        />

        <main role="main">
          <HeroSection 
            heroRef={heroRef}
            heroY={heroY}
            heroOpacity={heroOpacity}
            heroProgress={heroProgress}
            content={heroContent}
            nextSectionId={introContent.id}
            scrollToSection={scrollToSection}
          />

          <MainContent 
            introContent={introContent}
            archContent={archContent}
            integrationContent={integrationContent}
            investmentContent={investmentContent}
            roadmapContent={roadmapContent}
            governanceContent={governanceContent}
            governanceTeam={governanceTeam}
            scrollToSection={scrollToSection}
          />
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
