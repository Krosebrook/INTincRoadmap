
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
 * Central orchestrator for the FlashFusion platform dashboard.
 * Refactored into specialized sections for production-grade modularity.
 */
const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Centralized navigation logic
  const { isScrolled, scrollToSection } = useNavigation();

  // Motion orchestration for the Hero Parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ 
    target: heroRef, 
    offset: ["start start", "end start"] 
  });
  
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // Memoized content retrieval to prevent redundant service calls
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
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-fusion-bolt/30 transition-colors duration-1000 antialiased">
          <Navbar 
            scrolled={isScrolled} 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
            menuOpen={isMenuOpen} 
            setMenuOpen={setIsMenuOpen} 
            scrollToSection={scrollToSection} 
          />

          <main role="main">
            {/* The HeroSection handles the initial 3D immersion and landing titles */}
            <HeroSection 
              heroRef={heroRef}
              heroY={heroY}
              heroOpacity={heroOpacity}
              heroProgress={heroProgress}
              content={sections.hero}
              nextSectionId={sections.intro.id}
              scrollToSection={scrollToSection}
            />

            {/* MainContent orchestrates all subsequent architectural sections */}
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
