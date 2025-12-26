
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Code, 
  Database, 
  Cpu, 
  Settings, 
  TrendingUp, 
  ShoppingBag, 
  MessageSquare 
} from 'lucide-react';
import { 
  HubNode, 
  DataFlowPacket, 
  CostTier, 
  AuthorProfile, 
  SectionContent,
  RoadmapStep
} from '../types';

export const APP_CONFIG = {
  appName: "FLASHFUSION",
  year: "2025",
  paperLink: "https://doi.org/10.1038/s41586-024-08148-8"
} as const;

export const ROADMAP_STEPS: readonly RoadmapStep[] = [
  { quarter: "Q1-25", category: "Core", title: "Metro Backbone", desc: "n8n deployment as the central city transit hub for all data packets.", complexity: "High" },
  { quarter: "Q1-25", category: "Connectivity", title: "RLS Audit", desc: "99.9% cost efficiency validation via Supabase Row-Level Security.", complexity: "Medium" },
  { quarter: "Q2-25", category: "Intelligence", title: "MCP Rapid Transit", desc: "Model Context Protocol integration for AI agent tool-access.", complexity: "High" },
  { quarter: "Q3-25", category: "UX", title: "District Visualization", desc: "Real-time NOC dashboards for the 7 federated domains.", complexity: "Medium" },
  { quarter: "Q4-25", category: "Connectivity", title: "Zapier/Make Failover", desc: "Secondary and tertiary transit routes established for resilience.", complexity: "Low" }
];

export const SECTIONS: Record<string, SectionContent> = {
  hero: {
    id: "hero",
    tagline: "Federated Creators • 2025",
    title: "FlashFusion",
    subtitle: "Orchestrated Ecosystem",
    description: "7 domains. 50+ tools. 3 transit hubs. Optimized for 99.9% cost efficiency via strategic RLS and n8n orchestration."
  },
  introduction: {
    id: "introduction",
    tagline: "City Infrastructure",
    title: "Districts & Transit",
    description_p1: "Just like a modern city, FlashFusion optimizes by routing through transit hubs (n8n, Zapier, MCP) instead of point-to-point chaos.",
    description_p2: "This 7-district federated architecture replaces 2,500 direct roads with 150 optimized connections, ensuring central visibility and cost predictability."
  },
  infrastructure: {
    id: "infrastructure",
    tagline: "7-Domain Topology",
    title: "The Federated Districts",
    description: "A comprehensive breakdown of the specialized domains that form the FlashFusion creator stack."
  },
  integration: {
    id: "integration",
    tagline: "Transit Hubs",
    title: "Metro, Bus & Rapid Transit",
    description: "n8n (Primary), Zapier/Make (Fallback), and MCP (AI-specific) ensure data reaches its destination with zero latency."
  },
  investment: {
    id: "investment",
    tagline: "Financial Efficiency",
    title: "99.9% Optimization",
    description: "By leveraging RLS for multi-tenant isolation and hub-based orchestration, we eliminate expensive per-seat licensing bloat."
  },
  roadmap: {
    id: "roadmap",
    tagline: "Implementation Planning",
    title: "District Expansion Plan",
    steps: ROADMAP_STEPS
  },
  governance: {
    id: "governance",
    tagline: "Governance",
    title: "The Urban Planning Board",
    description: "Ensuring the city grows sustainably through coordinated platform management."
  }
};

