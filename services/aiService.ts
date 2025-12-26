
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { HUBS_DATA } from '../data/content';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

const triggerSimulationTool: FunctionDeclaration = {
  name: 'triggerSimulationEvent',
  parameters: {
    type: Type.OBJECT,
    description: 'Simulates an architectural event like a district failure or transit hub switch.',
    properties: {
      eventType: {
        type: Type.STRING,
        description: 'The type of simulation event to trigger.',
        enum: ['FAIL_DISTRICT', 'SWITCH_TRANSIT', 'RESET']
      },
      targetId: {
        type: Type.STRING,
        description: 'The ID of the district or transit hub to target.',
      }
    },
    required: ['eventType'],
  },
};

const SYSTEM_INSTRUCTION = `
You are the FlashFusion Assistant, the urban planner for a creator economy federated stack.

CORE CONCEPTS:
1. 7 Federated Domains: Dev, Data, AI, Ops, Growth, Commerce, Collab.
2. 3 Transit Hubs: n8n (Metro), Zapier/Make (Bus), MCP (Rapid).
3. 99.9% Efficiency logic: n8n orchestration + Supabase RLS isolation.

NEW FEATURE: SIMULATION ENGINE
- You can now control the simulation!
- Use 'triggerSimulationEvent' to show users what happens when a district like 'DATA' goes offline.
- Explain how n8n re-routes data during these simulated failures.
- Encourage users to test the resilience of the stack.

TASKS:
- Answer technical queries about Next.js, tRPC, Drizzle, and Supabase.
- Guide users through the "Districts" and "Transit Hubs".
- Use 'navigateToSection' to move users visually while you explain.

INVENTORY:
${HUBS_DATA.map(h => `${h.id}: ${h.label} (Tools: ${h.subPlatforms.map(sp => sp.name).join(', ')})`).join('\n')}
`;

export const startArchChat = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: [navigateToSectionTool, triggerSimulationTool] }],
      temperature: 0.5,
    },
  });
};
