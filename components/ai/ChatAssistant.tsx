
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, User, Bot, Zap, Cpu, History, Gauge, Send, DollarSign } from 'lucide-react';
import { InferenceOrchestrator } from '../../services/aiService';
import { useNavigation } from '../../hooks/useNavigation';
import { useCity } from '../../context/CityContext';
import { InferenceMetrics, HubId } from '../../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  metrics?: InferenceMetrics;
  cost?: number;
}

const SUGGESTIONS = [
  "How does n8n Metro work?",
  "Simulate DATA district fault",
  "Explain 99.9% cost efficiency",
  "Activate H100 Boost"
];

/**
 * ChatAssistant Component
 * 
 * Interactive AI intelligence interface for the platform architecture.
 * Features strict tool-calling integration and performance telemetry.
 */
export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "FlashFusion Planning Intelligence active. District status synchronized. How may I assist your urban stack today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { state, toggleDistrict, setTransitHub, resetSimulation, toggleGPUBooost } = useCity();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollToSection } = useNavigation();

  // Ensure scroll sticks to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text: string = input) => {
    const trimmedText = text.trim();
    if (!trimmedText || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmedText }]);
    setInput('');
    setIsTyping(true);

    try {
      const isBoosted = state.districts.AI.gpuAcceleration?.isBoosted ?? false;
      const response = await InferenceOrchestrator.chat(trimmedText, isBoosted);
      
      // Handle potential tool calls from the model
      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          switch (fc.name) {
            case 'navigateToSection':
              scrollToSection((fc.args as any).sectionId)();
              break;
            case 'triggerSimulationEvent':
              const { eventType, targetId } = fc.args as any;
              if (eventType === 'FAIL_DISTRICT') toggleDistrict(targetId as HubId);
              else if (eventType === 'SWITCH_TRANSIT') setTransitHub(targetId as any);
              else if (eventType === 'RESET') resetSimulation();
              break;
            case 'toggleGpuBoost':
              toggleGPUBooost();
              break;
          }
        }
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text,
        metrics: response.metrics,
        cost: response.costEstimate
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Platform reasoning interrupted. Please check your district connectivity or API cluster status." 
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, state.districts.AI.gpuAcceleration?.isBoosted, scrollToSection, toggleDistrict, setTransitHub, resetSimulation, toggleGPUBooost]);

  const isGPUActive = state.districts.AI.gpuAcceleration?.isBoosted;

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 right-0 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[3rem] shadow-4xl flex flex-col overflow-hidden"
          >
            {/* Assistant Header */}
            <div className="p-7 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg transition-all duration-700 ${isGPUActive ? 'bg-emerald-600' : 'bg-fusion-bolt'}`}>
                  {isGPUActive ? <Cpu size={24} className="animate-pulse" /> : <Zap size={22} fill="white" />}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 dark:text-stone-50 text-lg">Platform Intelligence</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isGPUActive ? 'bg-emerald-400 animate-pulse' : 'bg-fusion-metro'}`} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
                      {isGPUActive ? 'H100 Reserved Cluster' : 'Edge Inference Nodes'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                aria-label="Close Assistant"
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400"
              >
                <X size={22} />
              </button>
            </div>

            {/* Conversation Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 space-y-8 scroll-smooth scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-stone-100 dark:bg-stone-800' : 'bg-fusion-bolt/10 text-fusion-bolt'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`flex flex-col gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-stone-900 text-white rounded-tr-none' 
                        : 'bg-stone-50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 rounded-tl-none border dark:border-stone-800'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.metrics && (
                      <div className="flex flex-wrap items-center gap-3 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[8px] font-bold text-stone-500 border dark:border-stone-700 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Gauge size={10} /> {msg.metrics.totalLatency}ms</span>
                        {msg.cost !== undefined && <span className="flex items-center gap-1"><DollarSign size={10} /> {msg.cost.toFixed(4)}</span>}
                        {msg.metrics.cached && <span className="text-fusion-bolt flex items-center gap-1"><History size={10} /> Cached</span>}
                        {msg.metrics.accelerated && !msg.metrics.cached && <span className="text-emerald-500 flex items-center gap-1"><Zap size={10} /> GPU Accelerated</span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 ml-13">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Planning Urban Routes...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-7 py-4 flex flex-wrap gap-2 bg-stone-50/50 dark:bg-stone-950/50 border-t border-stone-100 dark:border-stone-800">
              {SUGGESTIONS.map(s => (
                <button 
                  key={s} 
                  onClick={() => handleSend(s)} 
                  className="text-[9px] font-bold uppercase tracking-[0.2em] px-3.5 py-2 border dark:border-stone-800 rounded-lg text-stone-500 hover:border-fusion-bolt hover:text-fusion-bolt transition-all bg-white dark:bg-stone-900"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="p-7 border-t dark:border-stone-800 bg-white dark:bg-stone-900"
            >
              <div className="relative">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Query urban stack infrastructure..." 
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-6 py-4.5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-fusion-bolt/30 dark:text-white transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-fusion-bolt text-white disabled:opacity-30 disabled:grayscale transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Assistant" : "Open Planning Intelligence"}
        className={`w-18 h-18 rounded-[2rem] shadow-3xl flex items-center justify-center transition-all duration-500 group ${isOpen ? 'bg-stone-900 text-white rotate-90 scale-90' : 'bg-fusion-bolt text-white hover:scale-110 hover:shadow-fusion-bolt/30'}`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? <X size={32} key="x" /> : <MessageSquare size={32} key="msg" />}
        </AnimatePresence>
        {!isOpen && (
          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-stone-950 animate-pulse transition-colors duration-700 ${isGPUActive ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-fusion-metro shadow-[0_0_10px_#ffd93d]'}`} />
        )}
      </button>
    </div>
  );
};