export const HUBS_DATA: HubNode[] = [
  { 
    id: 'DEV', 
    label: 'Dev District', 
    icon: Code, 
    color: 'bg-indigo-600', 
    desc: 'The building blocks. Next.js 15, TypeScript, tRPC, and Drizzle ORM.',
    connections: ['DATA', 'OPS'],
    subPlatforms: [
      { name: 'Next.js 15', role: 'Frontend Framework' },
      { name: 'tRPC', role: 'Type-Safe APIs' },
      { name: 'Drizzle', role: 'ORM layer' },
      { name: 'Vercel', role: 'Deployment' }
    ]
  },
  { 
    id: 'DATA', 
    label: 'Data District', 
    icon: Database, 
    color: 'bg-blue-600', 
    desc: 'Storage & Identity. Supabase PostgreSQL, RLS, and Auth.',
    connections: ['DEV', 'AI', 'GROWTH'],
    subPlatforms: [
      { name: 'Supabase', role: 'PostgreSQL Backend' },
      { name: 'Postgres RLS', role: 'Security/Isolation' },
      { name: 'Supabase Auth', role: 'Identity' },
      { name: 'Walrus', role: 'Object Storage' }
    ]
  },
  { 
    id: 'AI', 
    label: 'AI Labs', 
    icon: Cpu, 
    color: 'bg-emerald-600', 
    desc: 'GPU Accelerated Intelligence. NVIDIA H100 clusters, Claude 4.5, and MCP Servers.',
    connections: ['DATA', 'DEV', 'COLLAB'],
    subPlatforms: [
      { name: 'H100 Tensor', role: 'Inference Cluster' },
      { name: 'NVIDIA NIM', role: 'Model Microservices' },
      { name: 'Claude 4.5', role: 'Primary LLM' },
      { name: 'MCP', role: 'Tool Protocol' }
    ]
  },
  { 
    id: 'OPS', 
    label: 'Ops Center', 
    icon: Settings, 
    color: 'bg-rose-600', 
    desc: 'Monitor & Secure. Sentry, PostHog, and Prometheus.',
    connections: ['DEV', 'DATA'],
    subPlatforms: [
      { name: 'Sentry', role: 'Error Tracking' },
      { name: 'PostHog', role: 'Analytics' },
      { name: 'Grafana', role: 'NOC Dashboards' },
      { name: 'Docker', role: 'Runtime' }
    ]
  },
  { 
    id: 'GROWTH', 
    label: 'Growth Hub', 
    icon: TrendingUp, 
    color: 'bg-amber-600', 
    desc: 'Revenue & Marketing. HubSpot CRM and Cloudinary.',
    connections: ['COMMERCE', 'DATA'],
    subPlatforms: [
      { name: 'HubSpot', role: 'CRM/Marketing' },
      { name: 'Cloudinary', role: 'Media DAM' },
      { name: 'Apollo.io', role: 'Outreach' },
      { name: 'Intercom', role: 'Support' }
    ]
  },
  { 
    id: 'COMMERCE', 
    label: 'Commerce Zone', 
    icon: ShoppingBag, 
    color: 'bg-violet-600', 
    desc: 'Sales & Fulfillment. Stripe and Printify.',
    connections: ['GROWTH', 'DATA', 'OPS'],
    subPlatforms: [
      { name: 'Stripe', role: 'Payment Engine' },
      { name: 'Printify', role: 'POD Fulfillment' },
      { name: 'Shopify', role: 'Marketplace Sync' },
      { name: 'Stripe Tax', role: 'Compliance' }
    ]
  },
  { 
    id: 'COLLAB', 
    label: 'Collab Square', 
    icon: MessageSquare, 
    color: 'bg-teal-600', 
    desc: 'Team Coordination. Slack, Notion, and Linear.',
    connections: ['DEV', 'AI', 'GROWTH'],
    subPlatforms: [
      { name: 'Slack', role: 'Primary Messaging' },
      { name: 'Notion', role: 'Knowledge Base' },
      { name: 'Linear', role: 'Issue Tracking' },
      { name: 'Figma', role: 'Design Canvas' }
    ]
  }
];

export const FLOW_PACKETS: DataFlowPacket[] = [
  { id: "creator-publish", label: "Creator Publish", desc: "Supabase Event → n8n Metro → Cloudinary + Printify" },
  { id: "revenue-event", label: "Sale Occurs", desc: "Stripe Webhook → n8n → HubSpot Deal + PostHog" },
  { id: "ai-tool-call", label: "AI Tool Call", desc: "Claude → MCP Rapid Transit → Database Context" }
];

export const COST_TIERS: CostTier[] = [
  { id: 1, label: "Transit Backbone", cost: 40, color: "bg-fusion-bolt", desc: "n8n, Zapier, Make" },
  { id: 2, label: "Data District", cost: 25, color: "bg-blue-600", desc: "Supabase Pro (RLS Optimized)" },
  { id: 3, label: "GPU AI Cluster", cost: 1200, color: "bg-emerald-600", desc: "NVIDIA H100 Reserved Instances" },
  { id: 4, label: "Commerce Fees", cost: 580, color: "bg-violet-600", desc: "Stripe processing / Printify COGS" },
  { id: 5, label: "Urban Planning", cost: 69, color: "bg-teal-600", desc: "Slack, Notion, Linear seats" },
];

export const GOVERNANCE_ROLES: AuthorProfile[] = [
  { name: 'City Mayor', role: 'Executive Visionary' },
  { name: 'Urban Planner', role: 'Architecture Lead' },
  { name: 'Traffic Controller', role: 'Integration/n8n Lead' },
  { name: 'Chief Auditor', role: 'Security & RLS Lead' }
];
