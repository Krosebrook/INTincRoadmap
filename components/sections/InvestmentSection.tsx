
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FadeIn, ParallaxSection, Container } from '../ui/Library';
import { CostAnalysisDiagram } from '../Diagrams';
import { SectionContent } from '../../types';

export const InvestmentSection: React.FC<{ content: SectionContent }> = ({ content }) => (
  <ParallaxSection id={content.id} variant="light">
    <Container>
      <FadeIn className="max-w-5xl mx-auto text-center mb-24">
        <div className="text-xs font-bold tracking-[0.4em] uppercase text-stone-400 mb-6">{content.tagline}</div>
        <h2 className="text-5xl md:text-7xl font-serif text-stone-900 dark:text-stone-50 mb-10">{content.title}</h2>
        <p className="text-2xl font-light text-stone-500 dark:text-stone-400 leading-relaxed">{content.description}</p>
      </FadeIn>
      <FadeIn delay={0.5} className="max-w-6xl mx-auto"><CostAnalysisDiagram /></FadeIn>
    </Container>
  </ParallaxSection>
);
