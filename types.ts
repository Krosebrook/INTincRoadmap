
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/** 
 * Unique identifiers for the 7 federated districts of FlashFusion.
 */
export type HubId = 'DEV' | 'DATA' | 'AI' | 'OPS' | 'GROWTH' | 'COMMERCE' | 'COLLAB';

/**
 * Representation of a tool or service within a specific district.
 */
export interface SubPlatform {
  /** The commercial name of the service (e.g., "Supabase") */
  readonly name: string;
  /** The functional responsibility of this service in the stack */
  readonly role: string;
}

/**
 * Metadata for an architectural district node.
 */
export interface HubNode {
  /** The unique ID of the district */
  readonly id: HubId;
  /** Human-readable label for the UI */
  readonly label: string;
  /** Lucide icon component used for visualization */
  readonly icon: React.ElementType;
  /** Tailwind-compatible background color class */
  readonly color: string;
  /** Brief functional description of the district's purpose */
  readonly desc: string;
  /** IDs of other districts this node directly exchanges data with */
  readonly connections: readonly HubId[];
  /** Services contained within this district */
  readonly subPlatforms: readonly SubPlatform[];
}

/**
 * Represents a specific data transaction through the transit hubs.
 */
export interface DataFlowPacket {
  /** Unique transaction identifier */
  readonly id: string;
  /** Label describing the event */
  readonly label: string;
  /** Detailed description of the routing path */
  readonly desc: string;
}

/**
 * Financial tier data for cost-efficiency visualizations.
 */
export interface CostTier {
  /** Unique ID for chart indexing */
  readonly id: number;
  /** Name of the cost center */
  readonly label: string;
  /** Annual cost in thousands of dollars ($k) */
  readonly cost: number;
  /** Representative color for chart segments */
  readonly color: string;
  /** Breakdown of what is included in this cost */
  readonly desc: string;
}

/**
 * Future expansion step for the roadmap.
 */
export interface RoadmapStep {
  /** Projected delivery quarter (e.g., "Q3-25") */
  readonly quarter: string;
  /** Project title */
  readonly title: string;
  /** Deep dive into implementation details */
  readonly desc: string;
  /** Functional category for filtering */
  readonly category: 'Intelligence' | 'Core' | 'Connectivity' | 'UX';
  /** Estimated engineering complexity */
  readonly complexity: 'Low' | 'Medium' | 'High';
}

/**
 * Content schema for landing sections.
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
 * Public profile for governance board members.
 */
export interface AuthorProfile {
  readonly name: string;
  readonly role: string;
}

/**
 * Standard base properties for atomic UI components.
 */
export interface BaseProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}

/**
 * Properties for top-level architectural sections.
 */
export interface SectionProps extends BaseProps {
  readonly id: string;
  readonly variant?: 'light' | 'dark' | 'accent';
  readonly ariaLabel?: string;
}

/**
 * Configuration for the primary navigation system.
 */
export interface NavbarProps {
  readonly scrolled: boolean;
  readonly isDarkMode: boolean;
  readonly toggleTheme: () => void;
  readonly menuOpen: boolean;
  readonly setMenuOpen: (open: boolean) => void;
  readonly scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

/**
 * Hover-triggered UI overlay properties.
 */
export interface TooltipProps extends BaseProps {
  readonly content: React.ReactNode;
  readonly position?: 'top' | 'bottom' | 'left' | 'right';
  readonly delay?: number;
}

/**
 * Governance card properties.
 */
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

/** 
 * Live operational status for a federated district.
 */
export interface DistrictStatus {
  readonly id: HubId;
  readonly isActive: boolean;
  readonly load: number; // 0-100 percentage
  readonly health: number; // 0-100 percentage
  /** GPU specific telemetry for the AI Lab */
  readonly gpuAcceleration?: {
    readonly isBoosted: boolean;
    readonly tflops: number;
    readonly vramUsed: number;
  };
}

/**
 * Global application state for the FlashFusion urban simulation.
 */
export interface CityState {
  /** Map of district IDs to their operational status */
  readonly districts: Record<HubId, DistrictStatus>;
  /** Currently active routing backbone */
  readonly transitHub: 'n8n' | 'Zapier' | 'Manual';
  /** Whether the simulation engine has active overrides */
  readonly simulationActive: boolean;
}

/**
 * Controls for the simulation context.
 */
export interface CityContextType {
  readonly state: CityState;
  readonly toggleDistrict: (id: HubId) => void;
  readonly setTransitHub: (hub: 'n8n' | 'Zapier' | 'Manual') => void;
  readonly resetSimulation: () => void;
  readonly toggleGPUBooost: () => void;
}

/**
 * Local cache entry for AI responses to improve latency.
 */
export interface AICacheEntry {
  readonly prompt: string;
  readonly response: string;
  readonly timestamp: number;
  readonly metrics: {
    readonly latency: number;
    readonly tokens: number;
  };
}

/**
 * Real-time performance metrics for model inference.
 */
export interface InferenceMetrics {
  /** Time to first token in milliseconds */
  readonly ttft: number;
  /** Total request duration in milliseconds */
  readonly totalLatency: number;
  /** Flag for local cache hits */
  readonly cached: boolean;
  /** Flag for H100 GPU accelerated inference */
  readonly accelerated: boolean;
}
