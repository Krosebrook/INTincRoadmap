
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { APP_CONFIG } from '../../data/content';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-400 py-24 border-t border-stone-900">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 lg:col-span-2">
              <div className="text-white font-serif font-bold text-3xl mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-fusion-bolt flex items-center justify-center text-white text-lg">
                  <Zap size={18} fill="white" />
                </div>
                FlashFusion
              </div>
              <p className="text-sm leading-relaxed max-w-md text-stone-500">
                The 7-domain federated architecture for the next generation of creators. 
                Built on n8n-primary orchestration and Supabase RLS isolation. 
                99.9% cost efficiency, 100% visibility.
              </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6">Districts</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-fusion-bolt transition-colors">Dev District</a></li>
              <li><a href="#" className="hover:text-fusion-bolt transition-colors">AI Labs</a></li>
              <li><a href="#" className="hover:text-fusion-bolt transition-colors">Commerce Zone</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6">Compliance</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-fusion-bolt transition-colors">RLS Isolation</a></li>
              <li><a href="#" className="hover:text-fusion-bolt transition-colors">Zero Trust Transit</a></li>
              <li><a href="#" className="hover:text-fusion-bolt transition-colors">Audit Logs</a></li>
            </ul>
          </div>
      </div>
      
      <div className="container mx-auto px-6 mt-24 pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-stone-600">
          <div>© {currentYear} {APP_CONFIG.appName} FEDERATED ARCHITECTURE</div>
          <div className="italic">District Map v4.5 • Powered by n8n Metro</div>
      </div>
    </footer>
  );
};
