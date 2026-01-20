import React, { useState } from 'react';
import { Zap, Check, ArrowLeft, Loader2 } from 'lucide-react';
import ContractCanvas from './ContractCanvas';

export default function VitalicioCheckout({ dados, setStep }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(5); // Vai para a tela de Sucesso/Link Gerado
    }, 2000);
  };

  return (
    <div className="bg-white border-[4px] border-black rounded-[32px] overflow-hidden shadow-[16px_16px_0px_0px_#f97316] animate-in slide-in-from-right duration-500">
      <div className="bg-orange-500 p-4 flex items-center gap-4 border-b-[4px] border-black">
        <button onClick={() => setStep(2)} className="bg-black text-white p-2 rounded-full hover:scale-110 transition-transform">
          <ArrowLeft size={16} />
        </button>
        <span className="font-black uppercase text-sm tracking-tighter">Upgrade Vitalício</span>
      </div>

      <div className="p-6">
        <ContractCanvas dados={dados} />

        <div className="space-y-2 mb-6">
          {["Contratos Ilimitados", "Link de Assinatura Vitalício", "Suporte 24h"].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase bg-gray-50 p-2 border-2 border-black rounded-lg">
              <Check size={12} className="text-green-600" strokeWidth={4} /> {t}
            </div>
          ))}
        </div>

        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-black text-white p-6 rounded-2xl font-black text-xl hover:bg-orange-600 transition-all shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex justify-center items-center gap-2"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : <>PAGAR R$ 97 <Zap size={20} className="fill-orange-500" /></>}
        </button>
      </div>
    </div>
  );
}