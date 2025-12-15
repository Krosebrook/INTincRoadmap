
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers, Layout, Shield, Database } from 'lucide-react';
import { FLOW_PACKETS } from '../../data/content';

export const IntegrationLayerDiagram: React.FC = () => {
  const [activePacketIndex, setActivePacketIndex] = useState(0);
  const [flowStep, setFlowStep] = useState(0); // 0: Start, 1: Middle, 2: End

  useEffect(() => {
    const totalSteps = 3; 
    const stepDuration = 1800; // ms per step
    
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

  return (
    <div className="flex flex-col items-center w-full max-w-5xl p-8 my-8 transition-colors duration-500 border rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 select-none relative overflow-hidden">
      
      {/* Background SVG Connectors with Animation (Desktop) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" aria-hidden="true">
        <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e7e5e4" stopOpacity="0.2"/>
                <stop offset="50%" stopColor="#C5A059" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#e7e5e4" stopOpacity="0.2"/>
            </linearGradient>
        </defs>
        {/* Animated flow lines */}
        <motion.line 
            x1="20%" y1="50%" x2="50%" y2="50%" 
            stroke="url(#lineGradient)" 
            strokeWidth="2" 
            strokeDasharray="4 4" 
            animate={{ strokeDashoffset: [0, -8] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.line 
            x1="50%" y1="50%" x2="80%" y2="50%" 
            stroke="url(#lineGradient)" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -8] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
        />
      </svg>

      <header className="flex items-center justify-between w-full mb-8 relative z-10">
          <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">Architecture Layers</h3>
          <div className="flex items-center gap-2 text-xs font-mono text-nobel-gold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nobel-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nobel-gold"></span>
            </span>
            LIVE DATA FLOW
          </div>
      </header>

      <div className="grid w-full h-auto grid-cols-1 gap-4 md:grid-cols-3 md:h-72 relative z-10">
        
        {/* 1. Front of House */}
        <div className="relative flex flex-col justify-between p-5 overflow-hidden bg-white border rounded-xl dark:bg-stone-900 border-stone-200 dark:border-stone-700 shadow-sm group">
            {flowStep === 0 && (
                <motion.div layoutId="highlight" className="absolute inset-0 border-2 border-blue-500/50 rounded-xl pointer-events-none" />
            )}
            <div>
                <h4 className="flex items-center gap-2 mb-2 font-bold text-stone-700 dark:text-stone-200">
                    <Layout size={18} className="text-blue-500"/> Front-of-House
                </h4>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Revenue Generating</p>
            </div>
            
            <div className="flex-grow flex items-center justify-center relative">
                 {flowStep === 0 && (
                     <motion.div 
                        layoutId="token"
                        className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 shadow-lg z-20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                     >
                        <ArrowRight size={20} />
                     </motion.div>
                 )}
                 {/* Ripple effect on activation */}
                 {flowStep === 0 && (
                    <motion.div 
                        className="absolute w-12 h-12 rounded-full border border-blue-400"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                 )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {['Salesforce', 'HubSpot', 'Outreach'].map(tool => (
                    <span key={tool} className="px-2 py-1 text-[10px] font-mono border rounded bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400">{tool}</span>
                ))}
            </div>
        </div>

        {/* 2. Integration Layer (Middle) */}
        <div className="relative flex flex-col justify-between p-5 border border-dashed rounded-xl bg-stone-100/50 dark:bg-stone-950/30 border-stone-300 dark:border-stone-600">
            {flowStep === 1 && (
                <motion.div layoutId="highlight" className="absolute inset-0 border-2 border-nobel-gold/50 rounded-xl pointer-events-none" />
            )}
            <h4 className="flex items-center gap-2 mb-2 text-sm font-bold text-nobel-gold justify-center">
                <Layers size={18}/> Integration Fabric
            </h4>
            
             <div className="flex-grow flex items-center justify-center relative">
                 {flowStep === 1 && (
                     <motion.div 
                        layoutId="token"
                        className="w-auto px-4 py-2 bg-nobel-gold text-white rounded-lg flex items-center justify-center shadow-lg gap-2 text-xs font-bold z-20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                     >
                        <Database size={12} />
                        Processing
                     </motion.div>
                 )}
            </div>
            
            <div className="text-[10px] text-center text-stone-400 font-mono mt-auto">Native • iPaaS • API</div>
        </div>

        {/* 3. Back of House */}
        <div className="relative flex flex-col justify-between p-5 overflow-hidden bg-white border rounded-xl dark:bg-stone-900 border-stone-200 dark:border-stone-700 shadow-sm">
            {flowStep === 2 && (
                <motion.div layoutId="highlight" className="absolute inset-0 border-2 border-emerald-500/50 rounded-xl pointer-events-none" />
            )}
            <div>
                <h4 className="flex items-center gap-2 mb-2 font-bold text-stone-700 dark:text-stone-200">
                    <Shield size={18} className="text-emerald-500"/> Back-of-House
                </h4>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Operations & Support</p>
            </div>
            
             <div className="flex-grow flex items-center justify-center relative">
                 {flowStep === 2 && (
                     <motion.div 
                        layoutId="token"
                        className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-300 shadow-lg z-20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                     >
                        <Database size={20} />
                     </motion.div>
                 )}
                 {/* Ripple effect on activation */}
                 {flowStep === 2 && (
                    <motion.div 
                        className="absolute w-12 h-12 rounded-full border border-emerald-400"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                 )}
            </div>

             <div className="mt-4 flex flex-wrap gap-2">
                {['NetSuite', 'Workday', 'Jira'].map(tool => (
                    <span key={tool} className="px-2 py-1 text-[10px] font-mono border rounded bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400">{tool}</span>
                ))}
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full p-4 mt-6 text-xs bg-white border rounded-lg dark:bg-stone-900 border-stone-200 dark:border-stone-700 shadow-sm">
           <span className="font-mono text-stone-500">CURRENT ACTION:</span>
           <AnimatePresence mode="wait">
             <motion.span 
                key={packet.desc}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="font-bold text-nobel-gold"
             >
                {packet.desc}
             </motion.span>
           </AnimatePresence>
           <div className="flex gap-1">
              {[0, 1, 2].map(step => (
                  <motion.div 
                    key={step}
                    className={`w-2 h-2 rounded-full ${step === flowStep ? 'bg-nobel-gold' : 'bg-stone-200 dark:bg-stone-700'}`}
                    animate={{ scale: step === flowStep ? 1.2 : 1 }}
                  />
              ))}
           </div>
      </div>
    </div>
  );
};
