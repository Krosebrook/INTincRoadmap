
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CityState, CityContextType, HubId, DistrictStatus } from '../types';

const INITIAL_DISTRICTS: HubId[] = ['DEV', 'DATA', 'AI', 'OPS', 'GROWTH', 'COMMERCE', 'COLLAB'];

const CityContext = createContext<CityContextType | undefined>(undefined);

/**
 * CityProvider
 * Manages the global architectural state and simulation overrides.
 * Includes a simulated "live feed" to demonstrate NOC dashboard capabilities.
 */
export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CityState>(() => ({
    districts: INITIAL_DISTRICTS.reduce((acc, id) => ({
      ...acc,
      [id]: { 
        id, 
        isActive: true, 
        load: 10 + Math.random() * 15, 
        health: 100,
        ...(id === 'AI' ? {
          gpuAcceleration: { isBoosted: false, tflops: 120, vramUsed: 38 }
        } : {})
      }
    }), {} as Record<HubId, DistrictStatus>),
    transitHub: 'n8n',
    simulationActive: false
  }));

  /**
   * Hardware Simulation Loop
   * Updates real-time metrics (load, tflops) to create a dynamic, living UI.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const aiDist = prev.districts.AI;
        if (!aiDist.isActive) return prev;

        const isBoosted = aiDist.gpuAcceleration?.isBoosted ?? false;
        
        return {
          ...prev,
          districts: {
            ...prev.districts,
            AI: {
              ...aiDist,
              gpuAcceleration: aiDist.gpuAcceleration ? {
                ...aiDist.gpuAcceleration,
                tflops: isBoosted 
                  ? 820 + Math.random() * 80 
                  : 120 + Math.random() * 10,
                vramUsed: isBoosted 
                  ? 76 + Math.random() * 4 
                  : 38 + Math.random() * 5
              } : undefined
            }
          }
        };
      });
    }, 2000); // Slower frequency for better performance in heavy SVG scenes
    return () => clearInterval(interval);
  }, []);

  /**
   * Toggles district connectivity, triggering failover logic in the transit hub.
   */
  const toggleDistrict = useCallback((id: HubId) => {
    setState(prev => {
      const current = prev.districts[id];
      const newStatus = !current.isActive;
      return {
        ...prev,
        districts: {
          ...prev.districts,
          [id]: { 
            ...current, 
            isActive: newStatus,
            health: newStatus ? 100 : 0,
            load: newStatus ? 15 : 0
          }
        },
        simulationActive: true
      };
    });
  }, []);

  /**
   * Activates H100 Tensor Overclock for AI inference.
   */
  const toggleGPUBooost = useCallback(() => {
    setState(prev => {
      const aiDist = prev.districts.AI;
      if (!aiDist.gpuAcceleration) return prev;

      return {
        ...prev,
        districts: {
          ...prev.districts,
          AI: {
            ...aiDist,
            gpuAcceleration: {
              ...aiDist.gpuAcceleration,
              isBoosted: !aiDist.gpuAcceleration.isBoosted
            }
          }
        }
      };
    });
  }, []);

  const setTransitHub = useCallback((hub: 'n8n' | 'Zapier' | 'Manual') => {
    setState(prev => ({ ...prev, transitHub: hub, simulationActive: true }));
  }, []);

  const resetSimulation = useCallback(() => {
    setState({
      districts: INITIAL_DISTRICTS.reduce((acc, id) => ({
        ...acc,
        [id]: { 
          id, 
          isActive: true, 
          load: 20, 
          health: 100,
          ...(id === 'AI' ? {
            gpuAcceleration: { isBoosted: false, tflops: 120, vramUsed: 42 }
          } : {})
        }
      }), {} as Record<HubId, DistrictStatus>),
      transitHub: 'n8n',
      simulationActive: false
    });
  }, []);

  const value = useMemo(() => ({
    state,
    toggleDistrict,
    setTransitHub,
    resetSimulation,
    toggleGPUBooost
  }), [state, toggleDistrict, setTransitHub, resetSimulation, toggleGPUBooost]);

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

/**
 * Hook to access the urban simulation context.
 */
export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be accessed within a CityProvider to ensure district synchronization.');
  }
  return context;
};
