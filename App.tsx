
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo } from 'react';
import { useScroll, useTransform } from 'framer-motion';

// Layout & UI
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ui/Library';
import { HeroSection } from './components/sections/HeroSection';
import { MainContent } from './components/sections/MainContent';
import { ChatAssistant } from './components/ai/ChatAssistant';

// Hooks & Services
import { useTheme } from './hooks/useTheme';
import { useNavigation } from './hooks/useNavigation';
import { ContentService } from './services/contentService';
import { CityProvider } from './context/CityContext';

/**
 * App Component
 * 
 * The central orchestrator for the FlashFusion Architectural Dashboard.
 * Integrates 3D visualization, federated state management, and AI-driven platform assistance.
 */
const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Navigation hook handles scroll-to logic and "scrolled" states
  const { isScrolled, scrollToSection } = useNavigation();

  // Primary scroll target for parallax effects
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ 
    target: heroRef, 
    offset: ["start start", "end start"] 
  });
  
  // High-performance transforms mapped to scroll progress
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);

  /** 
   * Pre-fetched sections to ensure smooth navigation transitions.
   * Memoized to prevent service re-invocation on theme toggles.
   */
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
    <CityProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-fusion-bolt/20 transition-colors duration-1000 antialiased">
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
          
          <ChatAssistant />
          <Footer />
        </div>
      </ErrorBoundary>
    </CityProvider>
  );
};

export default App;
