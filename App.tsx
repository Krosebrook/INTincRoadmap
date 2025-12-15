
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Layers } from 'lucide-react';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { 
  HubArchitectureDiagram, 
  IntegrationLayerDiagram, 
  CostAnalysisDiagram 
} from './components/Diagrams';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FadeIn, ParallaxSection, AuthorCard, ErrorBoundary } from './components/ui/Library';
import { useTheme } from './hooks/useTheme';
import { SECTIONS, GOVERNANCE_ROLES } from './data/content';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for scroll performance
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effects
  const heroBgY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroTextY = useTransform(heroProgress, [0, 1], ["0%", "60%"]); // Reduced distance for tighter feel
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F9F8F4] dark:bg-stone-950 text-stone-800 dark:text-stone-200 selection:bg-nobel-gold selection:text-white transition-colors duration-500">
        <Navbar 
          scrolled={scrolled} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
          scrollToSection={scrollToSection} 
        />

        {/* Hero Section */}
        <header ref={heroRef} className="relative flex items-center justify-center h-screen overflow-hidden">
          <motion.div style={{ y: heroBgY }} className="absolute inset-0 z-0">
             <HeroScene scrollYProgress={heroProgress} />
          </motion.div>
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.85)_0%,rgba(249,248,244,0.6)_50%,rgba(249,248,244,0.3)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(12,10,9,0.85)_0%,rgba(12,10,9,0.6)_50%,rgba(12,10,9,0.3)_100%)]" />
          <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 container px-6 mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-block mb-4 px-3 py-1 border border-nobel-gold text-nobel-gold text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/30 dark:bg-black/30">
              {SECTIONS.hero.tagline}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="mb-8 text-5xl font-medium leading-tight font-serif md:text-7xl lg:text-9xl md:leading-[0.9] text-stone-900 dark:text-stone-100 drop-shadow-sm">
              {SECTIONS.hero.title} <br/><span className="block mt-4 text-3xl italic font-normal text-stone-600 dark:text-stone-400 md:text-5xl">{SECTIONS.hero.subtitle}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="max-w-2xl mx-auto mb-12 text-lg font-light leading-relaxed md:text-xl text-stone-700 dark:text-stone-300">
              {SECTIONS.hero.description}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="flex justify-center">
               <a href={`#${SECTIONS.intro.id}`} onClick={scrollToSection(SECTIONS.intro.id)} className="flex flex-col items-center gap-2 text-sm font-medium transition-colors cursor-pointer group text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
                  <span>VIEW STACK</span>
                  <span className="p-2 transition-colors border rounded-full border-stone-300 dark:border-stone-700 group-hover:border-stone-900 dark:group-hover:border-stone-100 bg-white/50 dark:bg-black/50"><ArrowDown size={16} /></span>
               </a>
            </motion.div>
          </motion.div>
        </header>

        <main role="main">
          {/* Introduction */}
          <ParallaxSection id={SECTIONS.intro.id} className="py-24 transition-colors duration-500 bg-white dark:bg-stone-900" variant="light">
            <div className="container grid items-start grid-cols-1 gap-12 px-6 mx-auto md:px-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <FadeIn>
                  <div className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400">{SECTIONS.intro.tagline}</div>
                  <h2 className="mb-6 text-4xl leading-tight font-serif text-stone-900 dark:text-stone-100">{SECTIONS.intro.title}</h2>
                  <div className="w-16 h-1 mb-6 bg-nobel-gold"></div>
                </FadeIn>
              </div>
              <div className="space-y-6 text-lg leading-relaxed md:col-span-8 text-stone-600 dark:text-stone-300">
                <FadeIn delay={0.2}>
                    <p><span className="text-5xl float-left mr-3 mt-[-8px] font-serif text-nobel-gold">W</span>{SECTIONS.intro.description_p1}</p>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <p>{SECTIONS.intro.description_p2}</p>
                </FadeIn>
              </div>
            </div>
          </ParallaxSection>

          {/* Core Architecture */}
          <ParallaxSection id={SECTIONS.architecture.id} className="py-24 transition-colors duration-500 bg-white border-t border-stone-100 dark:bg-stone-900 dark:border-stone-800" variant="light">
              <div className="container grid items-center grid-cols-1 gap-16 px-6 mx-auto lg:grid-cols-2">
                  <div>
                      <FadeIn>
                          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase border rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700">
                              <Layers size={14}/> {SECTIONS.architecture.tagline}
                          </div>
                          <h2 className="mb-6 text-4xl font-serif md:text-5xl text-stone-900 dark:text-stone-100">{SECTIONS.architecture.title}</h2>
                          <p className="mb-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">
                             {SECTIONS.architecture.description}
                          </p>
                      </FadeIn>
                  </div>
                  <div><FadeIn delay={0.3}><HubArchitectureDiagram /></FadeIn></div>
              </div>
          </ParallaxSection>

          {/* Integration Layers */}
          <ParallaxSection className="py-24 transition-colors duration-500 bg-stone-900 dark:bg-black text-stone-100" variant="dark">
              <div className="container relative z-10 grid items-center grid-cols-1 gap-16 px-6 mx-auto lg:grid-cols-2">
                   <div className="order-2 lg:order-1"><FadeIn delay={0.2}><IntegrationLayerDiagram /></FadeIn></div>
                   <div className="order-1 lg:order-2">
                      <FadeIn>
                          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase border rounded-full bg-stone-800 text-nobel-gold border-stone-700">{SECTIONS.integration.tagline}</div>
                          <h2 className="mb-6 text-4xl text-white font-serif md:text-5xl">{SECTIONS.integration.title}</h2>
                          <p className="mb-6 text-lg leading-relaxed text-stone-400">
                              {SECTIONS.integration.description}
                          </p>
                      </FadeIn>
                   </div>
              </div>
          </ParallaxSection>

          {/* Investment */}
          <ParallaxSection className="py-24 transition-colors duration-500 bg-[#F9F8F4] dark:bg-stone-950" variant="light">
              <div className="container px-6 mx-auto">
                  <FadeIn>
                      <div className="max-w-4xl mx-auto mb-12 text-center">
                          <h2 className="mb-6 text-4xl font-serif md:text-5xl text-stone-900 dark:text-stone-100">{SECTIONS.investment.title}</h2>
                          <p className="text-lg leading-relaxed text-stone-600 dark:text-stone-300">
                              {SECTIONS.investment.description}
                          </p>
                      </div>
                  </FadeIn>
                  <FadeIn delay={0.3}><div className="max-w-3xl mx-auto"><CostAnalysisDiagram /></div></FadeIn>
              </div>
          </ParallaxSection>

          {/* Roadmap & Governance */}
          <ParallaxSection id={SECTIONS.roadmap.id} className="py-24 transition-colors duration-500 bg-white border-t border-stone-200 dark:bg-stone-900 dark:border-stone-800" variant="light">
               <div className="container grid grid-cols-1 gap-12 px-6 mx-auto md:grid-cols-12">
                  <div className="relative md:col-span-5">
                      <FadeIn delay={0.2}>
                          <div className="aspect-square bg-[#F5F4F0] dark:bg-stone-800 rounded-xl overflow-hidden relative border border-stone-200 dark:border-stone-700 shadow-inner group transition-colors">
                              <QuantumComputerScene />
                              <div className="absolute left-0 right-0 bottom-4 text-xs text-center font-serif italic text-stone-400">Abstract visualization of the 4-tier stack</div>
                          </div>
                      </FadeIn>
                  </div>
                  <div className="flex flex-col justify-center md:col-span-7">
                      <FadeIn>
                          <div className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400">{SECTIONS.roadmap.tagline}</div>
                          <h2 className="mb-6 text-4xl font-serif text-stone-900 dark:text-stone-100">{SECTIONS.roadmap.title}</h2>
                          <ul className="space-y-4 text-lg text-stone-600 dark:text-stone-300">
                              {SECTIONS.roadmap.steps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-4">
                                    <span className="font-bold text-nobel-gold">{step.quarter}</span> 
                                    <span><strong>{step.title}:</strong> {step.desc}</span>
                                </li>
                              ))}
                          </ul>
                      </FadeIn>
                  </div>
               </div>
          </ParallaxSection>

          {/* Governance Team */}
          <ParallaxSection id={SECTIONS.governance.id} className="py-24 transition-colors duration-500 bg-[#F5F4F0] dark:bg-stone-950 border-t border-stone-300 dark:border-stone-800" variant="light">
             <div className="container px-6 mx-auto">
                  <div className="mb-16 text-center">
                      <FadeIn>
                          <div className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400">{SECTIONS.governance.tagline}</div>
                          <h2 className="mb-4 text-3xl font-serif md:text-5xl text-stone-900 dark:text-stone-100">{SECTIONS.governance.title}</h2>
                          <p className="max-w-2xl mx-auto text-stone-500 dark:text-stone-400">{SECTIONS.governance.description}</p>
                      </FadeIn>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-8">
                      {GOVERNANCE_ROLES.map((person, i) => (
                          <AuthorCard key={person.name} name={person.name} role={person.role} index={i} />
                      ))}
                  </div>
             </div>
          </ParallaxSection>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
