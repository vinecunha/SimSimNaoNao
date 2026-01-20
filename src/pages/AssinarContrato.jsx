import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, Shield, PenTool, Download, Loader2, Lock, ShieldCheck, Edit3, ArrowRight } from 'lucide-react';
import ContractCanvas from '../components/ContractCanvas';
import { generatePDF } from '../utils/pdfGenerator';

export default function AssinarContrato() {
  const { id } = useParams();
  const [acordo, setAcordo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assinando, setAssinando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  
  const [etapaOtp, setEtapaOtp] = useState('input'); 
  const [otpCodigo, setOtpCodigo] = useState('');
  const [carregandoOtp, setCarregandoOtp] = useState(false);

  const [formData, setFormData] = useState({
    cliente_nome: '',
    cliente_doc: '',
    cliente_tel: '',
    cliente_email: '',
    cliente_endereco: ''
  });

  useEffect(() => {
    fetchAcordo();
  }, [id]);

  const fetchAcordo = async () => {
    const { data, error } = await supabase.from('acordos').select('*').eq('id', id).single();
    if (!error && data) {
      setAcordo(data);
      setFormData({
        cliente_nome: data.cliente_nome || '',
        cliente_doc: data.cliente_doc || '',
        cliente_tel: data.cliente_tel || '',
        cliente_email: data.cliente_email || '',
        cliente_endereco: data.cliente_endereco || ''
      });
      if (data.assinado_em) setSucesso(true);
    }
    setLoading(false);
  };

  const maskDoc = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 11) {
      return v.replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return v.replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  };

  const maskPhone = (value) => {
    return value.replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/g, "($1) $2")
                .replace(/(\d)(\d{4})$/, "$1-$2")
                .substring(0, 15);
  };

  const emailValido = formData.cliente_email?.trim().length > 5 && formData.cliente_email?.includes('@') && formData.cliente_email?.includes('.');
  
  const todosCamposPreenchidos = 
    formData.cliente_nome?.trim().length > 3 && 
    formData.cliente_doc?.replace(/\D/g, '').length >= 11 && 
    emailValido &&
    formData.cliente_tel?.replace(/\D/g, '').length >= 10 &&
    formData.cliente_endereco?.trim().length > 10 &&
    etapaOtp === 'validado';

  const handleEnviarOTP = async () => {
    setCarregandoOtp(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.cliente_email.trim(),
    });
    if (error) alert("Erro: " + error.message);
    else setEtapaOtp('verificando');
    setCarregandoOtp(false);
  };

  const handleVerificarOTP = async () => {
    setCarregandoOtp(true);
    const { error } = await supabase.auth.verifyOtp({
      email: formData.cliente_email.trim(),
      token: otpCodigo.trim(),
      type: 'email'
    });
    if (error) alert("Código inválido.");
    else setEtapaOtp('validado');
    setCarregandoOtp(false);
  };

  const handleAssinarFinal = async () => {
    setAssinando(true);
    let userIP = "IP_NAO_CAPTURADO";
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        userIP = data.ip;
    } catch (e) { console.error(e); }

    const payload = { 
      ...formData,
      cliente_nome: formData.cliente_nome.toUpperCase(),
      cliente_endereco: formData.cliente_endereco.toUpperCase(),
      assinado_em: new Date().toISOString(),
      assinatura_ip: userIP,
      status: 'assinado' 
    };

    const { data: atualizado, error } = await supabase.from('acordos').update(payload).eq('id', id).select().single();
    if (!error) {
      setAcordo(atualizado);
      setSucesso(true);
    }
    setAssinando(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase italic text-black bg-[#fafafa]">CARREGANDO...</div>;

  if (sucesso) return (
    <div className="min-h-screen bg-[#22c55e] flex items-center justify-center p-6 text-black">
      <div className="bg-white border-[4px] border-black p-10 rounded-[40px] shadow-[16px_16px_0px_0px_black] max-w-md text-center">
        <CheckCircle size={80} className="text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-black uppercase italic mb-4">CONTRATO ASSINADO!</h2>
        <button onClick={() => generatePDF(acordo)} className="w-full bg-black text-white py-6 rounded-2xl font-black text-xl uppercase italic shadow-[0px_8px_0px_0px_#22c55e] flex items-center justify-center gap-3 transition-all active:translate-y-1 active:shadow-none">
          BAIXAR PDF <Download size={24} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6 text-left text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_#f97316]">
              <Shield className="text-orange-500" size={32} />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black">Assinatura Digital</h1>
          </div>
          {etapaOtp === 'validado' && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 border-[3px] border-green-600 px-4 py-2 rounded-xl bg-white shadow-[4px_4px_0px_0px_#22c55e] animate-in zoom-in">
              <ShieldCheck size={14} /> E-mail Validado
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 items-start">
          <div className="bg-white border-[4px] border-black rounded-[40px] p-3 shadow-[12px_12px_0px_0px_black] lg:sticky lg:top-8 scale-95 origin-top">
            <ContractCanvas dados={{...acordo, ...formData}} />
          </div>

          <aside className="bg-white border-[4px] border-black rounded-[40px] p-8 shadow-[16px_16px_0px_0px_#f97316]">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <PenTool size={20} className="text-orange-500" />
                <h3 className="font-black uppercase italic text-xl text-black">Dados do Assinante</h3>
              </div>

              <div className="flex flex-col gap-4">
                <input 
                  className="w-full p-4 border-[3px] border-black rounded-2xl font-bold uppercase text-black outline-none bg-gray-50 focus:border-orange-500 transition-all placeholder:text-gray-300" 
                  placeholder="NOME COMPLETO" 
                  value={formData.cliente_nome} 
                  onChange={(e) => setFormData({...formData, cliente_nome: e.target.value})} 
                />

                <div className="w-full">
                  {etapaOtp === 'verificando' ? (
                    <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-[1fr_100px] gap-3 h-[64px]">
                        <input 
                          className="w-full px-4 border-[3px] border-orange-500 rounded-2xl font-black text-center text-2xl tracking-[2px] text-black outline-none bg-orange-50 focus:bg-white transition-colors" 
                          placeholder="CÓDIGO"
                          maxLength={8} 
                          autoFocus 
                          value={otpCodigo} 
                          onChange={(e) => setOtpCodigo(e.target.value)} 
                        />
                        <button 
                          onClick={handleVerificarOTP} 
                          className="bg-black text-white rounded-2xl font-black uppercase text-sm shadow-[4px_4px_0px_0px_#f97316] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none"
                        >
                          {carregandoOtp ? <Loader2 className="animate-spin" size={20} /> : 'OK'}
                        </button>
                      </div>
                      <button onClick={() => setEtapaOtp('input')} className="text-[9px] font-black uppercase text-gray-400 hover:text-black ml-2 self-start transition-colors">Alterar e-mail informado</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <input 
                        readOnly={etapaOtp === 'validado'} 
                        className={`w-full p-4 border-[3px] border-black rounded-2xl font-bold uppercase text-black outline-none transition-all ${etapaOtp === 'validado' ? 'bg-gray-100 opacity-70 cursor-not-allowed border-green-500' : 'bg-gray-50 focus:border-orange-500'}`} 
                        placeholder="E-MAIL" 
                        type="email" 
                        value={formData.cliente_email} 
                        onChange={(e) => setFormData({...formData, cliente_email: e.target.value})} 
                      />
                      {emailValido && etapaOtp === 'input' && (
                        <button 
                          onClick={handleEnviarOTP}
                          className="text-[10px] font-black uppercase text-orange-500 hover:text-orange-600 text-left ml-2 mt-1 flex items-center gap-1 transition-all underline decoration-2 underline-offset-2"
                        >
                          {carregandoOtp ? <Loader2 className="animate-spin" size={12} /> : <>VERIFICAR ENDEREÇO DE E-MAIL <ArrowRight size={12} /></>}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <input 
                      className="w-full p-4 border-[3px] border-black rounded-2xl font-bold uppercase text-black outline-none bg-gray-50 focus:border-orange-500 transition-all placeholder:text-gray-300" 
                      placeholder="CPF/CNPJ" 
                      value={formData.cliente_doc} 
                      onChange={(e) => setFormData({...formData, cliente_doc: maskDoc(e.target.value)})} 
                   />
                   <input 
                      className="w-full p-4 border-[3px] border-black rounded-2xl font-bold uppercase text-black outline-none bg-gray-50 focus:border-orange-500 transition-all placeholder:text-gray-300" 
                      placeholder="CELULAR" 
                      value={formData.cliente_tel} 
                      onChange={(e) => setFormData({...formData, cliente_tel: maskPhone(e.target.value)})} 
                   />
                </div>

                <textarea className="w-full p-4 border-[3px] border-black rounded-2xl font-bold uppercase text-black h-24 outline-none resize-none bg-gray-50 focus:border-orange-500 transition-all placeholder:text-gray-300" placeholder="ENDEREÇO COMPLETO" value={formData.cliente_endereco} onChange={(e) => setFormData({...formData, cliente_endereco: e.target.value})} />
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleAssinarFinal}
                  disabled={assinando || !todosCamposPreenchidos}
                  className={`w-full py-7 rounded-2xl border-[4px] border-black font-black text-2xl uppercase italic transition-all flex items-center justify-center gap-3 ${
                    todosCamposPreenchidos 
                    ? 'bg-[#22c55e] text-black shadow-[0px_8px_0px_0px_black] hover:translate-y-1 hover:shadow-none' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300 shadow-none'
                  }`}
                >
                  {assinando ? <Loader2 className="animate-spin" /> : <>FINALIZAR ASSINATURA <Lock size={24}/></>}
                </button>
                
                {etapaOtp === 'validado' && (
                  <button onClick={() => {setEtapaOtp('input'); setOtpCodigo('');}} className="w-full mt-4 text-[9px] font-black uppercase text-gray-400 flex items-center justify-center gap-2 hover:text-black transition-colors">
                    <Edit3 size={12} /> DESBLOQUEAR E-MAIL PARA ALTERAÇÃO
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}