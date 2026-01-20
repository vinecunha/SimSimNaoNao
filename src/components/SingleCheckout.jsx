import React, { useState } from 'react';
import { FileCheck, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import ContractCanvas from './ContractCanvas';

export default function SingleCheckout({ dados, setStep }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(5); // Mesma tela de sucesso, mas com lógica de acesso único
    }, 2000);
  };

  return (
    <div className="bg-white border-[4px] border-black rounded-[32px] overflow-hidden shadow-[16px_16px_0px_0px_#000] animate-in slide-in-from-right duration-500">
      <div className="bg-black p-4 flex items-center gap-4 border-b-[4px] border-black text-white">
        <button onClick={() => setStep(2)} className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
          <ArrowLeft size={16} />
        </button>
        <span className="font-black uppercase text-sm tracking-tighter">Acesso Único</span>
      </div>

      <div className="p-6">
        <div className="opacity-60 scale-95 origin-top">
          <ContractCanvas dados={dados} />
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-500 font-bold text-xs px-4">
            Você está liberando apenas este documento com <span className="text-black">validade jurídica total</span>.
          </p>
        </div>

        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-black text-white p-6 rounded-2xl font-black text-xl hover:bg-orange-600 transition-all shadow-[8px_8px_0px_0px_#f97316] active:shadow-none active:translate-x-1 active:translate-y-1 flex justify-center items-center gap-2"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : "PAGAR R$ 19"}
        </button>

        <div className="mt-4 flex justify-center items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest">
          <ShieldCheck size={12} /> Link expira em 30 dias
        </div>
      </div>
    </div>
  );
}