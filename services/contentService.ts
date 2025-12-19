
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SECTIONS, HUBS_DATA, FLOW_PACKETS, COST_TIERS, GOVERNANCE_ROLES } from '../data/content';
import { SectionContent, HubNode, DataFlowPacket, CostTier, AuthorProfile } from '../types';

/**
 * Service layer for application content.
 * Decouples components from raw data structures.
 */
export const ContentService = {
  getSection(id: string): SectionContent {
    const section = SECTIONS[id];
    if (!section) throw new Error(`Section ${id} not found in content manifest.`);
    return section;
  },

  getAllHubs(): readonly HubNode[] {
    return HUBS_DATA;
  },

  getDataFlows(): readonly DataFlowPacket[] {
    return FLOW_PACKETS;
  },

  getInvestmentData(): readonly CostTier[] {
    return COST_TIERS;
  },

  getGovernanceTeam(): readonly AuthorProfile[] {
    return GOVERNANCE_ROLES;
  }
};
