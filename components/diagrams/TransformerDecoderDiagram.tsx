
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers, Layout, Shield, Database, Zap, FileJson, CheckCircle2, RefreshCw, Cpu } from 'lucide-react';
import { FLOW_PACKETS } from '../../data/content';
import { Tooltip } from '../ui/Library';

export const IntegrationLayerDiagram: React.FC = () => {
  const [activePacketIndex, setActivePacketIndex] = useState(0);
  const [flowStep, setFlowStep] = useState(0); // 0: Origin, 1: Translator, 2: Destination

  useEffect(() => {
    const totalSteps = 3; 
    const stepDuration = 3500; 
    
    const interval = setInterval(() => {
        setFlowStep(prev => {
            const next = prev + 1;
            if (next >= totalSteps) {
                setActivePacketIndex(p => (p + 1) % FLOW_PACKETS.length);
                return 0;
            }
            return next;
        });
    }, stepDuration); 
    
    return () => clearInterval(interval);
  }, []);

  const packet = FLOW_PACKETS[activePacketIndex];

  return (
    <div className="flex flex-col items-center w-full max-w-6xl p-10 md:p-16 my-10 transition-all duration-1000 border border-stone-200 dark:border-stone-800 rounded-[3.5rem] bg-stone-50 dark:bg-stone-950/40 backdrop-blur-md shadow-3xl relative overflow-hidden group">
      
      {/* Dynamic Connector Path Background */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 z-0 opacity-30 md:block hidden">
        <motion.div 
            className="h-full bg-nobel-gold"
            initial={{ width: '0%' }}
            animate={{ width: `${(flowStep + 1) * 33}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>

      <header className="flex flex-col md:flex-row items-center justify-between w-full mb-20 relative z-10 gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-3xl md:text-5xl font-bold text-stone-900 dark:text-stone-50 leading-tight">Sync-Pipeline V2</h3>
            <p className="text-stone-500 mt-3 font-light italic text-xl">System-to-system integrity validation</p>
          </div>
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1], 
              borderColor: ["rgba(197,160,89,0.1)", "rgba(197,160,89,0.5)", "rgba(197,160,89,0.1)"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 text-[11px] font-bold tracking-[0.5em] text-nobel-gold border-2 px-8 py-4 rounded-2xl shadow-sm bg-nobel-gold/[0.03]"
          >
            <Cpu size={18} className="animate-pulse" />
            ENGINE LIVE
          </motion.div>
      </header>

      <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-3 relative z-10 min-h-[450px]">
        
        {/* Step 1: Origin Station */}
        <div className="relative">
            <motion.div 
                animate={{ 
                  scale: flowStep === 0 ? 1.05 : 1,
                  boxShadow: flowStep === 0 ? "0 20px 50px -10px rgba(59, 130, 246, 0.2)" : "none",
                  borderColor: flowStep === 0 ? "rgba(59, 130, 246, 0.4)" : "transparent"
                }}
                className="relative flex flex-col justify-between h-full p-12 bg-white dark:bg-stone-800/60 border-2 rounded-[3rem] transition-all duration-700 overflow-hidden"
            >
                <div className="text-center mb-10">
                    <motion.div 
                      animate={flowStep === 0 ? { y: [0, -5, 0], scale: 1.1 } : {}}
                      className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-3xl transition-all duration-700 ${flowStep === 0 ? 'bg-blue-600 text-white shadow-2xl' : 'bg-stone-100 dark:bg-stone-700 text-stone-400'}`}
                    >
                        <Layout size={32} />
                    </motion.div>
                    <h4 className="font-bold text-2xl text-stone-800 dark:text-stone-100">Origin Station</h4>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] mt-3">Event Creation</p>
                </div>
                
                <div className="flex-grow flex items-center justify-center relative min-h-[160px]">
                    <AnimatePresence mode="popLayout">
                      {flowStep === 0 && (
                          <motion.div 
                              layoutId="data-flow-packet"
                              initial={{ opacity: 0, scale: 0.2, x: -50 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.5, x: 200 }}
                              transition={{ type: "spring", stiffness: 180, damping: 20 }}
                              className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-2xl border-4 border-blue-400/30 z-30"
                          >
                              <FileJson size={40} />
                              <span className="text-[11px] font-mono mt-3 font-bold tracking-tighter">DATA_PKT</span>
                          </motion.div>
                      )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-10">
                  {['Salesforce', 'HubSpot'].map(t => (
                    <span key={t} className="px-5 py-2.5 text-[10px] font-bold border rounded-xl bg-stone-50/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-700 text-stone-500 uppercase tracking-[0.2em]">{t}</span>
                  ))}
                </div>
            </motion.div>
        </div>

        {/* Step 2: Translation Station */}
        <div className="relative">
            <motion.div 
                animate={{ 
                  scale: flowStep === 1 ? 1.08 : 1,
                  boxShadow: flowStep === 1 ? "0 20px 50px -10px rgba(197, 160, 89, 0.25)" : "none",
                  borderColor: flowStep === 1 ? "rgba(197, 160, 89, 0.6)" : "transparent"
                }}
                className="relative flex flex-col justify-between h-full p-12 bg-white dark:bg-stone-800/60 border-2 rounded-[3rem] transition-all duration-700 overflow-hidden"
            >
                <div className="text-center mb-10">
                    <motion.div 
                      animate={flowStep === 1 ? { rotate: 360 } : {}}
                      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                      className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-3xl transition-all duration-700 ${flowStep === 1 ? 'bg-nobel-gold text-white shadow-2xl scale-110' : 'bg-stone-100 dark:bg-stone-700 text-stone-400'}`}
                    >
                        <RefreshCw size={32} />
                    </motion.div>
                    <h4 className="font-bold text-2xl text-stone-800 dark:text-stone-100">Translation</h4>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] mt-3">iPaaS Normalization</p>
                </div>
                
                <div className="flex-grow flex items-center justify-center relative min-h-[160px]">
                    <AnimatePresence mode="popLayout">
                      {flowStep === 1 && (
                          <motion.div 
                              layoutId="data-flow-packet"
                              initial={{ opacity: 0, x: -200 }}
                              animate={{ 
                                opacity: 1, 
                                x: 0,
                                rotate: [0, 90, 180, 270, 360]
                              }}
                              exit={{ opacity: 0, x: 200 }}
                              transition={{ duration: 1, ease: "circOut" }}
                              className="w-28 h-28 bg-nobel-gold text-white rounded-full flex flex-col items-center justify-center shadow-3xl z-30 ring-[15px] ring-nobel-gold/10"
                          >
                              <Layers size={44} />
                              <span className="text-[11px] font-bold mt-3 tracking-widest uppercase">Transform</span>
                          </motion.div>
                      )}
                    </AnimatePresence>
                </div>
                
                <div className="text-[10px] text-center text-stone-400 font-bold uppercase tracking-[0.3em] mt-10 flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-nobel-gold animate-ping" />
                    Syncing Schema
                </div>
            </motion.div>
        </div>

        {/* Step 3: Destination Station */}
        <div className="relative">
            <motion.div 
                animate={{ 
                  scale: flowStep === 2 ? 1.05 : 1,
                  boxShadow: flowStep === 2 ? "0 20px 50px -10px rgba(16, 185, 129, 0.2)" : "none",
                  borderColor: flowStep === 2 ? "rgba(16, 185, 129, 0.4)" : "transparent"
                }}
                className="relative flex flex-col justify-between h-full p-12 bg-white dark:bg-stone-800/60 border-2 rounded-[3rem] transition-all duration-700 overflow-hidden"
            >
                <div className="text-center mb-10">
                    <motion.div 
                      animate={flowStep === 2 ? { scale: [1, 1.25, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-3xl transition-all duration-700 ${flowStep === 2 ? 'bg-emerald-600 text-white shadow-2xl' : 'bg-stone-100 dark:bg-stone-700 text-stone-400'}`}
                    >
                        <Shield size={32} />
                    </motion.div>
                    <h4 className="font-bold text-2xl text-stone-800 dark:text-stone-100">Persistence</h4>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] mt-3">Source of Truth</p>
                </div>
                
                <div className="flex-grow flex items-center justify-center relative min-h-[160px]">
                    <AnimatePresence mode="popLayout">
                      {flowStep === 2 && (
                          <motion.div 
                              layoutId="data-flow-packet"
                              initial={{ opacity: 0, x: -200 }}
                              animate={{ opacity: 1, x: 0, scale: [1, 1.1, 1] }}
                              transition={{ type: "spring", stiffness: 180, damping: 20 }}
                              className="w-24 h-24 bg-emerald-600 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-2xl border-4 border-emerald-400/30 z-30"
                          >
                              <Database size={40} />
                              <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="absolute -top-5 -right-5 bg-white dark:bg-stone-900 rounded-full p-2 border-4 border-emerald-500 shadow-2xl"
                              >
                                <CheckCircle2 size={24} className="text-emerald-500" />
                              </motion.div>
                          </motion.div>
                      )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-10">
                  {['NetSuite', 'Sage'].map(t => (
                    <span key={t} className="px-5 py-2.5 text-[10px] font-bold border rounded-xl bg-stone-50/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-700 text-stone-500 uppercase tracking-[0.2em]">{t}</span>
                  ))}
                </div>
            </motion.div>
        </div>
      </div>

      {/* Progress Footer */}
      <footer className="mt-20 w-full max-w-4xl bg-white/50 dark:bg-stone-900/50 p-8 rounded-3xl border border-stone-200 dark:border-stone-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.5em]">Active Transaction:</span>
            <AnimatePresence mode="wait">
              <motion.span 
                  key={packet.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="text-2xl font-serif font-bold text-nobel-gold italic"
              >
                  "{packet.label}"
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-4">
            {[0, 1, 2].map(s => (
              <motion.div 
                key={s}
                animate={{ 
                  scale: s === flowStep ? 1.8 : 1,
                  backgroundColor: s === flowStep ? "#C5A059" : "rgba(168, 162, 158, 0.2)"
                }}
                className="w-5 h-5 rounded-full shadow-inner"
              />
            ))}
          </div>
        </div>
        <motion.p 
          key={packet.desc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-stone-500 text-center md:text-left leading-relaxed font-light border-l-8 border-nobel-gold/30 pl-8 py-3"
        >
          {packet.desc}
        </motion.p>
      </footer>
    </div>
  );
};
