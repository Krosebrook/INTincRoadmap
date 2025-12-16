
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers, Layout, Shield, Database, Zap, FileJson, CheckCircle2 } from 'lucide-react';
import { FLOW_PACKETS } from '../../data/content';
import { Tooltip } from '../ui/Library';

export const IntegrationLayerDiagram: React.FC = () => {
  const [activePacketIndex, setActivePacketIndex] = useState(0);
  const [flowStep, setFlowStep] = useState(0); // 0: Start, 1: Middle, 2: End

  useEffect(() => {
    const totalSteps = 3; 
    const stepDuration = 2000; // ms per step
    
    const interval = setInterval(() => {
        setFlowStep(prev => {
            const next = prev + 1;
            if (next >= totalSteps) {
                // Cycle to next packet when flow completes
                setActivePacketIndex(p => (p + 1) % FLOW_PACKETS.length);
                return 0;
            }
            return next;
        });
    }, stepDuration); 
    
    return () => clearInterval(interval);
  }, []);

  const packet = FLOW_PACKETS[activePacketIndex];

  // Helper to determine line activity
  const isLineActive = (lineIndex: number) => {
      // Line 1 (Front -> Integration) active during step 0 -> 1 transition
      if (lineIndex === 1) return flowStep >= 0; 
      // Line 2 (Integration -> Back) active during step 1 -> 2 transition
      if (lineIndex === 2) return flowStep >= 1;
      return false;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl p-8 my-8 transition-colors duration-500 border rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 select-none relative overflow-hidden">
      
      {/* Background SVG Connectors with Reactive Animation (Desktop) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" aria-hidden="true">
        <defs>
            <linearGradient id="activeLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="#C5A059" stopOpacity="1"/>
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="inactiveLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e7e5e4" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#e7e5e4" stopOpacity="0.2"/>
            </linearGradient>
        </defs>
        
        {/* Line 1: Front to Middle */}
        <motion.line 
            x1="16%" y1="50%" x2="50%" y2="50%" 
            stroke={isLineActive(1) ? "url(#activeLineGradient)" : "#e7e5e4"}
            strokeWidth={isLineActive(1) ? 3 : 2}
            strokeDasharray={isLineActive(1) ? "none" : "4 4"}
            initial={false}
            animate={{ 
                strokeOpacity: isLineActive(1) ? 1 : 0.3,
                strokeDashoffset: isLineActive(1) ? -20 : 0
            }}
            transition={{ duration: 0.5 }}
        />
        {/* Active particle on Line 1 */}
        {flowStep === 0 && (
             <motion.circle r="3" fill="#C5A059" filter="url(#glow)">
                <animateMotion 
                    dur="2s" 
                    repeatCount="1"
                    path="M150,150 L450,150" // Approximate coords, handled via percentages usually but tricky in pure SVG inside React without measuring. 
                    // Fallback to simpler CSS animation or just reliance on the 'token' layoutId
                />
             </motion.circle>
        )}

        {/* Line 2: Middle to Back */}
        <motion.line 
            x1="50%" y1="50%" x2="84%" y2="50%" 
            stroke={isLineActive(2) ? "url(#activeLineGradient)" : "#e7e5e4"}
            strokeWidth={isLineActive(2) ? 3 : 2}
            strokeDasharray={isLineActive(2) ? "none" : "4 4"}
            initial={false}
            animate={{ 
                strokeOpacity: isLineActive(2) ? 1 : 0.3 
            }}
            transition={{ duration: 0.5 }}
        />
      </svg>

      <header className="flex items-center justify-between w-full mb-10 relative z-10">
          <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">Integration Data Flow</h3>
          <div className="flex items-center gap-2 text-xs font-mono text-nobel-gold border border-nobel-gold/30 px-3 py-1 rounded-full bg-nobel-gold/5">
            <Zap size={12} className="fill-current" />
            LIVE SIMULATION
          </div>
      </header>

      <div className="grid w-full h-auto grid-cols-1 gap-8 md:grid-cols-3 md:h-80 relative z-10 px-4">
        
        {/* 1. Front of House */}
        <Tooltip content="Primary engagement layer. Sources of truth for customer data (CRM) and market signals.">
            <motion.div 
                className="relative flex flex-col justify-between h-full p-6 overflow-hidden bg-white border rounded-2xl dark:bg-stone-900 border-stone-200 dark:border-stone-700 shadow-sm z-20"
                animate={{
                    borderColor: flowStep === 0 ? "#3b82f6" : "",
                    boxShadow: flowStep === 0 ? "0 10px 30px -10px rgba(59, 130, 246, 0.2)" : "none"
                }}
            >
                {flowStep === 0 && (
                    <motion.div layoutId="active-border" className="absolute inset-0 border-2 border-blue-500 rounded-2xl pointer-events-none" transition={{ duration: 0.3 }} />
                )}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <Layout size={20} />
                    </div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-200">Front-of-House</h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">Origin</p>
                </div>
                
                <div className="flex-grow flex items-center justify-center relative my-4">
                    {flowStep === 0 ? (
                        <motion.div 
                            layoutId="data-token"
                            className="w-14 h-14 bg-blue-100 dark:bg-blue-600 rounded-xl flex flex-col items-center justify-center border-2 border-blue-200 dark:border-blue-400 text-blue-700 dark:text-white shadow-lg z-30"
                        >
                            <FileJson size={20} />
                            <span className="text-[8px] font-mono mt-1">JSON</span>
                        </motion.div>
                    ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-800" />
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {['Salesforce', 'HubSpot'].map(tool => (
                        <span key={tool} className="px-2 py-1 text-[9px] font-mono border rounded bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400">{tool}</span>
                    ))}
                </div>
            </motion.div>
        </Tooltip>

        {/* 2. Integration Layer (Middle) */}
        <Tooltip content="The connectivity fabric. Normalizes data schemas, handles API rate limits, and routes payloads between hubs via iPaaS.">
            <motion.div 
                className="relative flex flex-col justify-between h-full p-6 border rounded-2xl bg-stone-100/50 dark:bg-stone-950/50 border-stone-300 dark:border-stone-700 z-10"
                animate={{
                    borderColor: flowStep === 1 ? "#C5A059" : "",
                    backgroundColor: flowStep === 1 ? "rgba(197, 160, 89, 0.05)" : "transparent"
                }}
            >
                {flowStep === 1 && (
                    <motion.div layoutId="active-border" className="absolute inset-0 border-2 border-nobel-gold rounded-2xl pointer-events-none" transition={{ duration: 0.3 }} />
                )}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-nobel-gold/10 text-nobel-gold">
                        <Layers size={20} />
                    </div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-200">Integration Fabric</h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">Transform</p>
                </div>
                
                <div className="flex-grow flex items-center justify-center relative my-4">
                    {flowStep === 1 ? (
                        <motion.div 
                            layoutId="data-token"
                            className="w-16 h-16 bg-nobel-gold text-white rounded-full flex flex-col items-center justify-center shadow-xl z-30 ring-4 ring-nobel-gold/20"
                        >
                            <ArrowRight size={20} className="animate-pulse" />
                            <span className="text-[8px] font-bold mt-1">PROCESSING</span>
                        </motion.div>
                    ) : (
                         <div className="w-16 h-16 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700 opacity-50 flex items-center justify-center">
                            <Layers size={16} className="text-stone-300 dark:text-stone-600" />
                         </div>
                    )}
                </div>
                
                <div className="text-[10px] text-center text-stone-400 font-mono">
                    API • Webhooks • iPaaS
                </div>
            </motion.div>
        </Tooltip>

        {/* 3. Back of House */}
        <Tooltip content="Systems of Record for finance, HR, and operations. Receives clean, validated data for execution and compliance.">
            <motion.div 
                className="relative flex flex-col justify-between h-full p-6 overflow-hidden bg-white border rounded-2xl dark:bg-stone-900 border-stone-200 dark:border-stone-700 shadow-sm z-20"
                animate={{
                    borderColor: flowStep === 2 ? "#10b981" : "",
                    boxShadow: flowStep === 2 ? "0 10px 30px -10px rgba(16, 185, 129, 0.2)" : "none"
                }}
            >
                {flowStep === 2 && (
                    <motion.div layoutId="active-border" className="absolute inset-0 border-2 border-emerald-500 rounded-2xl pointer-events-none" transition={{ duration: 0.3 }} />
                )}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                        <Shield size={20} />
                    </div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-200">Back-of-House</h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">Destination</p>
                </div>
                
                <div className="flex-grow flex items-center justify-center relative my-4">
                    {flowStep === 2 ? (
                        <motion.div 
                            layoutId="data-token"
                            className="w-14 h-14 bg-emerald-100 dark:bg-emerald-600 rounded-xl flex flex-col items-center justify-center border-2 border-emerald-200 dark:border-emerald-400 text-emerald-700 dark:text-white shadow-lg z-30"
                        >
                            <Database size={20} />
                            <div className="absolute -top-1 -right-1">
                                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-300 bg-white dark:bg-black rounded-full" />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-800" />
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {['NetSuite', 'Workday'].map(tool => (
                        <span key={tool} className="px-2 py-1 text-[9px] font-mono border rounded bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400">{tool}</span>
                    ))}
                </div>
            </motion.div>
        </Tooltip>
      </div>

      <div className="flex items-center justify-between w-full max-w-2xl px-6 py-4 mt-8 text-xs bg-white border rounded-full dark:bg-stone-900 border-stone-200 dark:border-stone-700 shadow-sm relative z-20">
           <span className="font-mono text-stone-500 uppercase tracking-widest text-[10px]">Current Transaction:</span>
           <AnimatePresence mode="wait">
             <motion.span 
                key={packet.desc}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-bold text-stone-800 dark:text-stone-200"
             >
                {packet.label}
             </motion.span>
           </AnimatePresence>
           <div className="flex gap-1.5">
              {[0, 1, 2].map(step => (
                  <motion.div 
                    key={step}
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step === flowStep ? 'bg-nobel-gold' : 'bg-stone-200 dark:bg-stone-800'}`}
                    layout
                  />
              ))}
           </div>
      </div>
      <div className="mt-2 text-[10px] text-stone-400">{packet.desc}</div>
    </div>
  );
};
