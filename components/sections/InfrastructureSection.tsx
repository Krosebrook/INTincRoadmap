
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers } from 'lucide-react';
import { FadeIn, ParallaxSection, Container } from '../ui/Library';
import { HubArchitectureDiagram } from '../Diagrams';
import { SectionContent } from '../../types';

export const InfrastructureSection: React.FC<{ content: SectionContent }> = ({ content }) => (
  <ParallaxSection id={content.id} variant="accent">
    <Container className="grid lg:grid-cols-2 gap-24 items-center">
      <div className="order-2 lg:order-1">
        <FadeIn delay={0.3}><HubArchitectureDiagram /></FadeIn>
      </div>
      <div className="order-1 lg:order-2">
        <FadeIn>
          <div className="inline-flex items-center gap-4 px-6 py-3 border rounded-2xl bg-white dark:bg-stone-900 shadow-xl mb-10">
            <Layers size={20} className="text-fusion-bolt" />
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-stone-500 dark:text-stone-300">{content.tagline}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif mb-10 text-stone-900 dark:text-stone-50 leading-tight">{content.title}</h2>
          <p className="text-xl font-light text-stone-600 dark:text-stone-400 leading-relaxed mb-10">{content.description}</p>
        </FadeIn>
      </div>
    </Container>
  </ParallaxSection>
);
