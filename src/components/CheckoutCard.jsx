import React from 'react';
import { Zap, FileText } from 'lucide-react';
import ContractCanvas from './ContractCanvas';

export default function CheckoutCard({ dados, setStep }) {
  return (
    <div className="bg-white border-[4px] border-black rounded-[32px] overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-300">
      <div className="bg-black p-5 flex justify-between items-center text-white font-black uppercase tracking-tighter">
        <span className="flex items-center gap-2 text-sm">
          <FileText size={16} className="text-orange-500" /> 
          Resumo do Acordo
        </span>
        <button onClick={() => setStep(1)} className="text-[10px] bg-white/10 px-3 py-1 rounded-full hover:bg-orange-500 transition-colors">EDITAR</button>
      </div>

      <div className="p-6">
        {/* Chamada do Módulo Canvas */}
        <ContractCanvas dados={dados} />

        <div className="text-center mb-6">
          <h4 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">Acordo Gerado!</h4>
          <p className="text-gray-500 font-bold text-[11px]">Selecione o plano para baixar o oficial:</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => setStep(3)}
            className="w-full bg-black text-white p-5 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-[6px_6px_0px_0px_#f97316] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-orange-400 tracking-[0.2em] mb-1 uppercase">Vitalício</span>
              <span className="flex items-center gap-2 text-lg uppercase">Acesso Elite (R$ 97) <Zap size={18} className="fill-orange-500 text-orange-500" /></span>
            </div>
          </button>

          <button 
            onClick={() => setStep(4)}
            className="w-full py-4 border-2 border-black rounded-2xl font-black text-[11px] hover:bg-gray-100 transition-colors uppercase tracking-widest"
          >
            Apenas este acordo (R$ 19)
          </button>
        </div>
      </div>
    </div>
  );
}