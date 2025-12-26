
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity } from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const GPUInferenceDiagram: React.FC = () => {
  const { state } = useCity();
  const aiStatus = state.districts.AI;
  const gpu = aiStatus.gpuAcceleration;

  if (!gpu) return null;

  return (
    <div className="relative w-full h-[400px] bg-stone-900 rounded-[3rem] border border-stone-800 p-8 overflow-hidden font-sans">
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${aiStatus.isActive ? 'bg-emerald-500' : 'bg-stone-700'} text-white shadow-2xl`}>
            <Cpu size={32} />
          </div>
          <div>
            <h4 className="text-2xl font-serif font-bold text-white">H100 Tensor Grid</h4>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${aiStatus.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                {gpu.isBoosted ? 'MAX OVERCLOCK ACTIVE' : 'STEADY STATE'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Compute Throughput</div>
          <div className="text-3xl font-mono font-bold text-emerald-400">
            {gpu.tflops.toFixed(0)} <span className="text-sm font-light">TFLOPS</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 relative z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: aiStatus.isActive ? [0.4, 1, 0.4] : 0.1,
              scale: gpu.isBoosted ? [1, 1.1, 1] : 1,
              backgroundColor: gpu.isBoosted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.05)'
            }}
            transition={{ 
              duration: gpu.isBoosted ? 0.4 : 2, 
              repeat: Infinity, 
              delay: i * 0.1 
            }}
            className="h-20 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-500/30"
          >
            <Zap size={20} />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-[0.3em]">VRAM Utilization (80GB/Node)</span>
          <span className="text-[10px] font-mono text-white">{gpu.vramUsed.toFixed(1)} GB</span>
        </div>
        <div className="h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
          <motion.div 
            animate={{ width: `${(gpu.vramUsed / 80) * 100}%` }}
            className={`h-full ${gpu.isBoosted ? 'bg-fusion-bolt' : 'bg-emerald-500'} shadow-[0_0_15px_rgba(16,185,129,0.5)]`}
          />
        </div>
      </div>

      {/* Decorative Particle Stream */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -100, y: 100 + i * 50 }}
            animate={{ x: 800 }}
            transition={{ duration: gpu.isBoosted ? 1 : 3, repeat: Infinity, delay: i * 0.5 }}
            className="absolute w-20 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
          />
        ))}
      </div>
    </div>
  );
};
