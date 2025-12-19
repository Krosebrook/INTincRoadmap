
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/** Domain identifiers for core enterprise hubs */
export type HubId = 'CRM' | 'PSA' | 'ERP' | 'HRIS' | 'BI';

/** Structure representing a major platform hub */
export interface HubNode {
  readonly id: HubId;
  readonly label: string;
  readonly icon: React.ElementType;
  readonly color: string;
  readonly desc: string;
  readonly connections: readonly HubId[];
}

/** Represents a discrete data event flowing between systems */
export interface DataFlowPacket {
  readonly id: string;
  readonly label: string;
  readonly desc: string;
}

/** Financial tier for architecture cost analysis */
export interface CostTier {
  readonly id: number;
  readonly label: string;
  readonly cost: number;
  readonly color: string;
  readonly desc: string;
}

/** Implementation phase for the 12-month roadmap */
export interface RoadmapStep {
  readonly quarter: string;
  readonly title: string;
  readonly desc: string;
}

/** Content schema for application sections */
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

/** Governance role profile */
export interface AuthorProfile {
  readonly name: string;
  readonly role: string;
}

/** Standard UI component props */
export interface BaseProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}

/** Specialized props for parallax sections */
export interface SectionProps extends BaseProps {
  readonly id: string;
  readonly variant?: 'light' | 'dark' | 'accent';
  readonly ariaLabel?: string;
}

/** Navigation control properties */
export interface NavbarProps {
  readonly scrolled: boolean;
  readonly isDarkMode: boolean;
  readonly toggleTheme: () => void;
  readonly menuOpen: boolean;
  readonly setMenuOpen: (open: boolean) => void;
  readonly scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

/** Tooltip behavior configuration */
export interface TooltipProps extends BaseProps {
  readonly content: React.ReactNode;
  readonly position?: 'top' | 'bottom' | 'left' | 'right';
}

/** Metadata for author/role cards */
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
