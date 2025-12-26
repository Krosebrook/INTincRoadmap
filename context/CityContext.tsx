
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CityState, CityContextType, HubId, DistrictStatus } from '../types';

const INITIAL_DISTRICTS: HubId[] = ['DEV', 'DATA', 'AI', 'OPS', 'GROWTH', 'COMMERCE', 'COLLAB'];

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CityState>(() => ({
    districts: INITIAL_DISTRICTS.reduce((acc, id) => ({
      ...acc,
      [id]: { 
        id, 
        isActive: true, 
        load: 15 + Math.random() * 20, 
        health: 100,
        ...(id === 'AI' ? {
          gpuAcceleration: { isBoosted: false, tflops: 120, vramUsed: 42 }
        } : {})
      }
    }), {} as Record<HubId, DistrictStatus>),
    transitHub: 'n8n',
    simulationActive: false
  }));

  // Simulating live telemetry flux
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        districts: {
          ...prev.districts,
          AI: {
            ...prev.districts.AI,
            gpuAcceleration: prev.districts.AI.gpuAcceleration ? {
              ...prev.districts.AI.gpuAcceleration,
              tflops: prev.districts.AI.gpuAcceleration.isBoosted 
                ? 850 + Math.random() * 50 
                : 120 + Math.random() * 10,
              vramUsed: prev.districts.AI.gpuAcceleration.isBoosted 
                ? 78 + Math.random() * 2 
                : 42 + Math.random() * 3
            } : undefined
          }
        }
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const toggleDistrict = useCallback((id: HubId) => {
    setState(prev => {
      const newStatus = !prev.districts[id].isActive;
      return {
        ...prev,
        districts: {
          ...prev.districts,
          [id]: { 
            ...prev.districts[id], 
            isActive: newStatus,
            health: newStatus ? 100 : 0,
            load: newStatus ? 20 : 0
          }
        },
        simulationActive: true
      };
    });
  }, []);

  const toggleGPUBooost = useCallback(() => {
    setState(prev => ({
      ...prev,
      districts: {
        ...prev.districts,
        AI: {
          ...prev.districts.AI,
          gpuAcceleration: prev.districts.AI.gpuAcceleration ? {
            ...prev.districts.AI.gpuAcceleration,
            isBoosted: !prev.districts.AI.gpuAcceleration.isBoosted
          } : undefined
        }
      }
    }));
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

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within a CityProvider');
  return context;
};
