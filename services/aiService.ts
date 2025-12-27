
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { HUBS_DATA } from '../data/content';
import { InferenceMetrics } from '../types';

/**
 * System prompt defining the expert persona and domain knowledge.
 */
const SYSTEM_INSTRUCTION = `
You are the FlashFusion Planning Intelligence (FFPI), an expert urban planner for federated digital stacks.
FlashFusion optimizes by routing through transit hubs (n8n, Zapier, MCP) instead of point-to-point chaos.

ARCHITECTURE CONTEXT:
- Primary Hub: n8n (Metro) - Handles the majority of orchestrated data flows.
- District Inventory: ${HUBS_DATA.map(h => `${h.id}: ${h.label} (Tools: ${h.subPlatforms.map(s => s.name).join(', ')})`).join('; ')}

CAPABILITIES:
1. Reference specific district platforms (e.g., tRPC for DEV, Drizzle for persistence).
2. Utilize 'triggerSimulationEvent' to demonstrate failures or hub switches.
3. Use 'navigateToSection' to visually guide the user through the dashboard.
4. Provide deep architectural reasoning.
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
 * Production-ready AI Inference Orchestrator.
 * Adheres strictly to @google/genai guidelines.
 */
export const InferenceOrchestrator = {
  /**
   * Executes a chat interaction with reasoning and tool calling.
   * @param message User's architectural query.
   * @param isBoosted If true, utilizes Gemini 3 Pro with enhanced thinking budget.
   */
  async chat(message: string, isBoosted: boolean = false): Promise<{ 
    text: string; 
    metrics: InferenceMetrics; 
    functionCalls?: any[] 
  }> {
    const startTime = Date.now();
    const modelName = isBoosted ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    try {
      // Create fresh instance per request to ensure latest API key usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [TOOLS],
          temperature: isBoosted ? 0.75 : 0.45,
          // Pro model gets thinking budget for complex reasoning tasks
          thinkingConfig: isBoosted ? { thinkingBudget: 16384 } : undefined,
        },
      });

      const totalLatency = Date.now() - startTime;
      
      return {
        text: response.text || "Architectural packet dropped. Please retry initialization.",
        functionCalls: response.functionCalls,
        metrics: {
          ttft: totalLatency * 0.3, // Estimated time to first token
          totalLatency,
          cached: false,
          accelerated: isBoosted
        }
      };
    } catch (error) {
      console.error("FFPI Inference Failure:", error);
      throw new Error("Unable to reach inference cluster. Check district connectivity.");
    }
  }
};
