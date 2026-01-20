import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ContractForm from '../components/ContractForm';
import ContractCanvas from '../components/ContractCanvas';
import UpsellSelection from '../components/UpsellSelection';
import Navbar from '../components/Navbar'; // Importação do componente ajustado
import { Loader2, CheckCircle, Copy, Check, LayoutDashboard, Zap, Star, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formFinalizado, setFormFinalizado] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acordoSalvo, setAcordoSalvo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  
  const [dados, setDados] = useState({
    servico: '', valor: '', prazo: '', nao: '',
    nomeContratante: '', docContratante: '', emailContratante: '', telContratante: '', enderecoContratante: '',
    nomeCliente: '', docCliente: '', emailCliente: '', telCliente: '', enderecoCliente: ''
  });

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setUser(authUser);
      const { data: perfil } = await supabase.from('perfis').select('*').eq('id', authUser.id).single();
      
      if (perfil) {
        setDados(prev => ({
          ...prev,
          nomeContratante: perfil.nome_completo?.toUpperCase() || '',
          docContratante: perfil.documento || '',
          emailContratante: (perfil.emissor_email || authUser.email || '').toUpperCase(),
          telContratante: perfil.telefone || '',
          enderecoContratante: perfil.endereco_completo?.toUpperCase() || ''
        }));
      }
    }
  };

  const handleGerar = async (tipoPlano = 'premium') => {
    setLoading(true);
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (currentUser) {
      try {
        const payload = {
          servico: dados.servico, 
          valor: dados.valor, 
          prazo: dados.prazo, 
          penalidade: dados.nao,
          emissor_nome: dados.nomeContratante, 
          emissor_doc: dados.docContratante, 
          emissor_email: dados.emailContratante,
          emissor_tel: dados.telContratante, 
          emissor_endereco: dados.enderecoContratante,
          cliente_nome: dados.nomeCliente || null, 
          cliente_doc: dados.docCliente || null,
          cliente_email: dados.emailCliente || null, 
          cliente_tel: dados.telCliente || null,
          cliente_endereco: dados.cliente_endereco || null,
          user_id: currentUser.id,
          tipo_usuario: tipoPlano,
          pago: true,
          status: 'pendente',
          assinado_em: null,
          assinatura_ip: null
        };

        const { data, error } = await supabase.from('acordos').insert([payload]).select().single();
        if (error) throw error;
        setAcordoSalvo(data);
        setStep(5);
        setLoading(false);
      } catch (err) {
        alert(`ERRO AO SALVAR: ${err.message}`);
        setLoading(false);
      }
      return;
    }

    const linksKiwify = {
      single: "https://pay.kiwify.com.br/kgREaQf",
      annual: "https://pay.kiwify.com.br/Sy3CJ4T",
      lifetime: "https://pay.kiwify.com.br/jH5fNyK"
    };

    const checkoutUrl = linksKiwify[tipoPlano];

    if (checkoutUrl) {
      const params = new URLSearchParams({
        email: dados.emailContratante,
        name: dados.nomeContratante,
        custom_payload: JSON.stringify(dados)
      });
      window.location.href = `${checkoutUrl}?${params.toString()}`;
    } else {
      setLoading(false);
      alert("Erro ao identificar o plano selecionado.");
    }
  };

  const handleSelarClick = () => {
    if (user) {
      handleGerar('premium');
    } else {
      setShowUpsell(true);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/assinar/${acordoSalvo.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-left">
      {/* Navbar Unificada e Responsiva */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-6 md:py-12">
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center text-black">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-orange-500" size={48} />
              <p className="font-black uppercase italic text-sm">PROCESSANDO ACORDO SEGURO...</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4 md:space-y-8 lg:sticky lg:top-12">
              <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="inline-flex items-center gap-2 bg-orange-100 border-2 border-black px-4 py-2 rounded-full mb-4">
                  <Zap size={16} className="text-orange-600 fill-orange-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">CONTRATOS INSTANTÂNEOS</span>
                </div>
                <h1 className="text-[clamp(2.5rem,10vw,5.5rem)] font-black uppercase italic leading-[0.85] tracking-tighter mb-6 text-black">
                  SELAR UM <br />
                  <span className="text-orange-500">ACORDO</span> <br />
                  EM SEGUNDOS.
                </h1>
                <p className="text-base md:text-lg font-bold text-gray-500 max-w-md leading-tight mb-8 uppercase text-left">
                  PREENCHA O FORMULÁRIO AO LADO E VEJA SUA MINUTA JURÍDICA GANHAR FORMA EM TEMPO REAL.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex text-orange-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">+2.400 PROFISSIONAIS PROTEGIDOS</p>
                </div>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-right-8 duration-700 text-left relative">
              {!formFinalizado ? (
                <ContractForm 
                  dados={dados} 
                  setDados={setDados} 
                  loading={loading}
                  onFinish={() => setFormFinalizado(true)}
                />
              ) : (
                <>
                  {!showUpsell ? (
                    <div className="space-y-6 animate-in zoom-in duration-500">
                      <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">REVISE SUA MINUTA FINAL:</p>
                        <button onClick={() => setFormFinalizado(false)} className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-600 hover:underline">
                          <Edit3 size={14} /> EDITAR DADOS
                        </button>
                      </div>
                      <ContractCanvas dados={dados} />
                      <button onClick={handleSelarClick} className="w-full bg-black text-white py-6 rounded-3xl font-black text-2xl shadow-[0px_8px_0px_0px_#f97316] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 uppercase italic">
                        SELAR ACORDO AGORA
                      </button>
                    </div>
                  ) : (
                    <UpsellSelection 
                      onChoose={(tipo) => handleGerar(tipo)}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {step === 5 && acordoSalvo && (
          <div className="max-w-md mx-auto bg-white border-[4px] border-black rounded-[40px] p-8 shadow-[16px_16px_0px_0px_black] text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-3xl border-[3px] border-black flex items-center justify-center mx-auto mb-6 text-green-600 shadow-[4px_4px_0px_0px_black]">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black uppercase italic mb-2 leading-none text-left text-black">ACORDO SELADO!</h2>
            <p className="text-gray-500 font-bold text-sm mb-8 uppercase leading-relaxed text-left">
              COPIE O LINK E ENVIE PARA O CLIENTE ASSINAR AGORA MESMO.
            </p>
            <div className="space-y-4">
              <button onClick={copyLink} className="w-full flex items-center justify-center gap-3 p-5 bg-orange-500 text-white border-[3px] border-black rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_black] active:translate-y-1 active:shadow-none transition-all">
                {copied ? <Check size={20}/> : <Copy size={20}/>}
                {copied ? 'LINK COPIADO!' : 'COPIAR LINK DE ASSINATURA'}
              </button>
              <button onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center gap-3 p-5 bg-black text-white border-[3px] border-black rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_#22c55e] hover:translate-y-1 hover:shadow-none transition-all text-white">
                <LayoutDashboard size={20}/> MEUS ACORDOS
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}