
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Layout, Shield, Database, FileJson, CheckCircle2, RefreshCw, Cpu, Activity, Info } from 'lucide-react';
import { FLOW_PACKETS } from '../../data/content';
import { Tooltip } from '../ui/Library';

/**
 * IntegrationLayerDiagram Component
 * 
 * Visualizes the data sync pipeline between federated systems.
 * Uses a synchronized Framer Motion cycle to illustrate multi-stage transformation logic.
 */
export const IntegrationLayerDiagram: React.FC = () => {
  const [activePacketIndex, setActivePacketIndex] = useState(0);
  const [flowStep, setFlowStep] = useState(0); // 0: Origin, 1: Translator, 2: Destination

  useEffect(() => {
    const stageDuration = 3500; 
    const interval = setInterval(() => {
        setFlowStep(prev => {
            if (prev >= 2) {
                setActivePacketIndex(p => (p + 1) % FLOW_PACKETS.length);
                return 0;
            }
            return prev + 1;
        });
    }, stageDuration); 
    
    return () => clearInterval(interval);
  }, []);

  const packet = useMemo(() => FLOW_PACKETS[activePacketIndex], [activePacketIndex]);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl p-12 md:p-20 my-16 border border-stone-200 dark:border-stone-800 rounded-[5rem] bg-stone-50 dark:bg-stone-950/80 backdrop-blur-3xl shadow-4xl relative overflow-hidden group">
      
      {/* Background Pipeline Tracer */}
      <div className="absolute top-[48%] left-0 right-0 h-2 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 z-0 opacity-20 hidden lg:block rounded-full">
        <motion.div 
            className="h-full bg-nobel-gold shadow-[0_0_25px_rgba(197,160,89,0.8)]"
            initial={{ width: '0%' }}
            animate={{ width: `${(flowStep + 1) * 33.3}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Animated Dash Stream */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,#C5A059_50%,transparent_100%)] bg-[length:40px_100%] opacity-40"
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <header className="flex flex-col md:flex-row items-center justify-between w-full mb-28 relative z-10 gap-10">
          <div className="text-center md:text-left">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-serif text-5xl md:text-7xl font-bold text-stone-900 dark:text-stone-50 leading-tight"
            >
              Sync-Pipeline V2
            </motion.h3>
            <p className="text-stone-400 mt-5 font-light italic text-2xl tracking-tight max-w-xl">
              Real-time cross-departmental integrity validation
            </p>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-5 text-[12px] font-bold tracking-[0.5em] text-nobel-gold border-2 border-nobel-gold/30 px-12 py-6 rounded-[2rem] bg-nobel-gold/[0.06] shadow-inner"
          >
            <Cpu size={24} className="animate-pulse" />
            LIVE OPS STREAM
          </motion.div>
      </header>

      <div className="grid w-full grid-cols-1 gap-14 lg:grid-cols-3 relative z-10 min-h-[500px]">
        
        {/* Step 1: Origin Station (Front-of-House) */}
        <StationCard 
          isActive={flowStep === 0}
          title="Front-of-House"
          tagline="Data Genesis"
          tooltip="Role: Data Ingestion. Acts as the Genesis Layer, capturing initial user interactions and commerce events from CRM and Marketing hubs to start the federated data flow."
          icon={Layout}
          activeColor="bg-blue-600"
          accentColor="rgba(59, 130, 246, 0.25)"
        >
          <AnimatePresence mode="wait">
            {flowStep === 0 && (
              <motion.div 
                key="origin-packet"
                initial={{ opacity: 0, scale: 0.6, x: -40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-28 h-28 bg-blue-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-3xl border-4 border-blue-400/40 relative"
              >
                <FileJson size={44} />
                <span className="text-[10px] font-mono mt-3 font-bold">SOURCE_OBJ</span>
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>

        {/* Step 2: Translation Station (Integration Fabric) */}
        <StationCard 
          isActive={flowStep === 1}
          title="Integration Fabric"
          tagline="Logic Normalization"
          tooltip="Role: Orchestration Hub. The city's central nervous system that normalizes disparate data schemas and routes packets through the n8n Metro backbone."
          icon={RefreshCw}
          activeColor="bg-nobel-gold"
          accentColor="rgba(197, 160, 89, 0.3)"
          iconAnimation={{ rotate: 360 }}
        >
          <AnimatePresence mode="wait">
            {flowStep === 1 && (
              <motion.div 
                key="transform-packet"
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 180, 270, 360] 
                }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-32 h-32 bg-nobel-gold text-white rounded-full flex flex-col items-center justify-center shadow-4xl ring-[20px] ring-nobel-gold/20"
              >
                <Layers size={48} />
                <span className="text-[11px] font-bold mt-4 tracking-widest uppercase">Transform</span>
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>

        {/* Step 3: Destination Station (Back-of-House) */}
        <StationCard 
          isActive={flowStep === 2}
          title="Back-of-House"
          tagline="Canonical Sync"
          tooltip="Role: Persistence & Audit. Finalizes validated records into enterprise systems for financial compliance, long-term storage, and analytical reporting."
          icon={Shield}
          activeColor="bg-emerald-600"
          accentColor="rgba(16, 185, 129, 0.25)"
        >
          <AnimatePresence mode="wait">
            {flowStep === 2 && (
              <motion.div 
                key="dest-packet"
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-28 h-28 bg-emerald-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-3xl border-4 border-emerald-400/40"
              >
                <Database size={44} />
                <motion.div 
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="absolute -top-6 -right-6 bg-white dark:bg-stone-900 rounded-full p-2.5 border-[6px] border-emerald-500 shadow-2xl"
                >
                  <CheckCircle2 size={28} className="text-emerald-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>
      </div>

      <footer className="mt-28 w-full max-w-5xl bg-white/70 dark:bg-stone-900/70 p-12 rounded-[3.5rem] border border-stone-200 dark:border-stone-800 shadow-inner">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-nobel-gold animate-pulse" />
              <span className="text-[12px] font-bold text-stone-400 uppercase tracking-[0.4em]">Current Event</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.span 
                  key={packet.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-4xl font-serif font-bold text-nobel-gold italic tracking-tight"
              >
                  "{packet.label}"
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-6">
            {[0, 1, 2].map(s => (
              <motion.div 
                key={s}
                animate={{ 
                  scale: s === flowStep ? 2.2 : 1,
                  backgroundColor: s === flowStep ? "#C5A059" : "rgba(168, 162, 158, 0.2)"
                }}
                className="w-4 h-4 rounded-full transition-all duration-700 shadow-md"
              />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p 
            key={packet.desc}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-2xl text-stone-500 text-center md:text-left leading-relaxed font-light border-l-[8px] border-nobel-gold/30 pl-12 py-3"
          >
            {packet.desc}
          </motion.p>
        </AnimatePresence>
      </footer>
    </div>
  );
};

const StationCard: React.FC<{
  isActive: boolean;
  title: string;
  tagline: string;
  tooltip: string;
  icon: React.ElementType;
  activeColor: string;
  accentColor: string;
  iconAnimation?: any;
  children: React.ReactNode;
}> = ({ isActive, title, tagline, tooltip, icon: Icon, activeColor, accentColor, iconAnimation, children }) => (
  <Tooltip content={tooltip} position="top" className="w-full h-full">
    <motion.div 
        animate={{ 
          scale: isActive ? 1.04 : 1,
          boxShadow: isActive ? `0 40px 80px -20px ${accentColor}` : "none",
          borderColor: isActive ? accentColor : "rgba(168, 162, 158, 0.1)"
        }}
        className="relative flex flex-col justify-between h-full p-14 bg-white dark:bg-stone-800/50 border-2 rounded-[4rem] transition-all duration-1000 overflow-hidden cursor-help group"
    >
        <div className="text-center mb-12 group-hover:opacity-90 transition-opacity">
            <motion.div 
              animate={isActive ? (iconAnimation || { y: [0, -8, 0] }) : {}}
              transition={isActive ? { repeat: Infinity, duration: 3.5, ease: "easeInOut" } : {}}
              className={`inline-flex items-center justify-center w-20 h-20 mb-10 rounded-[2.2rem] transition-all duration-1000 ${isActive ? `${activeColor} text-white shadow-3xl scale-110 rotate-3` : 'bg-stone-100 dark:bg-stone-700 text-stone-400'}`}
            >
                <Icon size={38} />
            </motion.div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h4 className="font-bold text-3xl text-stone-800 dark:text-stone-100 tracking-tight">{title}</h4>
              <Info size={14} className="text-stone-300 dark:text-stone-600 group-hover:text-nobel-gold transition-colors" />
            </div>
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.4em] mt-5 opacity-80">{tagline}</p>
        </div>
        
        <div className="flex-grow flex items-center justify-center relative min-h-[180px]">
            {children}
        </div>
        
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-0 h-1.5 bg-current opacity-30"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.5, ease: "linear" }}
          />
        )}
    </motion.div>
  </Tooltip>
);
