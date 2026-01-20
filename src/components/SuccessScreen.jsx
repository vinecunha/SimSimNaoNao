import React, { useState, useEffect } from 'react';
import { LockOpen, Copy, Check, MessageCircle, Download, LayoutDashboard, Home, Clock } from 'lucide-react';
import ContractCanvas from './ContractCanvas';
import { generatePDF } from '../utils/pdfGenerator';
import { useNavigate } from 'react-router-dom';

export default function SuccessScreen({ dados = {}, setStep, acordoSalvo = {} }) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const contractLink = `${window.location.origin}/assinar/${acordoSalvo?.id || 'id-pendente'}`;
  const isPremium = !!acordoSalvo?.user_id;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Olá! Acabei de gerar o nosso acordo jurídico ("${dados.servico}"). Você pode revisar e assinar digitalmente através deste link: ${contractLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(acordoSalvo);
    } catch (err) {
      alert("Erro ao processar documento jurídico.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white border-[4px] border-black rounded-[32px] overflow-hidden shadow-[16px_16px_0px_0px_#22c55e] animate-in zoom-in duration-300 relative text-left">
      
      <div className="bg-green-500 p-5 flex justify-between items-center text-white font-black uppercase tracking-tighter border-b-4 border-black">
        <span className="flex items-center gap-2 text-sm">
          <LockOpen size={18} fill="white" /> Acordo Liberado
        </span>
        <button onClick={() => setStep(1)} className="text-[10px] bg-white/20 px-3 py-1 rounded-full hover:bg-black transition-colors">NOVO</button>
      </div>

      <div className="p-6">
        <div className="mb-4 bg-white border-2 border-gray-100 rounded-xl overflow-hidden scale-[0.85] origin-top mb-[-20px]">
          <div id="contract-capture-area">
            <ContractCanvas dados={dados} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-[9px] font-black uppercase text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-200">
          <Clock size={12} /> Link válido por 30 dias para assinatura
        </div>

        <div className="mb-6 bg-gray-50 border-2 border-black rounded-2xl p-2 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex-grow px-3 overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 uppercase truncate">{contractLink}</p>
          </div>
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all border-2 border-black ${
              copied ? 'bg-green-500 text-white shadow-none translate-x-1 translate-y-1' : 'bg-black text-white hover:bg-orange-500 shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'COPIADO' : 'COPIAR'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          <button 
            onClick={shareWhatsApp}
            className="w-full bg-[#25D366] text-white border-2 border-black p-5 rounded-2xl font-black text-lg uppercase flex items-center justify-center gap-3 hover:bg-[#128C7E] shadow-[6px_6px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            <MessageCircle size={24} fill="white" /> Enviar para WhatsApp
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-white border-2 border-black p-4 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-gray-50 shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50"
          >
            <Download size={16} /> {isGenerating ? 'GERANDO...' : 'Baixar PDF'}
          </button>

          {isPremium ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-black text-white border-2 border-black p-4 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-orange-500 shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              <LayoutDashboard size={16} /> Ir ao Dashboard
            </button>
          ) : (
            <button 
              onClick={() => setStep(1)}
              className="bg-black text-white border-2 border-black p-4 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-orange-500 shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              <Home size={16} /> Novo Acordo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}