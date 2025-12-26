
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, User, Bot, Globe, Zap } from 'lucide-react';
import { startArchChat } from '../../services/aiService';
import { useNavigation } from '../../hooks/useNavigation';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

const SUGGESTIONS = [
  "Explain n8n Metro orchestration",
  "Show the 2027 expansion plan",
  "Why use Supabase RLS?",
  "FlashFusion vs Legacy stacks"
];

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to FlashFusion. I am the urban planning intelligence for your federated stack. How can I assist with your city infrastructure today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(startArchChat());
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollToSection } = useNavigation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: text });
      
      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'navigateToSection') {
            const sectionId = (fc.args as any).sectionId;
            scrollToSection(sectionId)();
          }
        }
      }

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web)
        .filter(Boolean);

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || "Synchronizing data...",
        sources: sources
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "District connection interrupted." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 right-0 w-[420px] h-[600px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[3rem] shadow-4xl flex flex-col overflow-hidden"
          >
            <div className="p-7 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-fusion-bolt flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                  <Zap size={20} fill="white" />
                </div>
                <div>
                  <h4 className="font-serif font-bold dark:text-stone-50 text-lg">FlashFusion AI</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">NOC Grounding Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 space-y-8 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-stone-100 dark:bg-stone-800' : 'bg-fusion-bolt/10 text-fusion-bolt border border-fusion-bolt/20'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className="flex flex-col gap-3 max-w-[82%]">
                    <div className={`p-5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-stone-900 text-white shadow-xl rounded-tr-none' : 'bg-stone-50 dark:bg-stone-800/40 dark:text-stone-300 rounded-tl-none border dark:border-stone-800'}`}>
                      {msg.text}
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.slice(0, 3).map((src, idx) => (
                          <a 
                            key={idx} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-fusion-bolt hover:text-white transition-all rounded-full text-[10px] font-bold text-stone-500 border dark:border-stone-700"
                          >
                            <Globe size={10} />
                            {src.title.length > 15 ? src.title.substring(0, 15) + '...' : src.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 ml-13">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-1 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Scanning urban grid...</span>
                </div>
              )}
            </div>

            <div className="px-7 py-3 flex flex-wrap gap-2 bg-stone-50/30 dark:bg-stone-950/30">
              {SUGGESTIONS.map(s => (
                <button 
                  key={s} 
                  onClick={() => handleSend(s)} 
                  className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 border dark:border-stone-800 rounded-lg text-stone-500 hover:border-fusion-bolt hover:text-fusion-bolt transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-7 border-t dark:border-stone-800 bg-white dark:bg-stone-900">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query city infrastructure..." 
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-fusion-bolt/30 dark:text-white transition-all shadow-inner"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-18 h-18 rounded-[2rem] shadow-3xl flex items-center justify-center transition-all duration-500 group ${isOpen ? 'bg-stone-900 text-white rotate-90 scale-90' : 'bg-fusion-bolt text-white hover:scale-110 hover:shadow-fusion-bolt/20'}`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? <X size={32} key="x" /> : <MessageSquare size={32} key="msg" />}
        </AnimatePresence>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-stone-950 animate-pulse" />
        )}
      </button>
    </div>
  );
};
