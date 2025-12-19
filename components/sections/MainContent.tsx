
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { HubArchitectureDiagram, IntegrationLayerDiagram, CostAnalysisDiagram } from '../Diagrams';
import { FadeIn, ParallaxSection, AuthorCard, Container } from '../ui/Library';
import { SectionContent, AuthorProfile } from '../../types';

// Lazy-loaded visual assets
const QuantumComputerScene = React.lazy(() => import('../QuantumScene').then(m => ({ default: m.QuantumComputerScene })));

interface MainContentProps {
  introContent: SectionContent;
  archContent: SectionContent;
  integrationContent: SectionContent;
  investmentContent: SectionContent;
  roadmapContent: SectionContent;
  governanceContent: SectionContent;
  governanceTeam: readonly AuthorProfile[];
  /** Callback for cross-linking between sections */
  scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

/**
 * MainContent Component
 * 
 * Orchestrates all the detailed informational sections of the platform.
 * It uses the SectionContent data model to populate text and leverages
 * specialized diagrams and 3D scenes for visualization.
 */
export const MainContent: React.FC<MainContentProps> = ({
  introContent,
  archContent,
  integrationContent,
  investmentContent,
  roadmapContent,
  governanceContent,
  governanceTeam,
  scrollToSection
}) => {
  return (
    <>
      {/* --- INTRODUCTION --- */}
      <ParallaxSection id={introContent.id} variant="light">
        <Container className="grid lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5">
            <FadeIn>
              <div className="text-xs font-bold tracking-[0.3em] uppercase text-nobel-gold mb-4">{introContent.tagline}</div>
              <h2 className="text-4xl md:text-6xl font-serif mb-8 text-stone-900 dark:text-stone-50 leading-tight">{introContent.title}</h2>
              <div className="w-24 h-1.5 bg-nobel-gold/40 rounded-full" />
            </FadeIn>
          </div>
          <div className="lg:col-span-7 space-y-10">
            <FadeIn delay={0.2}>
              <p className="text-2xl font-light leading-relaxed text-stone-600 dark:text-stone-300">
                <span className="text-8xl float-left mr-6 mt-[-10px] font-serif text-nobel-gold/30 leading-[0.7]">W</span>
                {introContent.description_p1}
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-xl font-light leading-relaxed text-stone-500 dark:text-stone-400 italic">
                {introContent.description_p2}
              </p>
            </FadeIn>
          </div>
        </Container>
      </ParallaxSection>

      {/* --- CORE HUB ARCHITECTURE --- */}
      <ParallaxSection id={archContent.id} variant="accent">
        <Container className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <FadeIn delay={0.2}><HubArchitectureDiagram /></FadeIn>
          </div>
          <div className="order-1 lg:order-2">
            <FadeIn>
              <div className="inline-flex items-center gap-3 px-5 py-2 border rounded-full bg-white dark:bg-stone-900 shadow-sm mb-6">
                <Layers size={16} className="text-nobel-gold" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500 dark:text-stone-300">{archContent.tagline}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 text-stone-900 dark:text-stone-50">{archContent.title}</h2>
              <p className="text-lg font-light text-stone-600 dark:text-stone-400 leading-relaxed mb-8">{archContent.description}</p>
            </FadeIn>
          </div>
        </Container>
      </ParallaxSection>

      {/* --- DATA FLOW INTEGRATION --- */}
      <ParallaxSection id={integrationContent.id} variant="dark" className="!py-0">
        <div className="bg-stone-950 py-32">
          <Container className="flex flex-col items-center">
            <div className="max-w-3xl text-center mb-20">
              <FadeIn>
                <div className="text-xs font-bold tracking-[0.4em] uppercase text-nobel-gold mb-6">{integrationContent.tagline}</div>
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">{integrationContent.title}</h2>
                <p className="text-xl font-light text-stone-400 leading-relaxed">{integrationContent.description}</p>
              </FadeIn>
            </div>
            <FadeIn delay={0.3} className="w-full"><IntegrationLayerDiagram /></FadeIn>
          </Container>
        </div>
      </ParallaxSection>

      {/* --- FINANCIAL ANALYSIS --- */}
      <ParallaxSection id={investmentContent.id} variant="light">
        <Container>
          <FadeIn className="max-w-4xl mx-auto text-center mb-20">
            <div className="text-xs font-bold tracking-[0.3em] uppercase text-stone-400 mb-4">{investmentContent.tagline}</div>
            <h2 className="text-4xl md:text-6xl font-serif text-stone-900 dark:text-stone-50 mb-8">{investmentContent.title}</h2>
            <p className="text-lg font-light text-stone-500 dark:text-stone-400 leading-relaxed">{investmentContent.description}</p>
          </FadeIn>
          <FadeIn delay={0.4} className="max-w-5xl mx-auto"><CostAnalysisDiagram /></FadeIn>
        </Container>
      </ParallaxSection>

      {/* --- ROADMAP --- */}
      <ParallaxSection id={roadmapContent.id} variant="accent">
        <Container className="grid lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-5">
            <FadeIn delay={0.2}>
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl relative">
                <Suspense fallback={<div className="w-full h-full bg-stone-100 dark:bg-stone-800 animate-pulse" />}>
                  <QuantumComputerScene />
                </Suspense>
                <div className="absolute inset-x-0 bottom-10 px-10">
                  <div className="p-4 backdrop-blur-xl bg-white/40 dark:bg-stone-900/40 rounded-2xl border border-white/20 text-center">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-600 dark:text-stone-300">Operational Integrity Check</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="lg:col-span-7">
            <FadeIn>
              <div className="text-xs font-bold tracking-[0.3em] uppercase text-nobel-gold mb-6">{roadmapContent.tagline}</div>
              <h2 className="text-4xl md:text-6xl font-serif mb-12 text-stone-900 dark:text-stone-50">{roadmapContent.title}</h2>
              <div className="space-y-10">
                {roadmapContent.steps?.map((step, idx) => (
                  <motion.div 
                    key={step.quarter} className="flex gap-8 group"
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl border border-nobel-gold/20 flex items-center justify-center font-bold text-nobel-gold bg-nobel-gold/5 transition-all group-hover:bg-nobel-gold group-hover:text-white group-hover:shadow-[0_10px_25px_rgba(197,160,89,0.3)]">
                      {step.quarter}
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif text-stone-900 dark:text-stone-100 mb-2">{step.title}</h4>
                      <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Container>
      </ParallaxSection>

      {/* --- GOVERNANCE --- */}
      <ParallaxSection id={governanceContent.id} variant="light">
        <Container>
          <div className="text-center mb-20">
            <FadeIn>
              <div className="text-xs font-bold tracking-[0.3em] uppercase text-stone-400 mb-6">{governanceContent.tagline}</div>
              <h2 className="text-4xl md:text-6xl font-serif text-stone-900 dark:text-stone-50 mb-8">{governanceContent.title}</h2>
              <p className="text-xl font-light text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">{governanceContent.description}</p>
            </FadeIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {governanceTeam.map((author, i) => (
              <AuthorCard key={author.name} {...author} index={i} />
            ))}
          </div>
        </Container>
      </ParallaxSection>
    </>
  );
};
