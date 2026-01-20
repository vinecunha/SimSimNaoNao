import React from 'react';
import { Zap, ArrowRight, Crown, Check, Infinity, Star } from 'lucide-react';

export default function UpsellSelection({ onChoose }) {
  return (
    <div className="space-y-6 animate-in zoom-in duration-500 text-left">
      <div className="bg-white border-[4px] border-black rounded-[32px] overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-black p-6 text-white">
          <h3 className="text-2xl font-black uppercase italic leading-none flex items-center gap-2">
            ACORDO PRONTO! <Zap className="text-orange-500 fill-orange-500" />
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Escolha como deseja finalizar</p>
        </div>

        <div className="p-8 space-y-4">
          
          {/* OPÇÃO VITALÍCIA - PARA QUEM QUER ECONOMIA REAL */}
          <button 
            onClick={() => onChoose('lifetime')}
            className="w-full text-left p-6 border-[3px] border-black rounded-2xl bg-purple-50 hover:bg-purple-100 transition-all shadow-[6px_6px_0px_0px_black] active:translate-y-1 active:shadow-none flex justify-between items-center group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Infinity className="text-purple-600" size={20} />
                <h4 className="font-black text-lg uppercase italic leading-none">Acesso Vitalício</h4>
              </div>
              <p className="text-[10px] font-bold text-purple-700 uppercase italic">Um único pagamento, paz eterna</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-purple-400 uppercase leading-none">12x de</p>
              <p className="text-2xl font-black italic uppercase text-black">R$ 49,90</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase">ou R$ 497 à vista</p>
            </div>
          </button>

          {/* OPÇÃO ANUAL - O EQUILÍBRIO PERFEITO */}
          <div className="relative group">
            <div className="absolute -top-3 right-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-black z-10 animate-bounce">
              MAIS POPULAR
            </div>
            <button 
              onClick={() => onChoose('annual')}
              className="w-full text-left p-6 border-[3px] border-black rounded-2xl bg-orange-50 hover:bg-orange-100 transition-all shadow-[6px_6px_0px_0px_black] active:translate-y-1 active:shadow-none"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-black p-2 rounded-lg text-orange-500">
                  <Crown size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-orange-400 uppercase leading-none">12x de</p>
                  <p className="text-2xl font-black italic uppercase text-black">R$ 19,78</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">ou R$ 197/ano</p>
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                <li className="flex items-center gap-2 text-[9px] font-black uppercase"><Check size={12} className="text-green-600" /> Acordos ilimitados</li>
                <li className="flex items-center gap-2 text-[9px] font-black uppercase"><Check size={12} className="text-green-600" /> Dashboard Gestão</li>
                <li className="flex items-center gap-2 text-[9px] font-black uppercase"><Check size={12} className="text-green-600" /> Perfil Automático</li>
                <li className="flex items-center gap-2 text-[9px] font-black uppercase"><Check size={12} className="text-green-600" /> Suporte 24h</li>
              </ul>
            </button>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="h-[2px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase italic px-2">Ou uso único</span>
            <div className="h-[2px] flex-1 bg-gray-100"></div>
          </div>

          {/* OPÇÃO AVULSA - PREÇO DE TESTE */}
          <button 
            onClick={() => onChoose('single')}
            className="w-full text-left p-4 border-[3px] border-black rounded-2xl bg-white hover:bg-gray-50 transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="font-black text-sm uppercase italic leading-none text-gray-400 group-hover:text-black transition-colors">APENAS ESTE ACORDO</h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 italic">Sem histórico e sem painel</p>
            </div>
            <div className="text-right flex items-center gap-4">
              <p className="text-lg font-black italic text-black">R$ 27</p>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-gray-400">
        <Star size={12} fill="currentColor" />
        <p className="text-[9px] font-black uppercase italic tracking-widest text-center">Proteção Jurídica Digital • SimSimNaoNao © 2026</p>
        <Star size={12} fill="currentColor" />
      </div>
    </div>
  );
}