import React from 'react';
import { ExternalLink, Download, Copy, Check, Calendar, DollarSign, Clock } from 'lucide-react';
import ContractLogoUpload from './ContractLogoUpload';

export default function ContractCard({ 
  acordo, 
  status, 
  onCopy, 
  isCopied, 
  onDownload, 
  onUpdateLogo, 
  onRemoveLogo 
}) {
  
  const calcularExpiracaoLink = () => {
    const dataCriacao = new Date(acordo.created_at);
    const hoje = new Date();
    const validadeLinkDias = 30; 
    
    const diffTime = hoje - dataCriacao;
    const diasPassados = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diasRestantes = validadeLinkDias - diasPassados;

    if (diasRestantes <= 0) return { texto: "Link Expirado", cor: "bg-red-500 text-white", urgente: true };
    if (diasRestantes <= 5) return { texto: `Expira em ${diasRestantes}d`, cor: "bg-orange-500 text-white", urgente: true };
    if (diasRestantes <= 10) return { texto: `Expira em ${diasRestantes}d`, cor: "bg-yellow-400 text-black", urgente: false };
    
    // Agora exibe a contagem regressiva mesmo quando está ativo/verde
    return { 
      texto: `ATIVO POR ${diasRestantes} DIAS`, 
      cor: "bg-green-100 text-green-800", 
      urgente: false 
    };
  };

  const expiraInfo = calcularExpiracaoLink();
  
  const statusColors = {
    'Assinado': {
      border: 'border-green-500',
      shadow: 'shadow-[6px_6px_0px_0px_#22c55e]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#22c55e]',
      badge: 'bg-green-100 text-green-700',
      accent: 'bg-green-500',
      icon: 'text-green-600'
    },
    'Expirado': {
      border: 'border-pink-500',
      shadow: 'shadow-[6px_6px_0px_0px_#ec4899]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#ec4899]',
      badge: 'bg-pink-100 text-pink-700',
      accent: 'bg-pink-500',
      icon: 'text-pink-600'
    },
    'Pendente': {
      border: 'border-orange-500',
      shadow: 'shadow-[6px_6px_0px_0px_#f97316]',
      hoverShadow: 'hover:shadow-[10px_10px_0px_0px_#f97316]',
      badge: 'bg-orange-100 text-orange-700',
      accent: 'bg-orange-500',
      icon: 'text-orange-600'
    }
  };

  const style = statusColors[status.label] || statusColors['Pendente'];

  return (
    <div className={`group bg-white border-[3px] border-black rounded-[28px] p-5 flex flex-col ${style.shadow} ${style.hoverShadow} hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden`}>
      
      {/* Badge de Status */}
      <div className={`absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black ${style.badge} z-10 shadow-[2px_2px_0px_0px_black]`}>
        <div className={`w-1.5 h-1.5 rounded-full ${style.accent} animate-pulse`}></div>
        <span className="text-[9px] font-black uppercase italic tracking-wider">{status.label}</span>
      </div>

      <div className="mb-6">
        <ContractLogoUpload 
          acordo={acordo} 
          onUploadSuccess={onUpdateLogo} 
          onRemoveLogo={onRemoveLogo} 
        />
      </div>

      <div className="flex-1 mb-6 text-left">
        <h4 className="font-black uppercase text-lg leading-[1.1] mb-2 truncate">
          {acordo.cliente_nome || 'Cliente não identificado'}
        </h4>
        <div className="inline-flex items-center bg-black text-white px-2 py-0.5 rounded-md">
            <p className="text-[9px] font-black uppercase italic truncate">{acordo.servico}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {/* Info Box */}
        <div className="grid grid-cols-2 border-[3px] border-black rounded-2xl divide-x-[3px] divide-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_black]">
          <div className="p-3 flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <DollarSign size={10} className={style.icon} />
              <span className="text-[8px] font-black text-gray-400 uppercase">Valor</span>
            </div>
            <p className="font-black text-[11px] italic truncate">{acordo.valor}</p>
          </div>
          <div className="p-3 flex flex-col gap-0.5 bg-gray-50">
            <div className="flex items-center gap-1">
              <Calendar size={10} className={style.icon} />
              <span className="text-[8px] font-black text-gray-400 uppercase">Criação</span>
            </div>
            <p className="font-black text-[11px] italic truncate">
              {new Date(acordo.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Validade do Link com contagem progressiva */}
        {!acordo.assinado_em && (
          <div className={`flex items-center justify-between px-3 py-2 border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_black] ${expiraInfo.cor} ${expiraInfo.urgente ? 'animate-pulse' : ''}`}>
            <div className="flex items-center gap-2">
              <Clock size={12} />
              <span className="text-[9px] font-black uppercase italic">VALIDADE DO LINK:</span>
            </div>
            <span className="text-[10px] font-black uppercase italic tracking-tight">
              {expiraInfo.texto}
            </span>
          </div>
        )}

        {/* Prazo do Serviço (após assinado) */}
        {acordo.assinado_em && (
          <div className="flex items-center justify-between px-3 py-2 border-[3px] border-black rounded-xl bg-gray-100 shadow-[3px_3px_0px_0px_black]">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={12} />
              <span className="text-[9px] font-black uppercase italic">Prazo Entrega:</span>
            </div>
            <span className="text-[10px] font-black uppercase text-black italic">
              {acordo.prazo || 'N/A'}
            </span>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="grid grid-cols-3 gap-2.5">
        <button 
          onClick={() => onCopy(acordo.id)} 
          className={`flex items-center justify-center py-3.5 rounded-xl border-[3px] border-black shadow-[3px_3px_0px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-50'}`}
        >
          {isCopied ? <Check size={20} /> : <Copy size={20}/>}
        </button>
        <button 
          onClick={() => onDownload(acordo)} 
          className="flex items-center justify-center py-3.5 bg-black text-white rounded-xl border-[3px] border-black shadow-[3px_3px_0px_0px_black] hover:bg-gray-800 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <Download size={20} />
        </button>
        <a 
          href={`/assinar/${acordo.id}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center py-3.5 bg-white border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_black] hover:bg-gray-50 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
}