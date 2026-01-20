import React from 'react';
import { Zap, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#fcfcfc] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">          
        <div className="pt-8 border-t-2 border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase text-gray-400">
            © 2026 SIMSIMNAONAO - TODOS OS DIREITOS RESERVADOS.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-gray-400 italic">PROTEÇÃO JURÍDICA ATIVA</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}