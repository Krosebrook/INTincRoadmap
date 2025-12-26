
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FadeIn, ParallaxSection, Container } from '../ui/Library';
import { IntegrationLayerDiagram } from '../Diagrams';
import { NOCDashboard } from '../diagrams/NOCDashboard';
import { SectionContent } from '../../types';

export const IntegrationSection: React.FC<{ content: SectionContent }> = ({ content }) => {
  return (
    <ParallaxSection id={content.id} variant="dark" className="!py-0">
      <div className="bg-stone-950 py-40">
        <Container className="flex flex-col items-center">
          <div className="max-w-4xl text-center mb-24">
            <FadeIn>
              <div className="text-xs font-bold tracking-[0.5em] uppercase text-fusion-bolt mb-8">{content.tagline}</div>
              <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 leading-none">{content.title}</h2>
              <p className="text-2xl font-light text-stone-400 leading-relaxed max-w-3xl mx-auto">{content.description}</p>
            </FadeIn>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-12 w-full mb-24">
            <FadeIn delay={0.4} className="lg:col-span-8">
              <IntegrationLayerDiagram />
            </FadeIn>
            <FadeIn delay={0.6} className="lg:col-span-4">
              <NOCDashboard />
            </FadeIn>
          </div>
        </Container>
      </div>
    </ParallaxSection>
  );
};
