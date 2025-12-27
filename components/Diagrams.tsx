
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { lazy, Suspense } from 'react';

// Lazy load the heavy architectural diagrams
const LazyHubArchitectureDiagram = lazy(() => import('./diagrams/SurfaceCodeDiagram').then(m => ({ default: m.HubArchitectureDiagram })));
const LazyIntegrationLayerDiagram = lazy(() => import('./diagrams/TransformerDecoderDiagram').then(m => ({ default: m.IntegrationLayerDiagram })));
const LazyCostAnalysisDiagram = lazy(() => import('./diagrams/PerformanceMetricDiagram').then(m => ({ default: m.CostAnalysisDiagram })));

/** Consistent loading state for lazily loaded architectural components */
const DiagramFallback = () => (
  <div className="w-full min-h-[400px] flex flex-col items-center justify-center bg-stone-100/20 dark:bg-stone-900/20 rounded-[3rem] border border-dashed border-stone-200 dark:border-stone-800 animate-pulse">
    <div className="w-12 h-12 border-4 border-fusion-bolt border-t-transparent rounded-full animate-spin mb-4" />
    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Synchronizing District Data...</span>
  </div>
);

// Wrapped exports that handle their own Suspense boundaries
export const HubArchitectureDiagram = (props: any) => (
  <Suspense fallback={<DiagramFallback />}>
    <LazyHubArchitectureDiagram {...props} />
  </Suspense>
);

export const IntegrationLayerDiagram = (props: any) => (
  <Suspense fallback={<DiagramFallback />}>
    <LazyIntegrationLayerDiagram {...props} />
  </Suspense>
);

export const CostAnalysisDiagram = (props: any) => (
  <Suspense fallback={<DiagramFallback />}>
    <LazyCostAnalysisDiagram {...props} />
  </Suspense>
);

// Tooltip is a lightweight UI utility and remains a direct export to avoid overhead
export { Tooltip } from './ui/Library';
