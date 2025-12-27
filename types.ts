
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/** 
 * Unique identifiers for the 7 federated districts of the FlashFusion ecosystem.
 */
export type HubId = 'DEV' | 'DATA' | 'AI' | 'OPS' | 'GROWTH' | 'COMMERCE' | 'COLLAB';

/**
 * Technical specification for a service integrated within a district.
 */
export interface SubPlatform {
  /** Commercial name of the service */
  readonly name: string;
  /** Primary architectural role within the stack */
  readonly role: string;
}

/**
 * Descriptor for a district node within the architectural visualization.
 */
export interface HubNode {
  /** Unique Hub ID */
  readonly id: HubId;
  /** Display label */
  readonly label: string;
  /** Visual icon component */
  readonly icon: React.ElementType;
  /** Tailwind-compatible background class */
  readonly color: string;
  /** Narrative description of the district's responsibility */
  readonly desc: string;
  /** Connected hubs for topological visualization */
  readonly connections: readonly HubId[];
  /** Integrated tools/platforms */
  readonly subPlatforms: readonly SubPlatform[];
}

/**
 * Metadata for high-level application content sections.
 */
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

/**
 * Definition for architectural expansion milestones.
 */
export interface RoadmapStep {
  readonly quarter: string;
  readonly title: string;
  readonly desc: string;
  readonly category: 'Intelligence' | 'Core' | 'Connectivity' | 'UX';
  readonly complexity: 'Low' | 'Medium' | 'High';
}

/**
 * Metadata for a data packet flow within the integration layer.
 */
export interface DataFlowPacket {
  readonly id: string;
  readonly label: string;
  readonly desc: string;
}

/**
 * Economic tier definition for stack components.
 */
export interface CostTier {
  readonly id: number;
  readonly label: string;
  readonly cost: number;
  readonly color: string;
  readonly desc: string;
}

/**
 * Profile for governance board members.
 */
export interface AuthorProfile {
  readonly name: string;
  readonly role: string;
}

/**
 * Standard base properties for presentation components.
 */
export interface BaseProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}

/**
 * Properties for top-level interactive layout sections.
 */
export interface SectionProps extends BaseProps {
  readonly id: string;
  readonly variant?: 'light' | 'dark' | 'accent';
  readonly ariaLabel?: string;
}

/**
 * System-wide theme state.
 */
export type Theme = 'light' | 'dark';

/**
 * Theme Hook return type.
 */
export interface ThemeHook {
  readonly isDarkMode: boolean;
  readonly toggleTheme: () => void;
}

/**
 * Telemetry status for an architectural district.
 */
export interface DistrictStatus {
  readonly id: HubId;
  readonly isActive: boolean;
  readonly load: number;
  readonly health: number;
  readonly gpuAcceleration?: {
    readonly isBoosted: boolean;
    readonly tflops: number;
    readonly vramUsed: number;
  };
}

/**
 * Global city state for the interactive simulation engine.
 */
export interface CityState {
  readonly districts: Record<HubId, DistrictStatus>;
  readonly transitHub: 'n8n' | 'Zapier' | 'Manual';
  readonly simulationActive: boolean;
}

/**
 * Controller interface for city simulation interactions.
 */
export interface CityContextType {
  readonly state: CityState;
  readonly toggleDistrict: (id: HubId) => void;
  readonly setTransitHub: (hub: 'n8n' | 'Zapier' | 'Manual') => void;
  readonly resetSimulation: () => void;
  readonly toggleGPUBooost: () => void;
}

/**
 * AI Performance metrics for real-time inference monitoring.
 */
export interface InferenceMetrics {
  readonly ttft: number;
  readonly totalLatency: number;
  readonly cached: boolean;
  readonly accelerated: boolean;
}

export interface AuthorCardProps {
  readonly name: string;
  readonly role: string;
  readonly index: number;
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
