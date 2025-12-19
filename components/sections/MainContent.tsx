
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Layers, Activity } from 'lucide-react';
import { HubArchitectureDiagram, IntegrationLayerDiagram, CostAnalysisDiagram } from '../Diagrams';
import { FadeIn, ParallaxSection, AuthorCard, Container } from '../ui/Library';
import { SectionContent, AuthorProfile } from '../../types';

const QuantumComputerScene = React.lazy(() => import('../QuantumScene').then(m => ({ default: m.QuantumComputerScene })));

interface MainContentProps {
  introContent: SectionContent;
  archContent: SectionContent;
  integrationContent: SectionContent;
  investmentContent: SectionContent;
  roadmapContent: SectionContent;
  governanceContent: SectionContent;
  governanceTeam: readonly AuthorProfile[];
  scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  introContent,
  archContent,
  integrationContent,
  investmentContent,
  roadmapContent,
  governanceContent,
  governanceTeam,
}) => {
  return (
    <>
      {/* --- INTRODUCTION --- */}
      <ParallaxSection id={introContent.id} variant="light">
        <Container className="grid lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5">
            <FadeIn>
              <div className="text-xs font-bold tracking-[0.4em] uppercase text-nobel-gold mb-6">{introContent.tagline}</div>
              <h2 className="text-5xl md:text-7xl font-serif mb-10 text-stone-900 dark:text-stone-50 leading-[1.1]">{introContent.title}</h2>
              <div className="w-32 h-2 bg-nobel-gold/30 rounded-full" />
            </FadeIn>
          </div>
          <div className="lg:col-span-7 space-y-12">
            <FadeIn delay={0.25}>
              <p className="text-3xl font-light leading-relaxed text-stone-600 dark:text-stone-300">
                <span className="text-9xl float-left mr-8 mt-[-15px] font-serif text-nobel-gold/20 leading-[0.6] select-none">W</span>
                {introContent.description_p1}
              </p>
            </FadeIn>
            <FadeIn delay={0.45}>
              <p className="text-2xl font-light leading-relaxed text-stone-500 dark:text-stone-400 italic border-l-[10px] border-nobel-gold/10 pl-12 py-4">
                {introContent.description_p2}
              </p>
            </FadeIn>
          </div>
        </Container>
      </ParallaxSection>

      {/* --- CORE HUB ARCHITECTURE --- */}
      <ParallaxSection id={archContent.id} variant="accent">
        <Container className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <FadeIn delay={0.3}><HubArchitectureDiagram /></FadeIn>
          </div>
          <div className="order-1 lg:order-2">
            <FadeIn>
              <div className="inline-flex items-center gap-4 px-6 py-3 border rounded-2xl bg-white dark:bg-stone-900 shadow-xl mb-10">
                <Layers size={20} className="text-nobel-gold" />
                <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-stone-500 dark:text-stone-300">{archContent.tagline}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif mb-10 text-stone-900 dark:text-stone-50 leading-tight">{archContent.title}</h2>
              <p className="text-xl font-light text-stone-600 dark:text-stone-400 leading-relaxed mb-10">{archContent.description}</p>
            </FadeIn>
          </div>
        </Container>
      </ParallaxSection>

      {/* --- DATA FLOW INTEGRATION --- */}
      <ParallaxSection id={integrationContent.id} variant="dark" className="!py-0">
        <div className="bg-stone-950 py-40">
          <Container className="flex flex-col items-center">
            <div className="max-w-4xl text-center mb-24">
              <FadeIn>
                <div className="text-xs font-bold tracking-[0.5em] uppercase text-nobel-gold mb-8">{integrationContent.tagline}</div>
                <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 leading-none">{integrationContent.title}</h2>
                <p className="text-2xl font-light text-stone-400 leading-relaxed max-w-3xl mx-auto">{integrationContent.description}</p>
              </FadeIn>
            </div>
            <FadeIn delay={0.4} className="w-full"><IntegrationLayerDiagram /></FadeIn>
          </Container>
        </div>
      </ParallaxSection>

      {/* --- FINANCIAL ANALYSIS --- */}
      <ParallaxSection id={investmentContent.id} variant="light">
        <Container>
          <FadeIn className="max-w-5xl mx-auto text-center mb-24">
            <div className="text-xs font-bold tracking-[0.4em] uppercase text-stone-400 mb-6">{investmentContent.tagline}</div>
            <h2 className="text-5xl md:text-7xl font-serif text-stone-900 dark:text-stone-50 mb-10">{investmentContent.title}</h2>
            <p className="text-2xl font-light text-stone-500 dark:text-stone-400 leading-relaxed">{investmentContent.description}</p>
          </FadeIn>
          <FadeIn delay={0.5} className="max-w-6xl mx-auto"><CostAnalysisDiagram /></FadeIn>
        </Container>
      </ParallaxSection>

      {/* --- ROADMAP --- */}
      <ParallaxSection id={roadmapContent.id} variant="accent">
        <Container className="grid lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5">
            <FadeIn delay={0.3}>
              <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative group/scene">
                <Suspense fallback={<div className="w-full h-full bg-stone-100 dark:bg-stone-800 animate-pulse" />}>
                  <QuantumComputerScene />
                </Suspense>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-12 px-12">
                  <div className="p-6 backdrop-blur-3xl bg-white/20 dark:bg-stone-900/20 rounded-[2rem] border border-white/10 text-center shadow-2xl transition-transform group-hover/scene:scale-105 duration-700">
                    <div className="flex items-center justify-center gap-3 mb-2">
                       <Activity size={16} className="text-nobel-gold animate-pulse" />
                       <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-stone-600 dark:text-stone-300">Phase Integrity Check</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="lg:col-span-7">
            <FadeIn>
              <div className="text-xs font-bold tracking-[0.4em] uppercase text-nobel-gold mb-8">{roadmapContent.tagline}</div>
              <h2 className="text-5xl md:text-7xl font-serif mb-16 text-stone-900 dark:text-stone-50 leading-tight">{roadmapContent.title}</h2>
              <div className="space-y-12">
                {roadmapContent.steps?.map((step, idx) => (
                  <motion.div 
                    key={step.quarter} className="flex gap-10 group/step"
                    initial={{ opacity: 0, x: 30 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: 0.2 + idx * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-[1.8rem] border border-nobel-gold/25 flex items-center justify-center font-bold text-xl text-nobel-gold bg-nobel-gold/5 transition-all duration-500 group-hover/step:bg-nobel-gold group-hover/step:text-white group-hover/step:shadow-[0_15px_30px_rgba(197,160,89,0.3)]">
                      {step.quarter}
                    </div>
                    <div>
                      <h4 className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-3 group-hover/step:text-nobel-gold transition-colors">{step.title}</h4>
                      <p className="text-xl text-stone-500 dark:text-stone-400 font-light leading-relaxed">{step.desc}</p>
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
          <div className="text-center mb-24">
            <FadeIn>
              <div className="text-xs font-bold tracking-[0.4em] uppercase text-stone-400 mb-8">{governanceContent.tagline}</div>
              <h2 className="text-5xl md:text-8xl font-serif text-stone-900 dark:text-stone-50 mb-10">{governanceContent.title}</h2>
              <p className="text-2xl font-light text-stone-500 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">{governanceContent.description}</p>
            </FadeIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {governanceTeam.map((author, i) => (
              <AuthorCard key={author.name} {...author} index={i} />
            ))}
          </div>
        </Container>
      </ParallaxSection>
    </>
  );
};
