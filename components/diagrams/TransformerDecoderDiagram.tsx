
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Layout, Shield, Database, FileJson, CheckCircle2, RefreshCw, Cpu, Activity, Info, Sparkles } from 'lucide-react';
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
    const stageDuration = 4000; 
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
    <div className="flex flex-col items-center w-full max-w-6xl p-12 md:p-24 my-16 border border-stone-200 dark:border-stone-800 rounded-[6rem] bg-stone-50 dark:bg-stone-950/90 backdrop-blur-4xl shadow-5xl relative overflow-hidden group">
      
      {/* Background Liquid Pipeline */}
      <div className="absolute top-[48%] left-10 right-10 h-3 bg-stone-200 dark:bg-stone-800/50 -translate-y-1/2 z-0 hidden lg:block rounded-full overflow-hidden">
        <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-nobel-gold to-emerald-500 shadow-[0_0_35px_rgba(197,160,89,0.8)]"
            initial={{ width: '0%' }}
            animate={{ width: `${(flowStep + 1) * 33.3}%` }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
        />
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200px_100%]"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <header className="flex flex-col md:flex-row items-center justify-between w-full mb-32 relative z-10 gap-10">
          <div className="text-center md:text-left">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-6xl md:text-8xl font-bold text-stone-900 dark:text-stone-50 leading-none tracking-tighter"
            >
              Sync-Pipeline
            </motion.h3>
            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
               <div className="h-0.5 w-12 bg-nobel-gold/50" />
               <p className="text-stone-400 font-light italic text-2xl tracking-tight">
                Federated Integrity Layer V2
               </p>
            </div>
          </div>
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0 rgba(197,160,89,0)',
                '0 0 30px 5px rgba(197,160,89,0.3)',
                '0 0 0 0 rgba(197,160,89,0)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-4 text-[13px] font-bold tracking-[0.5em] text-nobel-gold border-2 border-nobel-gold/30 px-14 py-7 rounded-full bg-nobel-gold/[0.04] shadow-xl"
          >
            <Activity size={20} className="animate-pulse" />
            TELEMETRY ACTIVE
          </motion.div>
      </header>

      <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-3 relative z-10 min-h-[520px]">
        
        {/* Step 1: Origin Station */}
        <StationCard 
          isActive={flowStep === 0}
          title="Genesis"
          tagline="Front-of-House"
          tooltip="Captures initial interactions from CRM and Marketing hubs."
          icon={Layout}
          activeColor="bg-blue-600"
          accentColor="rgba(59, 130, 246, 0.4)"
        >
          <AnimatePresence mode="wait">
            {flowStep === 0 && (
              <motion.div 
                key="origin-packet"
                initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: 200, scale: 0.5, filter: 'blur(10px)' }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-32 h-32 bg-blue-600 text-white rounded-[3rem] flex flex-col items-center justify-center shadow-4xl border-4 border-blue-400/40 relative group"
              >
                <FileJson size={48} />
                <span className="text-[11px] font-mono mt-4 font-black tracking-widest">RAW_OBJ</span>
                <motion.div 
                  className="absolute -inset-4 border border-blue-400/30 rounded-[3.5rem]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>

        {/* Step 2: Translation Station */}
        <StationCard 
          isActive={flowStep === 1}
          title="Fabric"
          tagline="Logic Orchestration"
          tooltip="Normalizes schemas and routes via n8n Metro backbone."
          icon={RefreshCw}
          activeColor="bg-nobel-gold"
          accentColor="rgba(197, 160, 89, 0.5)"
          iconAnimation={{ rotate: 360 }}
        >
          <AnimatePresence mode="wait">
            {flowStep === 1 && (
              <motion.div 
                key="transform-packet"
                initial={{ opacity: 0, x: -200, scale: 0.5, filter: 'blur(10px)' }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: [1, 1.15, 1],
                  rotate: 360
                }}
                exit={{ opacity: 0, x: 200, scale: 0.5, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className="w-36 h-36 bg-nobel-gold text-white rounded-full flex flex-col items-center justify-center shadow-5xl ring-[25px] ring-nobel-gold/15 relative"
              >
                <Layers size={54} />
                <span className="text-[12px] font-black mt-4 tracking-[0.3em] uppercase">SYNC</span>
                <Sparkles className="absolute top-2 right-2 text-white/50 animate-bounce" size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>

        {/* Step 3: Destination Station */}
        <StationCard 
          isActive={flowStep === 2}
          title="Canonical"
          tagline="Back-of-House Sync"
          tooltip="Finalizes records for compliance and analytical storage."
          icon={Shield}
          activeColor="bg-emerald-600"
          accentColor="rgba(16, 185, 129, 0.4)"
        >
          <AnimatePresence mode="wait">
            {flowStep === 2 && (
              <motion.div 
                key="dest-packet"
                initial={{ opacity: 0, x: -200, scale: 0.5, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="w-32 h-32 bg-emerald-600 text-white rounded-[3rem] flex flex-col items-center justify-center shadow-4xl border-4 border-emerald-400/40"
              >
                <Database size={48} />
                <motion.div 
                  initial={{ scale: 0, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring", damping: 12 }}
                  className="absolute -top-8 -right-8 bg-white dark:bg-stone-900 rounded-full p-3 border-[8px] border-emerald-500 shadow-3xl"
                >
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </StationCard>
      </div>

      <footer className="mt-32 w-full max-w-5xl bg-white/60 dark:bg-stone-900/60 p-14 rounded-[4rem] border border-stone-200/50 dark:border-stone-800/50 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-10">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Activity size={18} className="text-nobel-gold animate-pulse" />
              <span className="text-[13px] font-black text-stone-500 uppercase tracking-[0.5em]">Active Transaction</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.span 
                  key={packet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-5xl font-serif font-bold text-nobel-gold italic tracking-tight leading-none"
              >
                  {packet.label}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-8">
            {[0, 1, 2].map(s => (
              <motion.div 
                key={s}
                animate={{ 
                  scale: s === flowStep ? 2.5 : 1,
                  backgroundColor: s === flowStep ? "#C5A059" : "rgba(168, 162, 158, 0.15)",
                  boxShadow: s === flowStep ? "0 0 20px rgba(197,160,89,0.5)" : "none"
                }}
                className="w-5 h-5 rounded-full transition-all duration-1000"
              />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p 
            key={packet.desc}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl text-stone-500 text-center md:text-left leading-relaxed font-light border-l-[12px] border-nobel-gold/20 pl-14 py-4 italic"
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
          scale: isActive ? 1.06 : 1,
          boxShadow: isActive ? `0 60px 100px -30px ${accentColor}` : "0 10px 30px -15px rgba(0,0,0,0.1)",
          borderColor: isActive ? accentColor : "rgba(168, 162, 158, 0.1)",
          y: isActive ? -15 : 0
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative flex flex-col justify-between h-full p-16 bg-white dark:bg-stone-800/40 border-2 rounded-[5rem] transition-all duration-1000 overflow-hidden cursor-help group"
    >
        {/* Active Ambient Glow */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-current opacity-5 pointer-events-none"
              style={{ color: activeColor.replace('bg-', '') }}
            />
          )}
        </AnimatePresence>

        <div className="text-center mb-16 relative z-10">
            <motion.div 
              animate={isActive ? (iconAnimation || { y: [0, -12, 0] }) : {}}
              transition={isActive ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : {}}
              className={`inline-flex items-center justify-center w-24 h-24 mb-10 rounded-[2.5rem] transition-all duration-1000 ${isActive ? `${activeColor} text-white shadow-4xl scale-110 rotate-6` : 'bg-stone-100 dark:bg-stone-700/50 text-stone-400'}`}
            >
                <Icon size={44} />
            </motion.div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <h4 className="font-serif font-black text-4xl text-stone-800 dark:text-stone-100 tracking-tight">{title}</h4>
              <Info size={18} className="text-stone-300 dark:text-stone-600 group-hover:text-nobel-gold transition-colors" />
            </div>
            <p className="text-[12px] font-black text-stone-400 uppercase tracking-[0.5em] mt-6 opacity-80">{tagline}</p>
        </div>
        
        <div className="flex-grow flex items-center justify-center relative min-h-[200px] z-10">
            {children}
        </div>
        
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-0 h-2 bg-current opacity-40"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: "linear" }}
          />
        )}
    </motion.div>
  </Tooltip>
);
