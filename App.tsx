
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
 * Central orchestrator for the AlphaQubit platform dashboard.
 */
const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  // Scroll visibility management
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Motion orchestration
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ 
    target: heroRef, 
    offset: ["start start", "end start"] 
  });
  
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const scrollToSection = useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // Memoized content retrieval
  const sections = useMemo(() => ({
    hero: ContentService.getSection('hero'),
    intro: ContentService.getSection('introduction'),
    arch: ContentService.getSection('infrastructure'),
    integ: ContentService.getSection('integration'),
    invest: ContentService.getSection('investment'),
    roadmap: ContentService.getSection('roadmap'),
    governance: ContentService.getSection('governance'),
    team: ContentService.getGovernanceTeam()
  }), []);

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
            content={sections.hero}
            nextSectionId={sections.intro.id}
            scrollToSection={scrollToSection}
          />

          <MainContent 
            introContent={sections.intro}
            archContent={sections.arch}
            integrationContent={sections.integ}
            investmentContent={sections.invest}
            roadmapContent={sections.roadmap}
            governanceContent={sections.governance}
            governanceTeam={sections.team}
            scrollToSection={scrollToSection}
          />
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
