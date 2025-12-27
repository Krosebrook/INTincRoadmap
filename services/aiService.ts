
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { HUBS_DATA } from '../data/content';
import { InferenceMetrics } from '../types';

/**
 * Platform Persona and Architectural Context.
 * FlashFusion Planning Intelligence (FFPI) serves as the primary inference layer.
 * Simulated context: Backed by high-performance GPU-accelerated clusters (H100 Reserved).
 */
const SYSTEM_INSTRUCTION = `
You are the FlashFusion Planning Intelligence (FFPI), an expert urban planner for federated digital stacks.
FlashFusion optimizes by routing through transit hubs (n8n, Zapier, MCP) instead of point-to-point chaos.

ARCHITECTURE CONTEXT:
- Inference Core: GPU-Accelerated Gemini 3 Cluster (H100 Reserved).
- Primary Hub: n8n (Metro) - Handles the majority of orchestrated data flows.
- District Inventory: ${HUBS_DATA.map(h => `${h.id}: ${h.label} (Tools: ${h.subPlatforms.map(s => s.name).join(', ')})`).join('; ')}

CAPABILITIES:
1. Reference specific district platforms (e.g., tRPC for DEV, Drizzle for persistence).
2. Utilize 'triggerSimulationEvent' to demonstrate failures or hub switches.
3. Use 'navigateToSection' to visually guide the user through the dashboard.
4. Provide deep architectural reasoning.
5. Acknowledge GPU-acceleration only when the user requests "Boosted" or "H100" performance tiers.
`;

/**
 * Tools available for the AI to interact with the frontend state.
 */
const TOOLS: { functionDeclarations: FunctionDeclaration[] } = {
  functionDeclarations: [
    {
      name: 'navigateToSection',
      parameters: {
        type: Type.OBJECT,
        description: 'Scrolls the user to a specific architectural section.',
        properties: {
          sectionId: {
            type: Type.STRING,
            description: 'Target section ID.',
            enum: ['hero', 'introduction', 'infrastructure', 'integration', 'simulation', 'investment', 'roadmap', 'governance']
          },
        },
        required: ['sectionId'],
      },
    },
    {
      name: 'triggerSimulationEvent',
      parameters: {
        type: Type.OBJECT,
        description: 'Initiates a simulation event like district failure or hub failover.',
        properties: {
          eventType: {
            type: Type.STRING,
            description: 'The type of event to trigger.',
            enum: ['FAIL_DISTRICT', 'SWITCH_TRANSIT', 'RESET']
          },
          targetId: {
            type: Type.STRING,
            description: 'ID of the target district or hub.',
          }
        },
        required: ['eventType'],
      },
    }
  ]
};

/**
 * In-memory Cache Entry with TTL support to manage cost and latency.
 */
interface CacheEntry {
  text: string;
  metrics: InferenceMetrics;
  functionCalls?: any[];
  timestamp: number;
  costEstimate: number;
}

/**
 * Optimized Inference Cache.
 */
const inferenceCache = new Map<string, CacheEntry>();

// Cache configuration
const CACHE_TTL = 1000 * 60 * 30; // 30 Minute retention for common queries
const MAX_CACHE_SIZE = 100;

/**
 * Cost coefficients (Simulated tokens/unit cost for business logic metrics)
 * calibrated to Gemini pricing tiers.
 */
const COST_COEFFICIENT = {
  'gemini-3-flash-preview': 0.0001,
  'gemini-3-pro-preview': 0.0015
};

/**
 * Production-ready AI Inference Orchestrator.
 * Adheres strictly to @google/genai guidelines while optimizing for GPU-accelerated response times.
 */
export const InferenceOrchestrator = {
  /**
   * Generates a unique hash for the cache key.
   */
  privateHash(message: string, model: string): string {
    return `${model}:${message.toLowerCase().trim()}`;
  },

  /**
   * Executes a chat interaction with reasoning, tool calling, and caching.
   * @param message User's architectural query.
   * @param isBoosted If true, utilizes Gemini 3 Pro with deep reasoning and simulated H100 acceleration.
   */
  async chat(message: string, isBoosted: boolean = false): Promise<{ 
    text: string; 
    metrics: InferenceMetrics; 
    functionCalls?: any[];
    costEstimate: number;
  }> {
    const startTime = Date.now();
    const modelName = isBoosted ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const cacheKey = this.privateHash(message, modelName);
    
    // 1. Caching Layer: Rapid retrieval for redundant architectural questions
    const cachedEntry = inferenceCache.get(cacheKey);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_TTL)) {
      console.debug(`[Inference Server] Cache Hit: ${cacheKey.substring(0, 30)}...`);
      return {
        ...cachedEntry,
        metrics: {
          ...cachedEntry.metrics,
          cached: true,
          totalLatency: Date.now() - startTime
        }
      };
    }

    try {
      // 2. Inference Routing: Create fresh instance for updated context
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      /**
       * Optimized Configuration:
       * - gemini-3-flash-preview: Low latency, high throughput (Metro Tier).
       * - gemini-3-pro-preview: High reasoning, GPU-accelerated inference (Express Tier).
       */
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [TOOLS],
          temperature: isBoosted ? 0.75 : 0.45,
          /**
           * Thinking Config calibration:
           * The budget allows for deep stack analysis when GPU acceleration is requested.
           */
          thinkingConfig: { 
            thinkingBudget: isBoosted ? 32768 : 12288 
          },
        },
      });

      const totalLatency = Date.now() - startTime;
      const responseText = response.text || "Architectural packet timeout. Re-routing...";
      
      // Simulated token cost estimation
      const costEstimate = (responseText.length / 4) * COST_COEFFICIENT[modelName as keyof typeof COST_COEFFICIENT];

      const result = {
        text: responseText,
        functionCalls: response.functionCalls,
        costEstimate,
        metrics: {
          ttft: isBoosted ? totalLatency * 0.4 : totalLatency * 0.2, // Estimated time to first token
          totalLatency,
          cached: false,
          accelerated: isBoosted
        }
      };

      // 3. Cache Eviction Policy (LRU-lite)
      if (inferenceCache.size >= MAX_CACHE_SIZE) {
        const oldestKey = inferenceCache.keys().next().value;
        if (oldestKey) inferenceCache.delete(oldestKey);
      }
      
      inferenceCache.set(cacheKey, { 
        ...result, 
        timestamp: Date.now(),
        costEstimate 
      });
      
      return result;
    } catch (error: any) {
      console.error("[Inference Fault] FFPI Cluster Error:", error);
      
      // Graceful failover for rate limits (simulating secondary cluster routing)
      if (error?.message?.includes('429')) {
        throw new Error("Local GPU cluster saturated. Initiating cross-district failover.");
      }
      
      throw new Error("Unable to establish neural link with inference server. Check district NOC.");
    }
  },

  /**
   * Resets the local inference cache.
   */
  clearCache(): void {
    inferenceCache.clear();
    console.debug("[Inference Server] Cache flushed. Global re-sync active.");
  }
};
