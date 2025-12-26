
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/** Domain identifiers for FlashFusion city districts */
export type HubId = 'DEV' | 'DATA' | 'AI' | 'OPS' | 'GROWTH' | 'COMMERCE' | 'COLLAB';

export interface SubPlatform {
  readonly name: string;
  readonly role: string;
}

export interface HubNode {
  readonly id: HubId;
  readonly label: string;
  readonly icon: React.ElementType;
  readonly color: string;
  readonly desc: string;
  readonly connections: readonly HubId[];
  readonly subPlatforms: readonly SubPlatform[];
}

export interface DataFlowPacket {
  readonly id: string;
  readonly label: string;
  readonly desc: string;
}

export interface CostTier {
  readonly id: number;
  readonly label: string;
  readonly cost: number;
  readonly color: string;
  readonly desc: string;
}

export interface RoadmapStep {
  readonly quarter: string;
  readonly title: string;
  readonly desc: string;
  readonly category: 'Intelligence' | 'Core' | 'Connectivity' | 'UX';
  readonly complexity: 'Low' | 'Medium' | 'High';
}

export interface SectionContent {
  readonly id: string;
  readonly tagline: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly description?: string;
  readonly description_p1?: string;
  readonly description_p2?: string;
  readonly steps?: readonly RoadmapStep[];
}

export interface AuthorProfile {
  readonly name: string;
  readonly role: string;
}

export interface BaseProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}

export interface SectionProps extends BaseProps {
  readonly id: string;
  readonly variant?: 'light' | 'dark' | 'accent';
  readonly ariaLabel?: string;
}

export interface NavbarProps {
  readonly scrolled: boolean;
  readonly isDarkMode: boolean;
  readonly toggleTheme: () => void;
  readonly menuOpen: boolean;
  readonly setMenuOpen: (open: boolean) => void;
  readonly scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

export interface TooltipProps extends BaseProps {
  readonly content: React.ReactNode;
  readonly position?: 'top' | 'bottom' | 'left' | 'right';
  readonly delay?: number;
}

export interface AuthorCardProps {
  readonly name: string;
  readonly role: string;
  readonly index: number;
}

export type Theme = 'light' | 'dark';

export interface ThemeHook {
  readonly isDarkMode: boolean;
  readonly toggleTheme: () => void;
}

/** Simulation engine state for interactive architectural testing */
export interface DistrictStatus {
  id: HubId;
  isActive: boolean;
  load: number; // 0-100
  health: number; // 0-100
  gpuAcceleration?: {
    isBoosted: boolean;
    tflops: number;
    vramUsed: number;
  };
}

export interface CityState {
  districts: Record<HubId, DistrictStatus>;
  transitHub: 'n8n' | 'Zapier' | 'Manual';
  simulationActive: boolean;
}

export interface CityContextType {
  state: CityState;
  toggleDistrict: (id: HubId) => void;
  setTransitHub: (hub: 'n8n' | 'Zapier' | 'Manual') => void;
  resetSimulation: () => void;
  toggleGPUBooost: () => void;
}
