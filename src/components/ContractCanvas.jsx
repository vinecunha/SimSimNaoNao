import React from 'react';
import { ShieldCheck, Clock, AlertCircle, FileText, User, Briefcase, CheckCircle } from 'lucide-react';

export default function ContractCanvas({ dados }) {
  if (!dados) return null;

  const toUp = (text) => text ? String(text).toUpperCase() : "---";
  
  // Normalização dos dados para aceitar tanto CamelCase (Form) quanto Snake_Case (DB)
  const info = {
    nomeEmissor: dados.nomeContratante || dados.emissor_nome || "---",
    docEmissor: dados.docContratante || dados.emissor_doc || "---",
    endEmissor: dados.enderecoContratante || dados.emissor_endereco || "---",
    nomeCliente: dados.nomeCliente || dados.cliente_nome || "A PREENCHER PELO CLIENTE",
    docCliente: dados.docCliente || dados.cliente_doc || "---",
    endCliente: dados.enderecoCliente || dados.cliente_endereco || "---",
    servico: dados.servico || "---",
    valor: dados.valor || "---",
    prazo: dados.prazo || "---",
    nao: dados.nao || dados.penalidade || "---",
    assinado: !!dados.assinado_em
  };

  // Só aplica o blur se NÃO estiver assinado. Uma vez assinado, os dados ficam visíveis.
  const protectedClass = !info.assinado ? "blur-[5px] select-none pointer-events-none" : "";

  return (
    <div id="contract-content" className="w-full bg-white border-[4px] border-black rounded-[32px] overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative select-none">
      
      {/* MARCA D'ÁGUA DE PROTEÇÃO */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] rotate-[-45deg] z-0">
        <p className="text-6xl font-black whitespace-nowrap">SIMSIMNAONAO SIMSIMNAONAO</p>
      </div>

      {/* CABEÇALHO DO DOCUMENTO */}
      <div className={`p-6 text-white flex items-center justify-between relative z-10 ${info.assinado ? 'bg-green-600' : 'bg-black'}`}>
        <div className="flex items-center gap-3">
          <ShieldCheck className={info.assinado ? "text-white" : "text-orange-500"} size={32} strokeWidth={2.5} />
          <div>
            <h4 className="font-black uppercase italic text-lg leading-none">
              {info.assinado ? "Acordo Formalizado" : "Minuta do Acordo"}
            </h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              {info.assinado ? `ID: ${dados.id?.substring(0,8)}` : "Validação Digital Ativa"}
            </p>
          </div>
        </div>
        <FileText className="text-gray-600 opacity-50" size={24} />
      </div>

      <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar text-left relative z-10">
        
        {/* SEÇÃO 1: PARTES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <User size={18} className="text-orange-500" />
            <h5 className="font-black uppercase italic text-sm">1. Das Partes</h5>
          </div>
          
          <div className="grid gap-4 text-[11px]">
            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="font-black text-gray-400 mb-1 uppercase text-[9px]">Contratante (Emissor)</p>
              <p className="font-bold text-black leading-relaxed">
                <span className={protectedClass}>{toUp(info.nomeEmissor)}</span><br />
                DOC: <span className={protectedClass}>{toUp(info.docEmissor)}</span><br />
                <span className={`text-gray-500 font-medium ${protectedClass}`}>{toUp(info.endEmissor)}</span>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="font-black text-gray-400 mb-1 uppercase text-[9px]">Contratado (Cliente)</p>
              <p className="font-bold text-black leading-relaxed">
                <span className={protectedClass}>{toUp(info.nomeCliente)}</span><br />
                DOC: <span className={protectedClass}>{toUp(info.docCliente)}</span><br />
                <span className={`text-gray-500 font-medium ${protectedClass}`}>{toUp(info.endCliente)}</span>
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: OBJETO E VALOR */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Briefcase size={18} className="text-orange-500" />
            <h5 className="font-black uppercase italic text-sm">2. Objeto e Investimento</h5>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold leading-relaxed uppercase">
              O CONTRATANTE adquire os serviços de <span className="text-orange-600 font-black">{toUp(info.servico)}</span>, 
              pelo valor de <span className={`text-orange-600 font-black ${protectedClass}`}>{toUp(info.valor)}</span>.
            </p>
            <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-xl border-2 border-orange-100">
              <Clock size={16} className="text-orange-500" />
              <p className="text-[11px] font-black uppercase">Prazo de Entrega: {toUp(info.prazo)}</p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: PENALIDADE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <AlertCircle size={18} className="text-red-500" />
            <h5 className="font-black uppercase italic text-sm text-red-600">3. Das Penalidades (O Não)</h5>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100">
            <p className={`text-xs font-bold text-red-800 leading-relaxed italic uppercase ${protectedClass}`}>
              "{toUp(info.nao)}"
            </p>
          </div>
        </section>

        {/* RODAPÉ ESTRUTURAL */}
        <div className="pt-6 border-t-2 border-black">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400">Local e Data</p>
              <p className="text-xs font-bold uppercase">BRASIL, {info.assinado ? new Date(dados.assinado_em).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="text-right">
              {info.assinado ? (
                <div className="flex items-center gap-2 text-green-600 font-black uppercase italic text-xs">
                  <CheckCircle size={16} /> Assinado Digitalmente
                </div>
              ) : (
                <div className="inline-block px-3 py-1 bg-gray-100 border-2 border-black rounded-lg text-[9px] font-black uppercase italic animate-pulse">
                  Aguardando Assinatura
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}