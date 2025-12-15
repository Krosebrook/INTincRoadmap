
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// --- System Architecture Types ---

export interface HubNode {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  desc: string;
  connections: string[];
}

export interface DataFlowPacket {
  label: string;
  desc: string;
}

export interface CostTier {
  id: number;
  label: string;
  cost: number;
  color: string;
  desc: string;
}

// --- Content Data Types ---

export interface SectionContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  tagline?: string;
}

export interface AuthorProfile {
  name: string;
  role: string;
}

// --- Component Prop Types ---

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface SectionProps extends BaseProps {
  id: string;
  variant?: 'light' | 'dark';
  ariaLabel?: string;
}

export interface NavbarProps {
  scrolled: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrollToSection: (id: string) => (e: React.MouseEvent) => void;
}

export interface TooltipProps extends BaseProps {
  content: React.ReactNode;
}

export interface AuthorCardProps {
  name: string;
  role: string;
  index: number;
}

// --- Theme Types ---

export type Theme = 'light' | 'dark';

export interface ThemeHook {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
