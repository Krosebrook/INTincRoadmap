
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IntroductionSection } from './IntroductionSection';
import { InfrastructureSection } from './InfrastructureSection';
import { IntegrationSection } from './IntegrationSection';
import { SimulationSection } from './SimulationSection'; // New Feature
import { InvestmentSection } from './InvestmentSection';
import { RoadmapSection } from './RoadmapSection';
import { GovernanceSection } from './GovernanceSection';
import { SectionContent, AuthorProfile } from '../../types';

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

/**
 * MainContent Component
 * 
 * Acting as the layout orchestrator for the platform districts.
 * Now includes the "Simulation Engine" for interactive architectural stress-testing.
 */
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
      <IntroductionSection content={introContent} />
      <InfrastructureSection content={archContent} />
      <IntegrationSection content={integrationContent} />
      {/* Simulation Engine provides interactive "what-if" scenarios for the stack */}
      <SimulationSection /> 
      <InvestmentSection content={investmentContent} />
      <RoadmapSection content={roadmapContent} />
      <GovernanceSection content={governanceContent} team={governanceTeam} />
    </>
  );
};
