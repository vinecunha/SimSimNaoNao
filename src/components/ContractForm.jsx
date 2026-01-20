import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MousePointer2, ArrowRight, UserCheck, ShieldCheck, UserPlus, Sparkles } from 'lucide-react';

export default function ContractForm({ dados, setDados, loading, onFinish }) {
  const [internalStep, setInternalStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qtdPrazo, setQtdPrazo] = useState('');
  const [unidadePrazo, setUnidadePrazo] = useState('DIAS');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        
        // Buscamos o perfil completo para garantir o e-mail comercial se existir
        const { data: perfil } = await supabase.from('perfis').select('*').eq('id', user.id).single();
        
        setDados(prev => ({
          ...prev,
          // Prioridade: Dados já no estado > Email do Perfil > Email do Auth
          emailContratante: prev.emailContratante || perfil?.email_comercial || user.email?.toUpperCase() || '',
          nomeContratante: prev.nomeContratante || perfil?.nome_completo?.toUpperCase() || user.user_metadata?.full_name?.toUpperCase() || '',
          docContratante: prev.docContratante || perfil?.documento || '',
          telContratante: prev.telContratante || perfil?.telefone || '',
          enderecoContratante: prev.enderecoContratante || perfil?.endereco_completo?.toUpperCase() || ''
        }));
      }
    };
    fetchUserData();
  }, [setDados]);

  useEffect(() => {
    if (qtdPrazo) {
      setDados(prev => ({
        ...prev,
        prazo: `${qtdPrazo} ${unidadePrazo}`
      }));
    }
  }, [qtdPrazo, unidadePrazo, setDados]);

  const maskDoc = (value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4").substring(0, 14);
    }
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  const maskPhone = (value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 10) {
      return clean.replace(/(\d{2})(\d{4})(\d{4})/g, "($1) $2-$3").substring(0, 14);
    }
    return clean.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3").substring(0, 15);
  };

  const handleMoneyChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setDados({ ...dados, valor: "" });
      return;
    }
    const result = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(value) / 100);
    setDados({ ...dados, valor: result.toUpperCase() });
  };

  const canAdvanceStep1 = dados.servico && dados.valor && dados.prazo && dados.nao;
  const canAdvanceStep2 = dados.nomeContratante && dados.docContratante && dados.emailContratante;

  return (
    <div className="bg-white border-[4px] border-black rounded-[32px] p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-left">
      <div className="mb-8">
        <h3 className="text-2xl font-black uppercase italic flex items-center gap-2 leading-none text-black">
          {internalStep === 1 && <>O QUE VAMOS ACORDAR? <MousePointer2 size={24} className="text-orange-500 animate-bounce" /></>}
          {internalStep === 2 && <>SEUS DADOS (EMISSOR) <UserCheck size={24} className="text-green-500" /></>}
          {internalStep === 3 && <>DADOS DO CLIENTE <UserPlus size={24} className="text-blue-500" /></>}
        </h3>
        <div className="flex gap-2 mt-4">
          <div className={`h-2 flex-1 rounded-full border-2 border-black ${internalStep >= 1 ? 'bg-orange-500' : 'bg-gray-100'}`}></div>
          <div className={`h-2 flex-1 rounded-full border-2 border-black ${internalStep >= 2 ? 'bg-green-500' : 'bg-gray-100'}`}></div>
          <div className={`h-2 flex-1 rounded-full border-2 border-black ${internalStep === 3 ? 'bg-blue-500' : 'bg-gray-100'}`}></div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onFinish(); }} className="space-y-6">
        {internalStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400">O que vamos acordar? (O Sim)</label>
              <input required className="w-full mt-1 p-4 bg-gray-50 border-[3px] border-black rounded-2xl font-bold text-lg text-black" placeholder="EX: GESTÃO DE TRÁFEGO" value={dados.servico} onChange={(e) => setDados({...dados, servico: e.target.value.toUpperCase()})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400">Valor</label>
                <input required className="w-full mt-1 p-4 bg-gray-50 border-[3px] border-black rounded-2xl font-bold text-lg text-black" placeholder="R$ 0,00" value={dados.valor} onChange={handleMoneyChange} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400">Prazo de Entrega</label>
                <div className="flex mt-1">
                  <input required type="number" className="w-20 p-4 bg-gray-50 border-[3px] border-black rounded-l-2xl border-r-0 font-bold text-lg text-black" placeholder="0" value={qtdPrazo} onChange={(e) => setQtdPrazo(e.target.value)} />
                  <select className="flex-1 p-4 bg-gray-100 border-[3px] border-black rounded-r-2xl font-black text-xs uppercase text-black" value={unidadePrazo} onChange={(e) => setUnidadePrazo(e.target.value)}>
                    <option value="DIAS">DIAS</option>
                    <option value="SEMANAS">SEMANAS</option>
                    <option value="MESES">MESES</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-red-500">E se o cliente vacilar? (O Não)</label>
              <textarea required rows="2" className="w-full mt-1 p-4 bg-red-50 border-[3px] border-black rounded-2xl font-bold text-red-700" placeholder="EX: SUSPENSÃO DOS SERVIÇOS." value={dados.nao} onChange={(e) => setDados({...dados, nao: e.target.value.toUpperCase()})} />
            </div>
            <button type="button" onClick={() => setInternalStep(2)} disabled={!canAdvanceStep1} className="w-full bg-black text-white py-6 rounded-2xl font-black text-2xl shadow-[0px_8px_0px_0px_#F97316] hover:translate-y-1 transition-all flex items-center justify-center gap-3 uppercase italic">
              CONTINUAR <ArrowRight strokeWidth={4} />
            </button>
          </div>
        )}

        {internalStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300 text-black">
            {isLoggedIn && (
              <div className="bg-green-50 border-2 border-green-200 p-3 rounded-2xl flex items-start gap-3 mb-2">
                <Sparkles className="text-green-600 shrink-0" size={18} />
                <p className="text-[10px] font-black uppercase text-green-700 leading-tight">PREENCHIDO VIA PERFIL.</p>
              </div>
            )}
            <input required className="w-full p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold" placeholder="SEU NOME" value={dados.nomeContratante} onChange={(e) => setDados({...dados, nomeContratante: e.target.value.toUpperCase()})} />
            <div className="grid grid-cols-2 gap-3">
              <input required className="p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold" placeholder="SEU CPF/CNPJ" value={dados.docContratante} onChange={(e) => setDados({...dados, docContratante: maskDoc(e.target.value)})} />
              <input required className="p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold" placeholder="SEU TELEFONE" value={dados.telContratante} onChange={(e) => setDados({...dados, telContratante: maskPhone(e.target.value)})} />
            </div>
            <input required type="email" className="w-full p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold uppercase" placeholder="SEU E-MAIL" value={dados.emailContratante} onChange={(e) => setDados({...dados, emailContratante: e.target.value.toUpperCase()})} />
            <input required className="w-full p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold text-xs" placeholder="SEU ENDEREÇO" value={dados.enderecoContratante} onChange={(e) => setDados({...dados, enderecoContratante: e.target.value.toUpperCase()})} />
            <button type="button" onClick={() => setInternalStep(3)} disabled={!canAdvanceStep2} className="w-full bg-black text-white py-4 rounded-xl font-black text-lg shadow-[4px_4px_0px_0px_#22C55E] hover:translate-y-1 transition-all uppercase italic">
              IR PARA DADOS DO CLIENTE
            </button>
          </div>
        )}

        {internalStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300 text-black">
            <input className="w-full p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold" placeholder="NOME DO CLIENTE" value={dados.nomeCliente} onChange={(e) => setDados({...dados, nomeCliente: e.target.value.toUpperCase()})} />
            <div className="grid grid-cols-2 gap-3">
              <input className="p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold" placeholder="CPF/CNPJ" value={dados.docCliente} onChange={(e) => setDados({...dados, docCliente: maskDoc(e.target.value)})} />
              <input className="p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold" placeholder="TELEFONE" value={dados.telCliente} onChange={(e) => setDados({...dados, telCliente: maskPhone(e.target.value)})} />
            </div>
            <input className="w-full p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold uppercase" placeholder="E-MAIL" value={dados.emailCliente} onChange={(e) => setDados({...dados, emailCliente: e.target.value.toUpperCase()})} />
            <input className="w-full p-3 bg-gray-50 border-[3px] border-black rounded-xl font-bold text-xs" placeholder="ENDEREÇO" value={dados.enderecoCliente} onChange={(e) => setDados({...dados, enderecoCliente: e.target.value.toUpperCase()})} />
            <button type="submit" className="w-full bg-orange-500 text-white py-5 rounded-xl font-black text-xl shadow-[0px_4px_0px_0px_black] hover:translate-y-1 transition-all flex items-center justify-center gap-2 uppercase italic">
              REVISAR ACORDO <ShieldCheck />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}