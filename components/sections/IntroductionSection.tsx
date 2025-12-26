
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FadeIn, ParallaxSection, Container } from '../ui/Library';
import { SectionContent } from '../../types';

export const IntroductionSection: React.FC<{ content: SectionContent }> = ({ content }) => (
  <ParallaxSection id={content.id} variant="light">
    <Container className="grid lg:grid-cols-12 gap-24 items-start">
      <div className="lg:col-span-5">
        <FadeIn>
          <div className="text-xs font-bold tracking-[0.4em] uppercase text-fusion-bolt mb-6">{content.tagline}</div>
          <h2 className="text-5xl md:text-7xl font-serif mb-10 text-stone-900 dark:text-stone-50 leading-[1.1]">{content.title}</h2>
          <div className="w-32 h-2 bg-fusion-bolt/30 rounded-full" />
        </FadeIn>
      </div>
      <div className="lg:col-span-7 space-y-12">
        <FadeIn delay={0.25}>
          <p className="text-3xl font-light leading-relaxed text-stone-600 dark:text-stone-300">
            <span className="text-9xl float-left mr-8 mt-[-15px] font-serif text-fusion-bolt/20 leading-[0.6] select-none">W</span>
            {content.description_p1}
          </p>
        </FadeIn>
        <FadeIn delay={0.45}>
          <p className="text-2xl font-light leading-relaxed text-stone-500 dark:text-stone-400 italic border-l-[10px] border-fusion-bolt/10 pl-12 py-4">
            {content.description_p2}
          </p>
        </FadeIn>
      </div>
    </Container>
  </ParallaxSection>
);
