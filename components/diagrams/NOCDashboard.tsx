
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { DistrictStatus } from '../../types';

/**
 * NOCDashboard Component
 * 
 * Visualizes the real-time health and throughput of the FlashFusion transit hubs.
 * Now dynamically reacts to the District Simulation state.
 */
export const NOCDashboard: React.FC = () => {
  const { state } = useCity();
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const metrics = useMemo(() => {
    // Cast Object.values result to DistrictStatus[] to avoid "unknown" type errors during filtering
    const activeCount = (Object.values(state.districts) as DistrictStatus[]).filter(d => d.isActive).length;
    const isCrisis = activeCount < 5;
    
    return {
      throughput: isCrisis ? (600 + Math.random() * 200) : (1200 + Math.random() * 100),
      latency: isCrisis ? (45 + Math.random() * 20) : (15 + Math.random() * 5),
      uptime: isCrisis ? (98.4 + Math.random() * 1) : (99.998 + Math.random() * 0.001),
      activePackets: activeCount * 7,
      isCrisis
    };
  }, [state.districts, ticker]);

  return (
    <div className={`h-full p-8 border rounded-[3rem] shadow-2xl flex flex-col gap-6 font-sans transition-all duration-700 ${
      metrics.isCrisis ? 'bg-red-950/20 border-red-900/50' : 'bg-stone-900 border-stone-800'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${metrics.isCrisis ? 'bg-red-500' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            {metrics.isCrisis ? 'EMERGENCY PROTOCOL' : 'NOC LIVE FEED'}
          </span>
        </div>
        <span className="text-[10px] text-stone-500 font-mono">HUB: {state.transitHub}</span>
      </div>

      <MetricBox 
        label="Metro Throughput" 
        value={`${metrics.throughput.toFixed(0)} req/s`} 
        icon={Zap} 
        color={metrics.isCrisis ? "text-red-400" : "text-fusion-bolt"} 
      />
      <MetricBox 
        label="Rapid Latency (p95)" 
        value={`${metrics.latency.toFixed(0)}ms`} 
        icon={metrics.isCrisis ? AlertTriangle : Activity} 
        color={metrics.isCrisis ? "text-orange-400" : "text-fusion-metro"} 
      />
      <MetricBox 
        label="System Integrity" 
        value={`${metrics.uptime.toFixed(3)}%`} 
        icon={ShieldCheck} 
        color={metrics.isCrisis ? "text-red-500" : "text-emerald-500"} 
      />
      
      <div className="mt-auto pt-6 border-t border-stone-800">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Real-time Load Balancing</span>
          <span className="text-[9px] font-mono text-emerald-500">{metrics.activePackets} Active Packets</span>
        </div>
        <div className="flex gap-1.5 h-12 items-end">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i + ticker}
              initial={{ height: 0 }}
              animate={{ height: `${20 + Math.random() * 80}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className={`flex-1 rounded-t-sm ${metrics.isCrisis ? 'bg-red-500/40' : 'bg-fusion-bolt/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricBox: React.FC<{ label: string; value: string; icon: React.ElementType; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-stone-950/50 p-5 rounded-2xl border border-stone-800/50 flex items-center justify-between group hover:border-fusion-bolt/30 transition-colors">
    <div>
      <div className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
    </div>
    <div className={`p-2 rounded-lg bg-stone-900 ${color} opacity-50 group-hover:opacity-100 transition-opacity`}>
      <Icon size={18} />
    </div>
  </div>
);
