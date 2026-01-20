import React from 'react';
import { CheckCircle, Mail, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border-[4px] border-black rounded-[40px] p-10 shadow-[16px_16px_0px_0px_black] text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-3xl border-[3px] border-black flex items-center justify-center mx-auto mb-6 text-green-600 shadow-[4px_4px_0px_0px_black]">
          <CheckCircle size={40} />
        </div>
        
        <h2 className="text-3xl font-black uppercase italic mb-4 leading-none text-left">PAGAMENTO CONFIRMADO!</h2>
        
        <div className="space-y-4 text-left mb-8">
          <p className="text-gray-500 font-bold text-sm uppercase leading-relaxed">
            Seu acordo foi gerado com sucesso e o link de assinatura foi enviado para o seu e-mail.
          </p>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-4 rounded-2xl flex items-center gap-3">
            <Mail className="text-orange-500" size={20} />
            <span className="text-[10px] font-black uppercase text-gray-400 italic">Verifique sua caixa de entrada e spam</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-3 p-5 bg-black text-white border-[3px] border-black rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_#f97316] active:translate-y-1 active:shadow-none transition-all"
          >
            ACESSAR MEU PAINEL <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}