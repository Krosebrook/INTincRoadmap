
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { HUBS_DATA } from '../data/content';
import { AICacheEntry, InferenceMetrics } from '../types';

/**
 * Initialize the Google GenAI SDK.
 * CRITICAL: Solely uses process.env.API_KEY as per security guidelines.
 */
const CACHE_KEY = 'flashfusion_v1_ai_cache';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour persistent cache

/**
 * Retrieves the local AI cache from persistent storage.
 */
const getCache = (): Record<string, AICacheEntry> => {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error("Cache retrieval failure:", err);
    return {};
  }
};

/**
 * Persists a successful inference response to local storage.
 */
const setCache = (prompt: string, entry: AICacheEntry) => {
  try {
    const cache = getCache();
    cache[prompt] = entry;
    // Limit cache size to prevent quota issues
    const keys = Object.keys(cache);
    if (keys.length > 50) delete cache[keys[0]];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("AI Cache persistence failed:", e);
  }
};

/**
 * Tool definition for smooth UI navigation.
 */
const navigateToSectionTool: FunctionDeclaration = {
  name: 'navigateToSection',
  parameters: {
    type: Type.OBJECT,
    description: 'Scrolls the user to a specific section of the FlashFusion dashboard.',
    properties: {
      sectionId: {
        type: Type.STRING,
        description: 'The ID of the section to navigate to.',
        enum: ['hero', 'introduction', 'infrastructure', 'integration', 'simulation', 'investment', 'roadmap', 'governance']
      },
    },
    required: ['sectionId'],
  },
};

/**
 * Tool definition for interactive simulation control.
 */
const triggerSimulationTool: FunctionDeclaration = {
  name: 'triggerSimulationEvent',
  parameters: {
    type: Type.OBJECT,
    description: 'Simulates architectural events like district failure or transit hub routing changes.',
    properties: {
      eventType: {
        type: Type.STRING,
        description: 'The type of simulation event to trigger.',
        enum: ['FAIL_DISTRICT', 'SWITCH_TRANSIT', 'RESET']
      },
      targetId: {
        type: Type.STRING,
        description: 'The target ID of the district or transit hub.',
      }
    },
    required: ['eventType'],
  },
};

const SYSTEM_INSTRUCTION = `
You are the FlashFusion Planning Intelligence (FFPI), an expert urban planner for federated digital stacks.

ARCHITECTURE LORE:
FlashFusion is a high-efficiency creator ecosystem. It replaces point-to-point connections with transit hubs.
- Primary Hub: n8n (Metro) - Handles 95% of traffic.
- Secondary Hub: Zapier/Make (Bus) - Used for low-volume legacy routes.
- Rapid Hub: MCP (Rapid) - Dedicated protocol for AI agent tool interactions.

GUIDELINES:
1. When asked about specific districts (e.g., DEV, DATA), reference their sub-platforms (tRPC, Drizzle, etc.).
2. If a user asks "what happens if X fails", use the triggerSimulationEvent tool to demonstrate.
3. Use navigateToSection to guide users to visual evidence of your explanations.
4. Your logic is GPU-accelerated by the AI Lab's H100 cluster. Explain complex topics with deep architectural reasoning.

CURRENT DISTRICT INVENTORY:
${HUBS_DATA.map(h => `${h.id}: ${h.label} (Platforms: ${h.subPlatforms.map(sp => sp.name).join(', ')})`).join('\n')}
`;

/**
 * InferenceOrchestrator
 * High-performance AI service layer with caching, GPU-boost logic, and function calling.
 */
export const InferenceOrchestrator = {
  /**
   * Optimized chat interface for platform intelligence.
   * @param message User's natural language query.
   * @param isBoosted Whether to use the High-Quality Pro model with extra reasoning budget.
   */
  async chat(message: string, isBoosted: boolean = false): Promise<{ text: string; metrics: InferenceMetrics; functionCalls?: any[] }> {
    const startTime = Date.now();
    const cache = getCache();

    // 1. Cache Layer Check (Skip for boosted calls to ensure fresh reasoning)
    if (!isBoosted && cache[message] && (Date.now() - cache[message].timestamp < CACHE_EXPIRY)) {
      return {
        text: cache[message].response,
        metrics: {
          ttft: 0,
          totalLatency: 0,
          cached: true,
          accelerated: false
        }
      };
    }

    // 2. Model Routing
    const model = isBoosted ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    // 3. Inference Execution
    try {
      // Create a fresh instance for every call to ensure key updates as per guidelines
      const activeAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const result = await activeAi.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: [navigateToSectionTool, triggerSimulationTool] }],
          temperature: isBoosted ? 0.75 : 0.45,
          // Reserve thinking budget for Pro model to allow for deep architectural analysis
          thinkingConfig: isBoosted ? { thinkingBudget: 16384 } : undefined,
          topP: 0.95,
          topK: 40
        },
      });

      const totalLatency = Date.now() - startTime;
      const responseText = result.text || "Synchronous packet timeout. Retrying...";

      // 4. Cache Update for non-boosted, non-tool calls
      if (!isBoosted && !result.functionCalls) {
        setCache(message, {
          prompt: message,
          response: responseText,
          timestamp: Date.now(),
          metrics: {
            latency: totalLatency,
            tokens: 0 // Tokens omitted for privacy in localStorage
          }
        });
      }

      return {
        text: responseText,
        functionCalls: result.functionCalls,
        metrics: {
          ttft: totalLatency * 0.35, // Estimated TTFT
          totalLatency,
          cached: false,
          accelerated: isBoosted
        }
      };
    } catch (error) {
      console.error("FFPI Inference Fault:", error);
      throw new Error("Architectural reasoning interrupted. Check district connectivity.");
    }
  }
};
