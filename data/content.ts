
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Database, Users, Briefcase, TrendingUp } from 'lucide-react';
import { 
  HubNode, 
  DataFlowPacket, 
  CostTier, 
  AuthorProfile, 
  SectionContent 
} from '../types';

export const APP_CONFIG = {
  appName: "ALPHAQUBIT",
  year: "2025",
  paperLink: "https://doi.org/10.1038/s41586-024-08148-8"
} as const;

export const SECTIONS: Record<string, SectionContent> = {
  hero: {
    id: "hero",
    tagline: "Enterprise Architecture • 2025",
    title: "AlphaQubit",
    subtitle: "Complete Platform Stack",
    description: "A comprehensive, federated architecture optimizing 50+ enterprise-grade platforms for B2B professional services operations."
  },
  introduction: {
    id: "introduction",
    tagline: "Executive Summary",
    title: "Federated & Best-of-Breed",
    description_p1: "We have mapped a complete ecosystem of 50+ platforms designed to scale from 50 to 500 employees. The architecture avoids monolithic lock-in by utilizing specialized tools for each department.",
    description_p2: "This stack bridges the gap between Front-of-House revenue generation and Back-of-House operations, connected via a robust AI and API layer."
  },
  infrastructure: {
    id: "infrastructure",
    tagline: "Core Infrastructure",
    title: "The 4-Hub Strategy",
    description: "Rather than one system doing everything poorly, we leverage four specialized Hubs that act as 'Sources of Truth' for their respective domains: CRM, PSA, ERP, and HRIS."
  },
  integration: {
    id: "integration",
    tagline: "Data Flow",
    title: "Seamless Integration",
    description: "Data flows automatically from opportunity to project, and project to invoice. Native connectors and iPaaS (Zapier/Workato) eliminate manual data entry between front-office and back-office."
  },
  investment: {
    id: "investment",
    tagline: "Financial Efficiency",
    title: "Strategic Investment",
    description: "Investing $6k-$13k per employee annually places AlphaQubit squarely within industry benchmarks for high-performance professional services firms."
  },
  roadmap: {
    id: "roadmap",
    tagline: "Implementation",
    title: "12-Month Roadmap",
    steps: [
      { quarter: "Q1", title: "Core Hubs", desc: "Deploy CRM, PSA, ERP, and HRIS. Establish source of truth." },
      { quarter: "Q2", title: "Revenue & Delivery", desc: "Arm sales and service teams with specialized tools (Outreach, Vanta, Jira)." },
      { quarter: "Q3", title: "Back-Office Ops", desc: "Automate finance (Bill.com) and HR (Greenhouse) workflows." },
      { quarter: "Q4", title: "AI & BI Layer", desc: "Deploy Claude Enterprise and Power BI dashboards." }
    ]
  },
  governance: {
    id: "governance",
    tagline: "Governance",
    title: "Platform Steering Committee",
    description: "Ensuring data quality, security, and adoption across the enterprise."
  }
};

export const HUBS_DATA: HubNode[] = [
  { 
    id: 'CRM', 
    label: 'CRM & Revenue', 
    icon: TrendingUp, 
    color: 'bg-blue-600', 
    desc: 'Customer Relationship Management. The "Front-of-House" engine managing pipeline, leads, and opportunities (HubSpot/Salesforce).',
    connections: ['PSA', 'ERP']
  },
  { 
    id: 'PSA', 
    label: 'PSA & Delivery', 
    icon: Briefcase, 
    color: 'bg-emerald-600', 
    desc: 'Project Services Automation. The delivery engine tracking utilization, resource planning, and billable hours (Operating.app/Kantata).',
    connections: ['ERP', 'CRM']
  },
  { 
    id: 'ERP', 
    label: 'ERP & Finance', 
    icon: Database, 
    color: 'bg-stone-700', 
    desc: 'Enterprise Resource Planning. The financial backbone handling GL, AP/AR, and revenue recognition (NetSuite/Sage).',
    connections: ['BI']
  },
  { 
    id: 'HRIS', 
    label: 'HRIS & People', 
    icon: Users, 
    color: 'bg-purple-600', 
    desc: 'Human Capital Management. The system of record for employee data, payroll, and org structure (Rippling/BambooHR).',
    connections: ['ERP', 'PSA']
  },
];

export const FLOW_PACKETS: DataFlowPacket[] = [
  { id: "deal-closed", label: "Deal Closed", desc: "CRM Opportunity → Project Created in PSA" },
  { id: "milestone", label: "Milestone", desc: "PSA Progress → Revenue Rec in ERP" },
  { id: "onboarding", label: "Onboarding", desc: "HRIS Hire → IT Provisioning via SSO" }
];

export const COST_TIERS: CostTier[] = [
  { id: 1, label: "Core Hubs", cost: 200, color: "bg-stone-800 dark:bg-stone-200", desc: "CRM, PSA, ERP, HRIS" },
  { id: 2, label: "Front-of-House", cost: 120, color: "bg-blue-600", desc: "Sales, Marketing, Delivery Tools" },
  { id: 3, label: "Back-of-House", cost: 105, color: "bg-emerald-600", desc: "Finance, HR, Legal, IT Ops" },
  { id: 4, label: "Collaboration", cost: 50, color: "bg-purple-600", desc: "Google/Microsoft, Slack, Zoom" },
  { id: 5, label: "AI & Auto", cost: 65, color: "bg-nobel-gold", desc: "Claude Enterprise, Gemini, Zapier" },
];

export const GOVERNANCE_ROLES: AuthorProfile[] = [
  { name: 'CEO', role: 'Executive Sponsor' },
  { name: 'CFO', role: 'Finance & BI Owner' },
  { name: 'VP Operations', role: 'PSA & Process Owner' },
  { name: 'VP Technical Svc', role: 'IT & Security Owner' },
  { name: 'VP HR', role: 'People Systems Owner' },
  { name: 'President', role: 'Revenue Systems Owner' }
];
