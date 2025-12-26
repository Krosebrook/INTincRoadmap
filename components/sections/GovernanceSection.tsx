
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FadeIn, ParallaxSection, Container, AuthorCard } from '../ui/Library';
import { SectionContent, AuthorProfile } from '../../types';

export const GovernanceSection: React.FC<{ content: SectionContent; team: readonly AuthorProfile[] }> = ({ content, team }) => (
  <ParallaxSection id={content.id} variant="light">
    <Container>
      <div className="text-center mb-24">
        <FadeIn>
          <div className="text-xs font-bold tracking-[0.4em] uppercase text-stone-400 mb-8">{content.tagline}</div>
          <h2 className="text-5xl md:text-8xl font-serif text-stone-900 dark:text-stone-50 mb-10">{content.title}</h2>
          <p className="text-2xl font-light text-stone-500 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">{content.description}</p>
        </FadeIn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
        {team.map((author, i) => (
          <AuthorCard key={author.name} {...author} index={i} />
        ))}
      </div>
    </Container>
  </ParallaxSection>
);
